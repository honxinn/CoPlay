<template>
  <div class="login">
    <div class="login-box">
      <div class="login-header">
        <span @click="hides()"><i class="iconfont icon-cha"></i></span>
      </div>
      <div class="login-content">
        <div class="welcome">SIGN IN</div>
        <div class="login-input">
          <div class="username">
            <input type="text"
                   class="input_text"
                   placeholder="用户名"
                   autocomplete="off"
                   v-model="username" />
          </div>
          <div class="password">
            <input type="password"
                   class="input_text"
                   placeholder="密码"
                   autocomplete="off"
                   v-model="password" />
          </div>

          <div class="btn_login">
            <button class="radius_btn btn_log"
                    @click="logins()">登录</button>
            <button class="radius_btn btn_reg"
                    @click="ShowReg">注册</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { login } from '@/service/api.js'
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    hides () {
      this.$router.push({ path: '/' })
      this.$global.isShow = false
    },
    ShowReg () {
      this.$global.isShow = false
      this.$global.isRegShow = true
    },
    logins () {
      const _vm = this
      login({ username: this.username, password: this.password }).then((res) => {
        Message.success('登录成功')
        _vm.$global.isShow = false
        _vm.$global.isMenuShow = false;
        this.$router.go(0)
        localStorage.setItem('userInfo', res.data.data.token)
        localStorage.setItem(
          'user',
          JSON.stringify({
            username: res.data.data.user.username,
            uid: res.data.data.user.uid,
            desc: res.data.data.user.desc,
            mail: res.data.data.user.mail,
            profile: res.data.data.user.profile,

          })
        )
        if (res.data.data.user.backgroundImg) {
          this.$global.backgroundImg = res.data.data.user.backgroundImg
          localStorage.setItem('bg', res.data.data.user.backgroundImg)
        }

        _vm.$global.token = res.data.data.token
        _vm.$global.userInfo = JSON.parse(localStorage.getItem('user'))
      })
    }
  },
  computed: {
    isReg () {
      return this.$global.isRegShow
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/login.scss';
</style>
