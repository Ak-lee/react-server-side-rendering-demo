import ReactDOM from 'react-dom'
import React from 'react'
import { Provider } from 'mobx-react'
import App from './views/App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import AppState from './store/app-state'

const initialState = window.__INITIAL__STATE__ || {}

const root = document.getElementById('root')

const render = (Component) => {
    ReactDOM.render( 
        <AppContainer>
            <Provider appState = { new AppState(initialState.appState) }>
                <Router>
                    <Component />
                </Router>
            </Provider>
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

