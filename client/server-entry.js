import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'
import App from './views/App.jsx';
import { createStoreMap } from './store/store.js'

// 让 mobx 在服务端渲染的时候不会重复的数据变换
useStaticRendering(true)

export default ( stores, routerContext, url ) => {
    return (
        <Provider {...stores}>
            <StaticRouter context = { routerContext } location={ url }>
                <App />
            </StaticRouter>
        </Provider>
    )
}

export { createStoreMap }
