import {
    observable,
    computed,
    action
} from 'mobx'

export default class AppState {
    constructor({count, name} = {count: 0, name: 'Jocky'} ) {
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
    toJson() {
        // 这个方法用于服务端渲染的时候以json的形式来拿到state中的数据。
        // 后面我们要想办法把这个json数据放在一个客户端能够拿到的地方。让客户端//store init 的时候就能拿到这份json数据。
        return {
            count: this.count,
            name: this.name,
        }
    }
}
