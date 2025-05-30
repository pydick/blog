module.exports = {
    title: 'pyidck’s blog',
    description: 'No pain, no gains!',
    // 注入到当前页面的 HTML <head> 中的标签
    head: [
        ['link', { rel: 'icon', href: '/favicon.png' }], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    base: '/blog/', // 这是部署到github相关的配置 下面会讲
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    themeConfig: {
        logo: '/favicon.png',
        sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
        lastUpdated: 'Last Updated', // 文档更新时间：每个文件git最后提交的时间
        nav: [
            { text: '前端进阶积累', link: '/accumulate/' }, // 内部链接 以docs为根目录
            { text: '算法', link: '/algorithm/' }, // 外部链接
            { text: '认知', link: '/cognize/' }, // 外部链接
        ],
        sidebar: {
            // docs文件夹下面的accumulate文件夹 文档中md文件 书写的位置(命名随意)
            '/accumulate/': [{
                title: '概述',
                collapsable: false, // false为默认展开菜单, 默认值true是折叠,
                children: [
                    ['vue开发插件.md', 'vue开发插件'], //菜单名称为'子菜单1'，跳转至/accumulate/test2.md
                    ['高德地图.md', '高德地图'],
                    ['svg.md', 'svg'],
                    ['axios的二次封装.md', 'axios的二次封装'],
                    ['promise.md', 'promise'],
                    ['async&await.md', 'async&await'],
                    ['es5面向对象oop.md', 'es5面向对象oop'],
                    ['归纳点.md', '归纳点'],
                    ['刷题.md', '刷题'],
                    // '/accumulate/JS/test', // 以docs为根目录来查找文件 
                    // 上面地址查找的是：docs>accumulate>JS>test.md 文件
                    // 自动加.md 每个子选项的标题 是该md文件中的第一个h1/h2/h3标题
                ]
            }],
            // docs文件夹下面的algorithm文件夹 这是第二组侧边栏 跟第一组侧边栏没关系
            '/algorithm/': [{
                title: '概述',
                collapsable: false, // false为默认展开菜单, 默认值true是折叠,
                children: [
                    ['数据结构.md', '数据结构'], //菜单名称为'数据结构'，跳转至/accumulate/数据结构.md
                    ['基础算法.md', '基础算法'], //菜单名称为'基础算法'，跳转至/accumulate/基础算法.md
                ]
            }],
            '/cognize/': [{
                title: '认知',
                collapsable: false, // false为默认展开菜单, 默认值true是折叠,
                children: [
                    ['test.md', 'test'], //菜单名称为'test'，跳转至/cognize/test.md
                ]
            }]
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': '../assets/images'
            }
        }
    }
};