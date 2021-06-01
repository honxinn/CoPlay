<template>
  <div class="view"
       :style="{'top': isShow ? '0%' : '100%', 'visibility': isShow ? 'visible' :  'hidden'}"
       @click="closeMsg($event)">
    <div ref="other">
      <div class="user-box">
        <div class="header">
          Ta的主页
        </div>
        <div class="user-info">
          <div class="avators">
            <img :src="users.profile ? users.profile :require('../assets/avator.png')"
                 alt="">
          </div>
          <div class="alter-box">
            <div class="alter">
              账号:<input type="text"
                     v-model="users.username"
                     disabled>
            </div>
            <div class="alter">
              简介:<input type="text"
                     v-model="users.desc"
                     disabled>
            </div>
            <div class="alter">
              邮箱:<input type="text"
                     v-model="users.mail"
                     disabled>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: ['other_info', 'isShowInfo'],
  data () {
    return {
      users: this.other_info,
      isShow: this.isShowInfo
    }
  },
  methods: {
    closeMsg (ev) {
      if (!this.$refs.other.contains(ev.target)) {
        if (this.isShow) {
          this.changeShow()
        }
      }
    },
    changeShow () {
      this.$emit('changes', false)
    }
  },
  watch: {
    other_info: function (newv, oldv) {
      this.users = newv
    },
    isShowInfo: function (newv, oldv) {
      this.isShow = newv
    },
  }
}
</script>

<style lang="scss" scoped>
.view {
  width: 100%;
  height: 100%;
  background: rgba(25, 25, 25, 0.5);
  z-index: 99;
  position: fixed;
  top: 100%;
  transition: all 0.5s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-box {
  width: 500px;
  margin: auto;
  position: relative;
  border-radius: 15px 15px;
}
.header {
  background: #333;
  color: white;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 10px;
  border-top-left-radius: 15px 15px;
  border-top-right-radius: 15px 15px;
}
.user-info {
  width: 100%;
  height: 100%;
  background: white;
  border-bottom-left-radius: 15px 15px;
  border-bottom-right-radius: 15px 15px;
  padding-bottom: 20px;
}
.avators {
  padding: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}
.alter-box {
  width: 80%;
  margin: 0 auto;
}
.alter {
  text-align: left;
  width: 100%;
  display: flex;
  align-items: center;
  margin: 20px;
  font-size: 25px;
  input {
    width: 80%;
    outline: 0;
    border: 1px solid #eee;
    padding: 10px;
    border-radius: 15px 15px;
  }
}
</style>