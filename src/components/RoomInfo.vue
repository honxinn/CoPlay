<template>
  <div class="roomInfo"
       :style="{'top': isShow ? '0%' : '100%', 'visibility': isShow ? 'visible' :  'hidden'}"
       @click="closeMsg($event)">
    <div ref="roomInfo">
      <div class="user-box">
        <div class="header">
          房间信息
        </div>
        <div class="user-info">
          <div class="avators">
            <img :src="room.profile ? room.profile :require('../assets/avator.png')"
                 alt="">
          </div>
          <div class="alter-box">
            <div class="alter">
              房间名:<input type="text"
                     v-model="room.name">
            </div>
            <div class="alter">
              房间描述:<input type="text"
                     v-model="room.desc">
            </div>
            <div class="alter">
              房间密码:<input type="text"
                     v-model="pwd"
                     placeholder="******">
            </div>
            <div class="alter">
              <button class="btn_upload"
                      @click.stop="changeInfo">确认修改</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { uploadRoom } from '../service/api';
export default {
  props: ['other_info', 'isShowInfo'],
  data () {
    return {
      pwd: '',
      room: this.other_info,
      isShow: this.isShowInfo
    }
  },
  methods: {
    closeMsg (ev) {
      if (!this.$refs.roomInfo.contains(ev.target)) {
        if (this.isShow) {
          this.changeShow()
        }
      }
    },
    changeShow () {
      this.$emit('changes', false)
    },
    changeInfo () {
      let _vm = this
      this.room['pwd'] = this.pwd
      let {name, desc, pwd} = this.room
      uploadRoom({name, desc, pwd}).then(res => {
        if (res.data.code == 0) {
          _vm.$global.roomInfo = { name: _vm.room['name'], id: _vm.room['id'], desc: _vm.room['desc'], pwd: _vm.room['pwd'] ? true : false, profile: _vm.room['profile']}
          localStorage.setItem(
            "roomInfo",
            JSON.stringify(_vm.$global.roomInfo)
          );
          this.changeShow()
        }
      })
    }
  },
  watch: {
    other_info: function (newv, oldv) {
      
      this.room = newv
    },
    isShowInfo: function (newv, oldv) {
      this.isShow = newv
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/roomInfo.scss'


</style>