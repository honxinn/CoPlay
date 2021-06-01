<template>
  <div class="login">
    <div class="login-box">
      <div class="login-header">
        <span @click="hides()"><i class="iconfont icon-cha"></i></span>
      </div>
      <div class="login-content">
        <div class="welcome">SIGN UP</div>
        <div class="login-input">
          <div class="username">
            <input type="text"
                   class="input_text"
                   placeholder="用户名"
                   autocomplete="off"
                   @input="validUser"
                   v-model="username" />
          </div>

          <div class="password">
            <input type="password"
                   class="input_text"
                   placeholder="密码"
                   autocomplete="off"
                   v-model="password" />
          </div>

          <div class="password">
            <input type="password"
                   class="input_text"
                   placeholder="确认密码"
                   autocomplete="off"
                   v-model="confirmpwd"
                   @input="validPassword" />
          </div>
          <span class="valid"
                v-if="validRole.user">用户名不能为空</span>
          <span class="valid"
                v-if="validRole.confir">两次输入密码不一致</span>
          <div class="btn_login">
            <button class="radius_btn btn_reg"
                    @click="Reg()">注册</button>
            <button class="radius_btn btn_log"
                    @click="ShowLogin">登陆</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { reg } from '@/service/api.js'
export default {
  data () {
    return {
      username: '',
      password: '',
      confirmpwd: '',
      validRole: {
        user: false,
        confir: false
      }
    }
  },
  methods: {
    validUser () {
      !this.username ? (this.validRole.user = true) : (this.validRole.user = false)
      return this.validRole.user
    },
    validPassword () {
      this.password != '' && this.confirmpwd != '' && this.password == this.confirmpwd
        ? (this.validRole.confir = false)
        : (this.validRole.confir = true)
      return this.validRole.confir
    },
    hides () {
      this.$router.push({ path: '/' })
      this.$global.isRegShow = false
    },
    ShowLogin () {
      this.$global.isRegShow = false
      this.$global.isShow = true
    },
    Reg () {
      const _vm = this
      if (!(this.validUser() || this.validPassword())) {
        reg({ username: this.username, password: this.password }).then((res) => {
          Message.success('注册成功')
          _vm.$global.isRegShow = false
          _vm.$global.isShow = true
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/reg.scss';

</style>
