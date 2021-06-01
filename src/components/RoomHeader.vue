<template>
  <div>
    <div class="chat-header">
      <div class="quit">
        <i class="mobile iconfont icon-menu"
           @click.stop="openMenu"></i>
        <i :class="{'iconfont': true, 'icon-left_arrow': routerIndex != 1, 'icon-quit': routerIndex == 1 }"
           @click="returnHome"></i>
        <span style="margin-left:20px">{{ roomName ? `房间: ${roomName}` : '' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  closeRoom
} from '@/service/api.js'
import { Message } from 'element-ui';
export default {
  data () {
    return {
      roomName: this.$global.roomInfo.name
    };
  },
  methods: {

    openMenu () {
      this.$global.isMenuShow = true;
    },
    initData () {
      if (this.$global.websock) {
        this.$global.websock.close()
      }
      this.$global.isPlay = ''
      this.$global.roomInfo = {}
      this.$global.chatList = []
      this.$global.musicList = []
      this.$global.userList = []
      this.$global.currentTime = 0
      this.$global.index = 0
      localStorage.removeItem('musicListInfo')
      localStorage.removeItem('roomInfo')
      this.$router.push({ path: '/' })
    },
    returnHome () {
      if (this.$route.meta.index == 1) {
        if (this.myGrant == 'OWNER') {
          closeRoom(this.$global.roomInfo.id).then(res => {
            Message.info('你关闭了房间')
          })
          this.initData()
        } else {
          Message.info('你退出了房间')
          this.initData()
        }
      } else {
        this.$router.push('/room')
      }

    },

  },
  computed: {
    routerIndex: function () {
      return this.$route.meta.index
    },
    myGrant: function () {
      for (let i of this.$global.userList) {
        if (i.uid == this.$global.userInfo.uid) return i.role
      }
    },
  },
  watch: {
    "$global.roomInfo.name": function (newV) {
      this.roomName = newV
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/roomHeader.scss';
</style>