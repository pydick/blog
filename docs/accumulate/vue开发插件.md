## 开发一个Vue插件
>Vue 项目开发过程中​，经常用到插件，比如原生插件 vue-router、vuex，还有 element-ui 提供的 notify、message 等等。这些插件让我们的开发变得更简单更高效。那么 Vue 插件是怎么开发的呢​？​如何自己开发一个 Vue 插件

本文涉及技术点：

1. Vue 插件的本质
2. Vue.extend() 全局方法
3. 如何手动挂载 Vue 实例
4. Vue.use() 的原理

### 1、定义
什么是Vue插件，它和Vue组件有什么区别​？​来看一下官网的解释：

>“插件通常用来为 Vue 添加全局功能。”
>“组件是可复用的 Vue 实例，且带有一个名字。”
>—— Vue.js 官网

Emmmm，似乎好像有种朦胧美。。。

我来尝试解释一下，其实， Vue 插件 和 Vue组件 只是在 Vue.js 中包装的两个概念而已​，不管是插件还是组件，最终目的都是为了实现逻辑复用。它们的本质都是对代码逻辑的封装，只是封装方式不同而已。在必要时，组件也可以封装成插件，插件也可以改写成组件，就看实际哪种封装更方便使用了。

除此之外，插件是全局的，组件可以全局注册也可以局部注册。

我们今天只聚焦 Vue 插件。

>插件一般有下面几种：
>添加全局方法或者属性。如: vue-custom-element
>添加全局资源：指令/过滤器/过渡等。如 vue-touch
>通过全局混入来添加一些组件选项。如 vue-router
>添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现。
>一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 vue-router
>—— Vue.js 官网

```js
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或 property
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```

### 2、插件的使用
插件需要通过`Vue.use()`方法注册到全局，并且需要在调用`new Vue()`启动应用之前完成。之后在其他`Vue`实例里面就可以通过`this.$xxx`来调用插件中提供的`API`了。

下面以实现一个简易的提示框插件`toast`为例，给大家介绍怎么一步一步开发和发布一个`Vue`插件。

希望达到的效果：
在 main.js 中 use：
```js
// src/main.js
import Vue from 'vue'
import toast from '@champyin/toast'

Vue.use(toast)
```

在 `App.vue` 的生命周期 `mounted` 方法里调用 `this.$toast()`：
```vue
// src/App.vue
<template>
 <div>
   <button @click='handleClick'>Toast</button>
 </div>
</template>
<script>
export default {
    name: 'demo',
    methods: {
      handleClick() {
      this.$toast({
        type: 'success',
        msg: '成功',
        duration: 3
      })
    }
  }
}
</script>
```
运行后在页面上点击按钮，弹出 成功 的提示，然后3秒后消失。
![效果图](~@/vueplugin1.png)

### 3、插件开发
1. 编写 `toast` 的本体。
在 Vue 项目（你可以使用 `Vue-cli` 快速生成一个 `Vue` 项目，也可以自己用 `webpack` 搭建一个）的 `src` 目录下创建 `components/Toast/index.vue` 文件。
```vue
// src/components/Toast/index.vue
<template>
  <transition name='fade'>
    <div class='uco-toast' v-if='isShow'>
      <span :class='iconStyle'></span>
      <span>{{msg}}</span>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      type: 'success',
      msg: '成功',
      duration: 1,
    };
  },
  computed: {
    iconStyle() {
      return `tfont icon-${this.type} toast-icon`;
    },
  },
  mounted() {
    this.isShow = true;
    setTimeout(() => {
      this.isShow = false;
    }, this.duration * 1000);
  },
};
</script>

<style lang='less' scoped>
// 样式略
</style>
```

现在 `toast` 本体完成了，但是它里面的数据目前没法改变，因为我没有给它定义 `props` 属性。这不是 `bug`，而是，插件并不是通过 `pops` 来传值的。
2. 手动挂载 `toast` 实例的 `dom`

为了给插件传值，可以利用基础 `Vue` 构造器 `Vue.extend()` 创建一个“子类”。这个子类相当于一个继承了 `Vue` 的 `Toast` 构造器。然后在 `new` 这个构造函数的时候，给 `Toast` 的 `data` 属性传值，然后手动调用这个实例的 `$mount()` 方法手动挂载，最后使用原生`JS`的 `appendChild` 将真实 `DOM` （通过实例上的 `$el` 属性获取）添加到 `body` 上。

在 `src` 目录下新建 `components/Toast/index.js` 文件：
```js
// src/components/Toast/index.js
import Vue from 'vue';
import Toast from './index.vue';

// 使用 Vue.extend() 创建 Toast 的构造器
const ToastConstructor = Vue.extend(Toast);

const toast = function(options = {}) {
    // 创建 Toast 实例，通过构造函数传参，
    // 并调用 Vue 实例上的 $mount() 手动挂载
    const toastInstance = new ToastConstructor({
        data: options
    }).$mount();

    // 手动把真实 dom 挂到 html 的 body 上
    document.body.appendChild(toastInstance.$el);

    return toastInstance;
};

// 导出包装好的 toast 方法
export default toast;
```

3. 暴露 `install` 方法给 `Vue.use()` 使用。
>为了支持 Vue.use()，Vue.js 的插件应该暴露一个 install 方法。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象。
—— Vue.js 官网

通过 `Vue.js` 源码也可以看出，`Vue.use()` 方法所做的事情就是调用插件或者组件的 `install` 方法，然后把全局 `Vue` 传进去供插件和组件使用。
```js
// https://github.com/vuejs/vue/blob/dev/src/core/global-api/use.js
/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
```

在 `src` 目录下新建 `components/index.js` 文件，定义一个 `install` 方法，在里面将 `toast` 实例放到 `Vue.prototype` 上作为 `Vue` 实例的方法暴露到全局。
```js
// src/components/index.js
import toast from './Toast/index';
import '../icon/iconfont.css';

// 准备好 install 方法 给 Vue.use() 使用
export function install(Vue) {
  if (install.installed) return;
  install.installed = true;

  // 将包装好的 toast 挂到Vue的原型上，作为 Vue 实例上的方法
  Vue.prototype.$toast = toast;
}

// 默认导出 install
export default {
  install,
};
```

现在插件就开发完成了，可以在当前项目中本地引用这个插件了。
```js
//在 main.js 中
import toast from src/components/index.js;
Vue.use(toast);

//在 App.vue 中
handleClick(){
  this.$toast();
}
```



