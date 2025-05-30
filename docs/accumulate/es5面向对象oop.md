## JavaScript设计模式之面向对象编程
谈谈es5 面向对象

### 1、定义
简单来说，面向对象编程就是将你的需求抽象成一个对象，然后对这个对象进行分析，为其添加对应的特征（属性）与行为（方法），我们将这个对象称之为 类。
面向对象一个很重要的特点就是封装，虽然 javascript 这种解释性的弱类型语言没有像一些经典的强类型语言(例如C++，JAVA等)有专门的方式用来实现类的封装，但我们可以利用 javascript 语言灵活的特点，去模拟实现这些功能，接下里我们就一起来看看~

### 2、封装
创建一个类

在 javascript 中要创建一个类是很容易的，比较常见的方式就是首先声明一个函数保存在一个变量中（一般类名首字母大写），然后将这个函数（类）的内部通过对 this 对象添加属性或者方法来实现对类进行属性或方法的添加，例如
```js
//创建一个类
var Person = function (name, age ) {
	this.name = name;
	this.age = age;
}
```

我们也可以在类的原型对象(prototype)上添加属性和方法，有两种方式，一种是一一为原型对象的属性赋值，以一种是将一个对象赋值给类的原型对象：
```js
//为类的原型对象属性赋值
Person.prototype.showInfo = function () {
    //展示信息
    console.log('My name is ' + this.name , ', I\'m ' + this.age + ' years old!');
}

//将对象赋值给类的原型对象
Person.prototype = {
    showInfo : function () {
	    //展示信息
	    console.log('My name is ' + this.name , ', I\'m ' + this.age + ' years old!');
	}
}
```

这样我们就将所需要属性和方法都封装在 Person 类里面了，当我们要用的时候，首先得需要使用 new 关键字来实例化（创建）新的对象，通过 . 操作符就可以使用实例化对象的属性或者方法了~

```js
var person = new Person('Tom',24);
console.log(person.name)        // Tom
console.log(person.showInfo())  // My name is Tom , I'm 24 years old!
```

我们刚说到有两种方式来添加属性和方法，那么这两种方式有啥不同呢？

通过 this 添加的属性和方法是在当前对象添加的，而 javascript 语言的特点是基于原型 prototype 的，是通过 原型prototype 指向其继承的属性和方法的；通过 prototype 继承的方法并不是对象自身的，使用的时候是通过 prototype 一级一级查找的，这样我们通过 this 定义的属性或者方法都是该对象自身拥有的，我们每次通过 new 运算符创建一个新对象时， this 指向的属性和方法也会得到相应的创建，但是通过 prototype 继承的属性和方法是每个对象通过 prototype 访问得到，每次创建新对象时这些属性和方法是不会被再次创建的，如下图所示：

![oop图1](~@/oop1.png)
其中 constructor 是一个属性，当创建一个函数或者对象的时候都会给原型对象创建一个 constructor 属性，指向拥有整个原型对象的函数或者对象。
如果我们采用第一种方式给原型对象(prototype)上添加属性和方法，执行下面的语句会得到 true ：
```js
    console.log(Person.prototype.constructor === Person ) // true
```
那么好奇的小伙伴会问，那我采用第二种方式给原型对象(prototype)上添加属性和方法会是什么结果呢？
```js
    console.log(Person.prototype.constructor === Person ) // false
```
卧槽，什么鬼，为什么会产生这种结果？
原因在于第二种方式是将一整个对象赋值给了原型对象(prototype)，这样会导致原来的原型对象(prototype)上的属性和方法会被全部覆盖掉（pass: 实际开发中两种方式不要混用），那么 constructor 的指向当然也发生了变化，这就导致了原型链的错乱，因此，我们需要手动修正这个问题，在原型对象(prototype)上手动添加上 constructor 属性，重新指向 Person ，保证原型链的正确，即：

```js
    Person.prototype = {
		constructor : Person ,
		showInfo : function () {
			//展示信息
			console.log('My name is ' + this.name , ', I\'m ' + this.age + ' years old!');
		}
    }
    
    console.log(Person.prototype.constructor === Person ) // true

```

属性与方法的封装

在大部分面向对象的语言中，经常会对一些类的属性和方法进行隐藏和暴露，所以就会有 私有属性、私有方法、公有属性、公有方法等这些概念~
在 ES6 之前， javascript 是没有块级作用域的，有函数级作用域，即声明在函数内部的变量和方法在外部是无法访问的，可以通过这个特性模拟创建类的 私有变量 和 私有方法 ，而函数内部通过 this 创建的属性和方法，在类创建对象的时候，每个对象都会创建一份并可以让外界访问，因此我们可以将通过 this 创建的属性和方法看作是 实例属性 和 实例方法，然而通过 this 创建的一些方法们不但可以访问对象公有属性和方法，还能访问到类（创建时）或对象自身的私有属性和私有方法，由于权力这些方法的权力比较大，因此成为 特权方法 ，通过 new 创建的对象无法通过 . 运算符访问类外面添加的属性和和方法，只能通过类本身来访问，因此，类外部定义的属性和方法被称为类的 静态公有属性 和 静态公有方法 ， 通过类的原型 prototype 对象添加的属性和方法，其实例对象都是通过 this 访问到的，所以我们将这些属性和方法称为 公有属性 和 公有方法，也叫 原型属性 和 原型方法。
```js
        //创建一个类
	var Person = function (name, age ) {
    	    //私有属性
    	    var IDNumber = '01010101010101010101' ;
    	    //私有方法
            function checkIDNumber () {}
            //特权方法
            this.getIDNumber = function () {}
            //实例属性
            this.name = name;
            this.age = age;
            //实例方法
            this.getName = function () {}
	}

	//类静态属性
        Person.isChinese = true;
	//类静态方法
        Person.staticMethod = function () {
            console.log('this is a staticMethod')
        }

        //公有属性
	Person.prototype.isRich = false;
	//公有方法
        Person.prototype.showInfo = function () {}

```
通过 new 创建的对象只能访问到对应的 实例属性 、实例方法 、原型属性 和 原型方法 ，而无法访问到类的静态属性和私有属性，类的私有属性和私有方法只能通过类自身方法，即：
```js
        var person = new Person('Tom',24);

        console.log(person.IDNumber) // undefined
        console.log(person.isRich)  // false
        console.log(person.name) // Tom
        console.log(person.isChinese) // undefined
        
        console.log(Person.isChinese) // true
        console.log(Person.staticMethod()) // this is a staticMethod

```
创建对象的安全模式
我们在创建对象的时候，如果我们习惯了 jQuery 的方式，那么我们很可能会在实例化对象的时候忘记用 new 运算符来构造，而写出来下面的代码：
```js
        //创建一个类
	var Person = function (name, age ) {
		this.name = name;
		this.age = age;
	}
	
	var person = Person('Tom',24)
```

这时候 person 已经不是我们期望的那样，是 Person 的一个实例了~

```js
    console.log(person)  // undifined
```
那么我们创建的 name、age 都不翼而飞了，当然不是，他们被挂到了 window 对象上了，

```js
    console.log(window.name)  // Tom
    console.log(window.age)   // 24
```

我们在没有使用 new 操作符来创建对象，当执行 Person 方法的时候，这个函数就在全局作用域中执行了，此时 this 指向的也就是全局变量，也就是 window 对象，所以添加的属性都会被添加到 window 上，而我们的 person 变量在得到 Person 的执行结果时，由于函数中没有 return 语句， 默认返回了 undifined。

为了避免这种问题的存在，我们可以采用安全模式解决，稍微修个一下我们的类即可，

```js
    //创建一个类
	var Person = function (name, age) {
		// 判断执行过程中的 this 是否是当前这个对象 （如果为真，则表示是通过 new 创建的）
		if ( this instanceof Person ) {
			this.name = name;
			this.age = age;
		} else {
			// 否则重新创建对象
			return new Person(name, age)
		}
	}

```
ok，我们现在测试一下~

```js
	var person = Person('Tom', 24)
	console.log(person)         // Person
	console.log(person.name)    // Tom
	console.log(person.age)     // 24
	console.log(window.name)    // undefined
	console.log(window.age)     // undefined
```
这样就可以避免我们忘记使用 new 构建实例的问题了~

pass：这里我用的 window.name ，这个属性比较特殊，它是 window 自带的，用于设置或返回存放窗口的名称的一个字符串，注意更换~

### 3、继承

继承也是面型对象的一大特征，但是 javascript 中没有传统意义上的继承，但是我们依旧可以借助 javascript 的语言特色，模拟实现继承
#### 类式继承
比较常见的一种继承方式，原理就是我们是实例化一个父类，新创建的对象会复制父类构造函数内的属性和方法，并将圆形 __proto__ 指向父类的原型对象，这样就拥有了父类原型对象上的方法和属性，我们在将这个对象赋值给子类的原型，那么子类的原型就可以访问到父类的原型属性和方法，进而实现了继承，其代码如下：

```js
    //声明父类
    function Super () {
        this.superValue = 'super';
    }
    //为父类添加原型方法
    Super.prototype.getSuperValue = function () {
        return this.superValue;   
    }
	
    //声明子类
    function Child () {
        this.childValue = 'child';
    }
	
    //继承父类
    Child.prototype = new Super();
    //为子类添加原型方法
    Child.prototype.getChildValue = function () {
        return this.childValue;
    }

```
我们测试一下~
```js
    var child = new Child();
    console.log(child.getSuperValue());  // super
    console.log(child.getChildValue());  // child

```

但是这种继承方式会有两个问题，第一由于子类通过其原型 prototype 对其父类实例化，继承父类，只要父类的公有属性中有引用类型，就会在子类中被所有实例共用，如果其中一个子类更改了父类构造函数中的引用类型的属性值，会直接影响到其他子类，例如：

```js
//声明父类
    function Super () {
    	this.superObject = {
    		a: 1,
    		b: 2
    	}
    }


    //声明子类
    function Child () {}
    
    //继承父类
    Child.prototype = new Super();
    }

    var child1 = new Child();
    var child2 = new Child();
    console.log(child1.superObject);    // { a : 1 , b : 2 }
    child2.superObject.a = 3 ;
    console.log(child1.superObject);    // { a : 3,  b : 2 }

```
这会对后面的操作造成很大困扰！
第二，由于子类是通过原型 prototype 对父类的实例化实现的，所以在创建父类的时间，无法给父类传递参数，也就无法在实例化父类的时候对父类构造函数内部的属性进行初始化操作。
为了解决这些问题，那么就衍生出其他的继承方式。
构造函数继承
利用 call 这个方法可以改变函数的作用环境，在子类中调用这个方法，将子类中的变量在父类中执行一遍，由于父类中是给 this 绑定的， 因此子类也就继承了父类的实例属性，即：
```js

    //声明父类
    function Super (value) {
    	this.value = value;
    	this.superObject = {
    		a: 1,
    		b: 2
    	}
    }

    //为父类添加原型方法
    Super.prototype.showSuperObject = function () {
    	console.log(this.superValue);
    }

    //声明子类
    function Child (value) {
    	// 继承父类
        Super.call(this,value)
    }
    
    var child1 = new Child('Tom');
    var child2 = new Child('Jack');

    child1.superObject.a = 3 ;
    console.log(child1.superObject);    // { a : 3 , b : 2 }
    console.log(child1.value)           // Tom
    console.log(child2.superObject);    // { a : 1,  b : 2 }
    console.log(child2.value);          // Jack

```
Super.call(this,value) 这段代码是构造函数继承的精华，这样就可以避免类式继承的问题了~
但这种继承方式没有涉及到原型 prototype ， 所以父类的原型方法不会得到继承，而如果要想被子类继承，就必须要放到构造函数中，这样创建出来的每个实例都会单独拥有一份，不能共用，为了解决这个问题，有了 组合式继承。

#### 组合式继承
我们只要在子类的构造函数作用环境中执行一次父类的构造函数，在将子类的原型 prorotype 对父类进行实例化一次，就可以实现 组合式继承 ， 即：
```js
    //声明父类
    function Super (value) {
    	this.value = value;
    	this.superObject = {
    		a: 1,
    		b: 2
    	}
    }
    
    //为父类添加原型方法
    Super.prototype.showSuperObject = function () {
    	console.log(this.superObject);
    }
    
    //声明子类
    function Child (value) {
    	// 构造函数式继承父类 value 属性
        Super.call(this,value)
    }
    
    //类式继承
    Child.prototype = new Super();
    
    var child1 = new Child('Tom');
    var child2 = new Child('Jack');
    
    child1.superObject.a = 3 ;
    console.log(child1.showSuperObject());      // { a : 3 , b : 2 }
    console.log(child1.value)                   // Tom
    child1.superObject.b = 3 ;
    console.log(child2.showSuperObject());      // { a : 1,  b : 2 }
    console.log(child2.value);                  // Jack

```
这样就能融合类式继承和构造函数继承的有点，并且过滤掉其缺点。
看起来是不是已经很完美了，NO ， 细心的同学可以发现，我们在使用构造函数继承时执行了一遍父类的构造函数，而在实现子类原型的类式继承时又调用了一父类的构造函数，那么父类的构造函数执行了两遍，这一点是可以继续优化的。

#### 寄生组合式继承


--------------------------------转载：https://juejin.im/post/6844903668320321544
