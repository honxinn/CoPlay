import Vue from 'vue'
import { Message } from 'element-ui'
import { getToken } from './service/request'
const state = Vue.observable({
    roomInfo: {},
    userInfo: {},
    historyUserList: {},
    token: 'test',
    websock: null,
    music: null,
    isReconnect: true,
    musicVolume: null,
    currentState: false,
    isMuteVolume: false,
    duration: 0,
    currentTime: 0,
    chatList: [],
    userList: [],
    roomList: [],
    musicList: [],
    backgroundImg: require('./assets/pc.jpg'),
    isPlay: '#',
    index: 0,
    isShow: false,
    isRegShow: false,
    isMenuShow: false,
    isCreateShow: false,
    isDrag: false,
    userSlider: false,
    handleGetUserList: () => { },
    handleMonitorMessage: () => { },
    handleSendMusicState: () => { },
    handleCloseRoomState: () => { },
    handleSendNextMusicState: () => { },
    handleReceiveMusicState: () => { }
})


function websocketsend (Data) {
    // 数据发送
    state.websock.send(JSON.stringify(Data))
}

function syncMusicState ({ time, status, type, index = 0 }) {
    const msg = { type: type, timestamp: new Date().getTime(), time: time, status: status, index: index }
    console.log({ msg: '尝试主动发送', msg2: msg })
    websocketsend(msg)
}

function websocketonopen () {
    // 连接建立之后执行send方法发送数据
    // const { userInfo } = state
    // const msg = { type: 'TEXT', content: '大家好！', timestamp: new Date().getTime(), username: userInfo.username }
    // websocketsend(msg)
}

function websocketonerror () {
    // 连接建立失败重连
    // initWebSocket();
    state.handleCloseRoomState()
}

function websocketonmessage (e) {
    // 数据接收
    state.handleMonitorMessage()
    console.log(e, 123)

    const redata = JSON.parse(e.data)
    if (redata.type === 'HISTORY') {
        state.chatList = JSON.parse(redata.content)
    }
    if (redata.type === 'TEXT')
        state.chatList.push(redata)
    if (redata.type === 'MUSIC')
        state.handleReceiveMusicState(redata)
    if (redata.type === 'SYNC')
        state.handleSendMusicState()
    if (redata.type === 'SYSTEM') {
        state.chatList.push(redata)
        if (redata.content === '房间被关闭！！！') {
            state.handleCloseRoomState()
            Message.info('房主关闭了房间')
        }
        if (redata.content === '你被踢出房间!') {
            state.handleCloseRoomState()
            Message.info('你被房主踢出了房间!')
        }
        else {
            state.handleGetUserList()
        }
    }
    if (redata.type === 'OPERATE') {
        state.index = redata.index != undefined ? redata.index : state.index
        state.handleGetUserList()
    }
}

function websocketclose (e) {
    // 关闭
    console.log(e)
    state.handleCloseRoomState()
}

function initWebSocket (rid) {
    // 初始化weosocket
    const wsuri = `ws://192.168.123.60:8085/message?rid=${rid}&token=${state.token}`
    const websock = new WebSocket(wsuri)
    websock.onmessage = websocketonmessage
    websock.onopen = websocketonopen
    websock.onerror = websocketonerror
    websock.onclose = websocketclose
    state.websock = websock
}



state.initWebSocket = initWebSocket
state.websocketsend = websocketsend
state.syncMusicState = syncMusicState
state.websocketclose = websocketclose
export default state
