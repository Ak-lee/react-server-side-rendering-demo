import React from 'react'
import {
    observer,
    inject
} from 'mobx-react'

import PropTypes from 'prop-types'
import AppState from '../../store/app-state'
import Helmet from 'react-helmet'

@inject('appState') @observer

export default class TopicList extends React.Component {
    constructor() {
        super()
        this.changeName = this.changeName.bind(this)
    }
    bootstrap() {
        // 这个函数时用于后端的异步请求数据后渲染，对于前端页面没什么用。后端在渲染该组件前会执行这个函数。
        return new Promise((resolve) => {
            setTimeout(() => {
                this.props.appState.count = 3;
                resolve(true)
            })
        })
    }
    render() {
        return (
            <div>
                <Helmet>
                    <title>This is topic list</title> 
                    <meta name="description" content="This is description" />
                </Helmet>
                <input type="text" onChange={this.changeName} />
                <span>
                    {this.props.appState.msg}
                </span>
            </div>
        )
    }
    changeName(event) {
        this.props.appState.changeName(event.target.value)
    }
}

TopicList.propTypes = {
    appState: PropTypes.instanceOf(AppState)
}
// 上面的 propTypes 是一个AppState的实例，并且是必须传入的。