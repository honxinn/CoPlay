import { Message } from "element-ui"

export const secToTime = (total) => {
    if (JSON.stringify(total) === 'null') return '00:00'
    const min = parseInt(total / 60)
    const sec = parseInt(total % 60)
    return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`
}

export const isNull = (value) => {
    if (value == null || typeof (value) === 'undefined' || value === undefined) {
        return true
    }
    return false
}

export const nextMusic = (global, num) => {
    let temp = num
    let len = global.musicList.length - 1;
    if (temp > len) {
        temp = 0
    }
    if (temp < 0) {
        temp = len
    }
    global.currentTime = 0
    global.currentState = false
    global.music.pause()
    global.handleSendNextMusicState(temp)
}

export const playMusic = (global, times) => {
    if (global.music.paused) {
        global.music.play()
    } else {
        global.music.pause()
    }
    global.currentState = !global.music.paused
    global.syncMusicState({
        time: times,
        status: global.currentState,
        type: 'MUSIC',
        index: global.index
    })
}

export const inspectFileFormat = (files) => {
    if (files.length > 1) {
        Message.error('每次只能上传一个文件!')
        return false
    }
    if ((files[0].size / 1024 / 1024) > 10) {
        Message.error('仅支持上传小于10M的文件！')
        return false
    }
    return true
}


export const move = (arr, newIndex, current) => {
    let temp = [].concat(arr);
    temp.splice(current, 0, temp.splice(newIndex, 1)[0]);
    return temp;
}
