## 项目架构优化



## 项目基本目录结构

* views文件夹

  views 目录用于存放项目功能模块的页面，需要根据路由配置情况分割子级目录。

* config 目录

  config 目录存放一些配置目录，比如第三方类库引用，路由配置等。

* store 目录

  store 目录用于存放项目 store 相关的文件，包括数据的获取和封装等。

* components 目录

  components 目录用于存放非业务组件，或者在多个业务间都需要用到的共用组件。

### 路由配置

什么是路由？ 路由是用来区分一个网站不同功能模块的地址，浏览器通过访问同一站点下的不同路由，来访问网站的不同功能。同样路由也让开发者区分返回的内容。

**如何做前端路由**

HTML5 API 中的 `history` 能够让我们控制 url 跳转之后并不刷新页面，而是交给我们的 JS 代码进行相应操作。在 history api 出现之前，我们可以使用 hash 跳转来实现。

`history` api 可以监听到 url 变化这个事件并阻止向服务器发页面跳转的请求并做前端页面跳转的操作。一般前端路由跳转就是显示新的页面给用户看并通过 AJAX 去向后台请求数据。

**React  中的路由**

`React-router` 是一个非常好用的路由控制插件，能够让我们像书写 JSX 组件一样控制路由的跳转。 

* react-router 是 React Router 核心
* react-router-dom 用于 DOM 绑定的 React Router
* react-router-native 用于 React Native 的 React Router
* react-router-redux 是 React Native 的 React Router
* react-router-config 静态路由配置的小助手。

`react-router-dom` 相比多出了 `<Link>` `<BrowserRouter>` 这样的 DOM 类组件。

`route` 要放在 `router`中。`router ` 包裹的众多 `route` 只能显示匹配路由的那个组件。

```javascript
// 	/client/config/router.jsx
import React from 'react';
import {
    Route
} from 'react-router-dom'

import TopicList from '../views/top-list/index'
import TopicDetail from '../views/top-detail/index';

// export 了一个组件数组
// react16 之后，不要求组件渲染后的内容有且仅有一个父标签。可以返回一个数组，把同一层级的组件都放在这个数组里面。
export default () => [
   	<Route path="/" component={TopicList} exact />,
    <Route path="/detail" component={TopicDetail} />
]
```

```javascript
// /views/App.jsx
const React = require('react');
import Routes from '../config/router'

export default class App extends React.Component {
    conponentDidMount() {
        // do something here
    }
    render() {
        return [
            <div>this is App.jsx</div>,
            <Routes	/>
        ]
    }
}

```

```javascript
// app.js
import ReactDOM from 'react-dom'
import React from 'react'
import App from './views/App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'

const root = document.getElementById('root')

const render = (Component) => {
    ReactDOM.hydrate( 
        <AppContainer>
            <Router>
                <Component />
            </Router>
        </AppContainer>,
        root
    )
}

render(App)

if(module.hot) {
    module.hot.accept('./views/App.jsx', () => {
        const NextApp = require('./views/App.jsx').default
        render(NextApp)
    })
}
```

`在webpack.base.js 中加一行代码，以支持我们不用写 `.jsx` 后缀名。

```
module.exports = {
    ...
    resolve: [
        extensions: ['.js','.jsx']
    ]
    .,.
}
```

### store 的配置

伴随 react 一起诞生的，是 Facebook 推出的一套前端数据流方案，叫做 `flux` , 在其中数据存储的地方，就叫做 `store` 

`flux` 又叫单向数据流。

`store` 中任何数据的变化会立刻影响到视图层的渲染效果。

`Mobx` 是 `flux` 实现的后起之秀，其以更简单的使用和更少的概念，让 `flux` 使用起来变得更加简单。相比 `Redux` 有 `mutation` 、`action`、`dispatch` 等概念，`Mobx` 则更符合对一个 `store` 的增删改查的操作概念。

```
npm i mobx mobx-react -S
```

`mobx-react` 是一个用于连接 `mobx` 和 `react` 的一个应用。

`Mobx` demo:

```javascript
import {
    observable,
    action
} from 'mobx'

const mobxStore = observable({
    count: 0,
    add: action(function(num) {
        this.count += num
    })
})

mobxStore.add(1)
```

通过 `observable` 声明的对象是 `reactive` 的（即是响应式的）。只要改了里面的任意值，就会通知页面重新渲染。 

`redux` 中是每次不能直接修改对象中的某个值，而必须用一个全新的对象来覆盖之前的对象。故每次 `redux` 中的值变化后，整个页面中所有依赖 `redux store` 中数据的部分都全部重新渲染，浪费了性能（尽管react的 dom diff 算法的效率很高）。

下面把 `mobx` 加入到我们的项目中去：

```javascript
// 	/client/store/app-state.js
import {
    observable,
    computed
} from 'mobx'

class AppState {
    @observable count = 0;
	@observable name = 'Jocky';
    @computed get msg() {
		return `${this.name} say count is ${this.count}`
    }
    @action changeName(name) {
        this.name = name
    }
}

const appState = new AppState()
export default appStore
```

为了支持 `mobx` 的一些装饰器语法，我们需要在 `babel` 的配置里面增加一些内容：

```
{
    "plugins": ["@babel/plugin-proposal-decorators", { "legacy": true }]
}
```

`transform-decorators-legacy` 是一个 `babel` 插件。

```
npm install @babel/plugin-proposal-decorators -D
```

在 `Babel v7` 中，所有的 `stage presets` 都被废弃了。

```javascript
// app.js

import ReactDOM from 'react-dom'
import React from 'react'
import { Provider } from 'mobx-react'
import App from './views/App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import appState from './store/app-state'

const root = document.getElementById('root')

const render = (Component) => {
    ReactDOM.render( 
        <AppContainer>
            <Provider appState = { appState }>
                <Router>
                    <Component />
                </Router>
            </Provider>
        </AppContainer>,
        root
    )
}

render(App)
...
```

```javascript
// 在需要使用 appState 数据的地方
import React from 'react'
import {
    observer,
    inject
} from 'mobx-react'
import PropTypes from 'prop-types'
import { AppState } from '../.,/store/app-sate'

@inject('appState') @observer

export default class TopicList extends React.Component {
    constructor() {
        super()
        this.changeName = this.changeName.bind(this)
    }
    render() {
        return (
            <input type="text" onChange={this.changeName} />
            <span>
            	{this.props.appState.msg}
            </span>
        )
    }
    changeName(event) {
        this.props.appState.changeName(event.target.value)
    }
}

TopicList.propTypes = {
    appState: PropTypes.instanceOf(AppState)
}
```

#### Cnode API 的使用

```javascript
const bodyParser = require('body-parser')
const express = require('express')
const favicon = require('server-favicon')
const session = require('express-session')
const path = require('path')

const app = express()
app.use(bodyParser.json())	// 解析post上来的 application/json 数据
app.use(bodyParser.urlencoded({extended: false}))	// 解析 post 上来的 application/x-www-form-urlencoded 类型数据
app.use(favicon(path.join(__dirname, '../favicon.ico')))

app.use(session({
    maxAge: 10*60*1000,
    name: 'tid'	// cookieId 的名字
    resave: false，
    saveUninitialized: false，
    secret: 'react cnode class'
}))
```

> session配置项中的 resave ： 即每次请求是否都需要重新生成一个 cookieId. 设置为 true 时，可能造成比较大的资源浪费。一般同一服务器启了多个相同服务时可能需要设置为 true
>
> saveUninitialized: 在没有session 值的时候，是否需要重新声明一个。
>
> secret: 是一个密钥，程序会拿着这个 secret 去加密 cookie

> Content-Type 请求报文主体
>
> Content-Type： 请求报文主体的类型、编码。常见的类型有 `text/plain`、 `application/json` 、 `application/x-www-form-urlencoded` 。常见的编码有 `utf-8` 、`gbk` 等。
>
> Content - Encoding: 声明报文主体的压缩格式，常见的取值有 `gzip`、 `deflate` 、`indentity`
>
> 报文主体： 即要上传的报文内容。

body-parser 主要做了什么

`body-parser` 实现的要点如下： 

1. 处理不同类型的请求体。比如：`text` 、`json`、`urlencoded` 等，对应的报文主体的格式不同。`json` 即 `bodyParser.json()` 。`urlencoded` 即 `x/www-form-urlencoded` 为 `bodyParser.urlencoded({ extended: falsle })`
2. 处理不同的编码。比如 `utf8` 、 `gbk` 等。
3.  处理不同的压缩类型。比如 `gzip` 、`deflate` 等。
4. 其他边界、异常的处理。

> Session 一般译作 `会话`，牛津词典对其的解释是进行某活动连续的一段时间。在 web 应用的用户看来，session 是另一种记录客户状态的机制。不同的是Cookie保存在客户端浏览器中，而session保存在服务器上。
>
> 客户端浏览器访问服务器的时候，服务器把客户端信息以某种形式记录在服务器上，客户端浏览器再次访问时只需要从该 Session 中查找客户的状态就可以了。

> Session 的原理： 
> 基本原理是 服务端为每一个 session 维护一份会话信息数据，而客户端和服务端依靠一个全局唯一的标志来访问会话信息数据。用户访问web应用时，服务端程序决定何时创建 session , 创建 session 可以概括为三个步骤：
>
> 1. 生成全局唯一的标识符（sessionId）
> 2. 开辟数据存储空间。一般会在内存中创建相应的数据结构，但这种情况下，系统一旦掉电，所有的会话数据都会丢失。不过也可以写到文件甚至在数据库中，这样虽然增加了 I /O 开销，但 session 可以实现某种程度的持久化，而且有利于session 的共享
> 3. 将 session 的全局唯一标识符发送给客户端。

#### 服务端渲染的优化

浏览器端的请求过来之后，我们服务端渲染的内容要根据 router 路径的不同返回不同的前端 html 页面。

**路由跳转**

使用者可能从任意路由进入我们的网站，所以在服务端也必须处理路由跳转，在返回给客户端的时候就是指定的页面。

**store 数据同步**

每个页面会有对应的数据，在服务端渲染时渲染时已经请求过对应的数据，所以要让客户端知道这些数据，在客户端渲染时直接使用，而不是通过 API 再次请求，造成浪费。

即 服务端渲染时已经把要展示的数据放在 html 中了，故返回给浏览器端后，浏览器端不应该再次发送网路请求来获取页面展示所需的数据。

服务端 `server-entry.js`

```javascript
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'
import App from './views/App'

// 让 mobx 在服务端渲染的时候不会重复数据变换
useStaticRendering(true)

export default (stores, routerContext, url) => {
    return (
        <Provider {...stores}>
        	<StaticRouter context={routerContext} location={url}>
        		<App />
        	</StaticRouter>
        </Provider>
    )
}
```

```javascript
// dev-static.js 部分代码
module.exports = function(app) {
    app.use('/public', proxy({
        target: 'http://localhost:8888'
    }))
    app.get('*', function(req, res) {
        getTemplate().then(template => {
            const routerContext = {}
            const app = serverBundle(createStoreMap(), routerContext, req.url)
            
            const content = ReactDomServer.renderToString(app)
            
            if(routerContext.url) {
                res.status(302).setHeader('Location', routerContext.url)
                res.end()
               	return ;
            }
            
            res.send(template.replace('<!-- app -->', content))
        })
    })
}
```

#### 服务端渲染的路由

##### 加入 router 和 store 后的服务端渲染的优化

1. 路由控制

   因为使用者可能从任意的路由进入网站，所以服务端也需要控制 router 的跳转。浏览器请求后，服务端渲染的内容要根据 router 中不同的路径映射返回不同的 html 内容。

2. store 数据同步

   每个页面都有对应的数据，在服务端渲染时已经请求过对应的数据，所以要让客户端知道这些数据，在客户端渲染的时候直接使用，而不是通过 API 再次请求，造成浪费。

3. 当路由中有 redirect 的情况时， 服务端渲染时就要做好跳转。
4. 服务端渲染时，若需要异步数据，这时候就需要 `react-async-bootstrapper` 。这部分比较难。

在实现服务端渲染的路由比较简单，因为官方都给我们提供了 api。

##### BrowserRouter

在客户端渲染的时候，我们一般会采用 BrowserRouter 作为前端路由，使用 HTML5 History API （pushState, replaceState 和 popstate 事件） 的 <Router> 来保持 UI 和 URL 的同步。

##### StaticRouter

服务器端渲染是一种无状态的渲染。基本思路是，讲 <BrowserRouter> 替换为无状态的 <StaticRouter> 。将服务器上接受到的URL传递给路由用来匹配，通知支持传入 context 特性。

```jsx
<StaticRouter
    location={req.url}
    context={context}
>
</StaticRouter>
```

当在浏览器上渲染一个 <Redirect> 时，浏览器的历史记录会改变状态，同时将屏幕刷新，在静态服务器中，无法直接更改应用程序的状态。在这种情况下，可以在 context 特性中标记要渲染的结果。如果出现了 context.url ，就说明应用程序需要重定向。从服务器发送一个切当的重定向链接即可。

```javascript
const routerContext = {}
const stores = createStoreMap()
const App = createApp(stores, routerContext, req.url)
asyncBootstrap(App).then(() => {
     //bootstrap异步方法执行完毕后，执行完余下的渲染方法后，执行此回调。此时的App就是已经插好值的
    if(routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url)
        res.end()
        return ;
    }
})
```

#### store 的同步

##### 异步请求

我们在做服务端渲染的时候，有一些服务器请求到的数据是需要在首屏就可以看到的。那么这个请求的操作最好就是在服务端渲染的时候就拿到了，而不是来到客户端渲染的时候才进行请求。

1. 使用 `react-async-bootstrapper` 这个库，把我们服务端渲染的组件包装起来，先执行异步方法，执行完毕后再进行余下的 ssr 渲染。我们在组件内部定义一个 bootstrap() 的异步方法。这个就代表我们先要执行的异步操作。

   ```javascript
   class App extends React.Component(
       boostrap() {
           return new Promise((resolve) => {
               setTimeout(() => {
   				this.props.appState.count = 3
                   resolve(true)
               })
           })
       }
       render() {
           return (
           	<div className="app">
               	<Routes>
               	<Link to="/">首页</Link>
               	<Link to="/detail">详情页</Link>
               	</Routes>
               </div>
           )
       }
   )
   ```

   ```javascript
   const asyncBootstrap = require('react-async-bootstrapper')
   asyncBootstrap(App).then(() => {
       // bootstrap 异步方法执行完毕后，执行完余下的渲染方法后，执行此回调，此时的 App 就是已经插好值得了。
       if(routerContext.url) {
           res.status(302).setHeader('Location', routerContext.url)
           res.end()
           
           const helmet = Helmet.rewind()
           const state = getStoreState(stores)
           const content = ReactDomServer.renderToString(App);
           const html = ejs.render(template, {
               appString: content,
               initialState: serialize(state),
               meta: helmet.meta.toString(),
               title: helmet.title.toString(),
               style: helmet.style.toString(),
               link: helmet.link.toString()
           })
           res.send(html)
           resolve()
       }
   })
   ```

2、对 store 进行改造

App-state.js

```javascript
export default class AppState {
    constructor({count, name} = {count:0, name:'bb'}) {
        this.count = count
        this.name = name
    }
    @observable count
    @observable name
    @computed get msg() {
        return `${this.name} say count is ${this.count}`
    }
    @action add() {
        this.count += 1
    }
    @action changeName(name) {
        this.name = name
    }
    
    // 此方法用于 ssr 服务端渲染时调用，获取当前服务端渲染时store状态，注入到客户端，使得服务端和客户端的store可以同步
    toJson() {
        return {
            count: this.count,
            name: this.name
        }
    }
}
```

```javascript
export const AppState = AppStateClass

export default {
    AppState,
}

// 此函数专门用于SSR
export const createStoreMap = () => {
    return {
        appState: new AppState(),
    }
}
```

把 app-state 封装成一个类，方便把服务端渲染时的store获取到，注入到客户端。

3、 获取服务端渲染后的 store

```javascript
const getStoreState = (stores) => {
    return Object.keys(stores).reduce((result, storeName) => {
        result[storeName] = stores[storeName].toJson()
        return result
    }, {})
}

// bundle 是 webpack 对服务端渲染后打包的代码，再获取里面的createStoreMap获取当前store实例
const createStoreMap = bundle.createStoreMap()
const state = getStoreState(stores)
// 这样，state 获取到的就是通过服务端渲染时的store
```

4、 使用模板引擎，吧服务端获取到的 store 注入到客户端，实现同步。

这里使用的是 ejs 模板引擎。

首先，要对客户端的入口文件进行修改，是的客户端是从全局变量当中获取到 store 的：

```javascript
const root = document.getElementById('root');
const initialState = window.__INITIAL__STATE__ || {}

const  render = Component => {
    const renderMethod = module.hot? ReactDom.render: ReactDom.hydrate;
    ReactDom.hydrate(
    	<AppContainer>
        	<Provider appState={new AppState(initialState.appState)}>
        	<BrowserRouter>
        		<Component />
        	</BrowserRouter>
        </Provider>
		</AppContainer>
    , root)
}

render(App)
```

把服务端渲染的代码转化为 html 字符串后，使用 ejs 模板引擎，把 html 内容、initialState （就是服务端的store）插入到 html 模板。

```javascript
const state = getStoreState(stores)
const content = ReactDomServer.renderToString(App);
const html = ejs.render(template, {
    appString: content,
    initialState: serialize(state),
    meta: helmet.meta.toString(),
    title: helmet.title.toString(),
    style: helmet.style.toString(),
    link: helmet.link.toString(),

})
res.send(html)
```

html 模板要改为 ejs 模板

server.template.ejs :

```ejs

<!doctype html>
<html lang="en">
 
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
    <%%- meta %>
    <%%- title %>
    <%%- link %>
    <%%- style %>
</head>
 
<body>
    <div id="root">
        <%%- appString %>
    </div>
    <script>
        window.__INITIAL__STATE__ = <%%- initialState %>
    </script>
</body>
```

到此，比较完整的服务端渲染就完成了。

> **Array.prototype.reduce()**
>
> `reduce` 方法对累计器和数组中的每个元素（从左到右）应用一个函数，将其简化为单个值
>
> ```javascript
> const array = [1, 2, 3, 4]
> const reducer = (accumulator, currentValue) => {
>     return accumulator + currentValue
> }
> ```
>
> accumulator 意思为：蓄电池、积聚者；蓄势器；收集器等。这里译为累计变量。
>
> 1. callback函数的参数
>
> * accumulator： 累计器累计回调的返回值，他是上一次调用回调时返回的累计值，或 `initialValue` 
> * `currentValue` ： 数组中正在处理的元素。
> * `currentIndex` (可选): 数组中正在处理的当前元素的索引。如果提供了 `initialValue`, 则起始索引为0，否则为 1
> * `array` (可选)： 调用 `reduce()` 的数组
>
> 2. initialValue （可选）： 作为第一次调用 `callback`函数时第一个参数的值。如果没有提供初始值，则将使用数组中的第一个元素。在没有初始值的空数组上调用 reducer 将报错。

### 服务端渲染需要注意的细节

服务端渲染打包的 `server-bundle.js` 中把我们的所有依赖文件都打包进去了。实际上，由于服务端渲染运行在 node 端， node 端可以根据 `package.json` 来安装依赖。不需要非要在 `server-bundle.js` 中包含进我们的依赖库。使用时通过 `require()` 来引用库文件，一样能实现相同的效果。故我们把 `webpack.config.server.js` 中添加一行：

```javascript
externals: Object.keys(require('../package.json').dependencies)
```

不过由于我们的开发时的自动监听文件的变化中使用了, 如下代码：

```javascript
const Module = module.constructor
const bundle = mfs.readFileSync(bundlePath, 'utf-8')
const m = new Module()
m._compile(bundle, 'server-entry.js')\
serverBunle = m.exports.default
createStoreMap = m.exports.createStoreMap
```

其中 `m._compile(bundle, 'server-entry.js')` 是把一个代码文件字符串解析成一个模块。不过，这种方式，模块里面的 `require` 是不能正确解析的。故我们还需要在此基础上进行调整。

```javascript
// 删掉 const Module = module.constructor
const NativeModule = require('module')
const vm = require('vm')

const getModuleFromString = (bundle, filename) => {
    const m = { exports: {} }
    const wrapper = NativeModule.wrap(bundle)
    const script = new vm.Script(wrapper, {
        filename: filename,
        displayErrors: true
    })
    const result = script.runInThisContext()
    result.call(m.export, m.exports, require, m) 
    return m;
}

const m = getModuleFromString(bundle, 'server-entry.js')
serverBunle = m.exports.default
createStoreMap = m.exports.createStoreMap
```

#### vm

什么是 VM？VM 模块是 NodeJS 里面的核心模块，支撑了  `require` 方法和 NodeJS 的运行机制。有时候我们可能需要用 VM 搞一些特殊的事情。通过 VM, JS 可以被编译后立即执行或者编译保存下来稍后执行。

VM 模块包含了三个常用的方法，用于创建独立运行的沙箱机制。如下三个方法：

* vm.runInThisContext(code, filename)

  此方法用于创建一个独立的沙箱运行空间。code 内的代码可以访问外部的global变量，但是不能访问其他变量。而且code内部的 global 与外部共享。

* vm.runInContext(code, sandBox)；

  此方法用于创建一个独立的沙箱运行空间。sandBox 将作为 global 的变量传入code内，sandBox要求是 vm.createContext() 方法创建的sandBox

* vm.runInNewContext(code, sandbox, opt)

  这个方法应该和runInContext 一样，但是少了创建sandBox 的步骤。



`const wrapper = NativeModule.wrap(bundle)` , 这句代码把我们的bundle代码字符串包装成 

```javascript
(function(exports, require, module, __filename, __dirname) {
    ...这里是真正传进来的bundle代码
} )
```

传入的exports就是执行bundle代码里面的module.exports。

为了运行上面`NativeModule.wrap()` 之后的代码，需要 `new vm.Script` 创建一个 `vm.Script` 对象，但暂时不运行他。这个 `vm.Script` 代码中将要运行的就是 `bundle` 中的代码。

`const result = script.runInThisContext()` 为script指定执行环境。这里`bundle` 中的代码还没有执行，只是指定了context执行环境。允许`bundle` 中的代码访问当前执行环境中的 `global` 对象。`result.call(m.exports, m.exports, require, m)` 这里开始正式传入参数执行 `bundle` 中的代码。 `m.exports` 作为调用者去调用 `bundle` 代码。向`bundle` 中代码形参`exports`传入的 `m.exports`。 给`require` 形参传入当前的 `require`, 给 `module` 形参传入 `m`

通过上面的操作，我们传入的 `require` 是当前环境中的 `require` ，故 `bundle` 代码里面当然可以 `require` 当前环境所能 `require` 的所有 `node_modules` 中的库文件。

#### react-helmet

这个模块可以使你能自定义 html 页面多的 head title。

```
npm install react-helmet --save-dev
```

**使用**

```javascript
import { Helmet } from 'react-helmet'
...
render() {
    return (
    	<div>
        	<Helmet>
        		<title>this is my title</title>
        	</Helmet>
        	<div>
        		this is other content
        	</div>
        </div>
    )
}
```

在服务端渲染时：

```javascript
const Helmet = require('react-helmet')
const helmet = Helmet.rewind()

const html = ejs.render(template, {
    appString: content,
    initialState: serialize(state), 
    meta: helmet.meta.toString(),
    title: helmet.title.toString(),
    style: helmet.style.toString(),
    link: helmet.link.toString()
})
res.send(html)
```

### 将服务端渲染用于生产环境

如何让我们能够在开发时候和项目上线的时候都是用同一套代码来做服务端渲染。

