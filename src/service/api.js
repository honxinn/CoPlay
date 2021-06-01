import { get, post, put, Delete } from './request.js'

export const login = (data) => post('/login', data)

export const reg = (data) => post('/user/sign-up', data)

export const getRoomList = () => get('/room/list', {})

export const createRoom = (data) => post('/room/create', data)

export const applyRoom = (data) => post('/room/apply', data)

export const getRoomMusicList = (rid) => get(`/music/list/${rid}`)

export const dotMusic = (rid, data) => put(`/music/${rid}`, data)

export const getMusic = (rid) => get(`/music/${rid}?t=${new Date().getTime()}`)

export const getUserList = (rid) => get(`/room/user/list/${rid}`)

export const putUserGrant = (data) => put('/room/user', data)

export const uploadMusic = (rid, data, config) => post(`/upload/music/${rid}`, data, {
	onUploadProgress (progress) {
		console.log(Math.round(progress.loaded / progress.total * 100) + '%')
	}
})

export const changeOrder = (rid, data) => put(`/music/order/${rid}`, data)

export const breakUser = (data) => Delete('/room/user', data)

export const getUserInfo = (uid) => get(`/user/${uid}`)

export const deleteMusic = (rid, index) => Delete(`/music/${rid}/${index}`)

export const searchRoom = (name) => get('/room/search', { name: name })

export const closeRoom = (rid) => Delete(`/room/${rid}`)

export const changeUserInfo = (data) => put('/user/info', data)

export const uploadAvator = (data) => post('/upload/user-profile', data)

export const uploadRoom = (data) => put('/room/info', data)

export const uploadBg = (data) => post('/upload/user-background-img', data)

export const withDraw = () => Delete('/user/background')