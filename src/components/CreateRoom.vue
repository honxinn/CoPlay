<template>
  <div class="createRoom"
       @click="closeMsg($event)">
    <div class="create-box"
         ref="msk">
      <div class="create-content">
        <div class="welcome">Create your Room!</div>
        <div class="create-input">
          <div class="roomname">
            <span class="iconfont icon-name"></span>
            <input type="text"
                   class="input_text"
                   placeholder="房间名"
                   autocomplete="off"
                   v-model="roomname" />
          </div>
          <div class="roomname roomdesc">
            <span class="iconfont icon-description"></span>
            <input type="text"
                   class="input_text"
                   placeholder="房间描述"
                   autocomplete="off"
                   v-model="roomdesc" />
          </div>
          <div class="password">
            <span class="iconfont icon-lock"></span>
            <input type="password"
                   class="input_text"
                   placeholder="房间密码(可选)"
                   autocomplete="off"
                   v-model="password" />
          </div>

          <div class="btn-create">
            <button class="radius_btn"
                    @click="creates()">Create</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { createRoom, applyRoom, getMusic } from '@/service/api.js'
import { Message } from 'element-ui'
export default {
  data () {
    return {
      roomname: '',
      roomdesc: '',
      password: ''
    }
  },
  methods: {
    closeMsg (ev) {
      if (!this.$refs.msk.contains(ev.target)) {
        this.$global.isCreateShow = false
      }
    },
    getMusicLists () {
      const _vm = this
      getMusic(_vm.$global.roomInfo.id)
        .then((res) => {
          _vm.$global.isPlay = res.data.data
        })
        .catch((err) => {
        })
    },
    async applyroom (id, pwd, name, desc) {
      const _vm = this
      localStorage.setItem('roomInfo', JSON.stringify({ id: id, name: name, desc: desc, pwd: pwd ? true : false, profile: this.$global.userInfo.profile }))
      await applyRoom({ id: id, pwd: pwd }).then((res) => {
        _vm.$global.roomInfo = { id: id, name: name, desc: desc, pwd: pwd ? true : false, profile: _vm.$global.userInfo.profile }
        _vm.$router.push({ path: '/room' })
        _vm.$global.initWebSocket(_vm.$global.roomInfo.id)
        _vm.getMusicLists()
        _vm.$global.isCreateShow = false
      })
    },
    async creates () {
      if (this.$global.roomInfo.id) {
        Message.info('请先退出当前房间！')
      } else
        await createRoom({
          name: this.roomname,
          desc: this.roomdesc,
          pwd: this.password
        }).then((res) => {
          this.applyroom(res.data.data, this.password, this.roomname, this.roomdesc)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/createRoom.scss';
</style>
