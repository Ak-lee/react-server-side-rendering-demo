const React = require('react')
import Routes from '../config/router.jsx'
import { Link } from 'react-router-dom'

export default class App extends React.Component {
    componentDidMount() {
        // do something here
    }
    render() {
        return [
            <div key="banner" >
                <Link to="/" >首页</Link>
                <br/>
                <Link to="/detail" >详情页</Link>
            </div>,
            <Routes key="routes" />
        ]
    }
}

