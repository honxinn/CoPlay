<template>
  <div id="app">
    <div class="musicBg" @click.stop="closeMsg($event)">
      <div
        :class="{ music_menu: true, isOpen: isMenuShow, isRoom: enterRoom }"
        ref="navbar"
      >
        <div class="user_avator" @click="sliderUser">
          <img
            class="avator"
            :src="avator ? avator : require('./assets/avator.png')"
            alt="头像"
          />
        </div>

        <div class="list">
          <router-link to="/" exact
            ><i class="icon iconfont icon-homepage"></i
            ><span>首页</span></router-link
          >
        </div>
        <div class="list">
          <router-link to="/room"
            ><i class="icon iconfont icon-live"></i
            ><span>房间</span></router-link
          >
        </div>
        <div class="list">
          <router-link to="/dot"
            ><i class="icon iconfont icon-activity"></i
            ><span>点歌</span></router-link
          >
        </div>
        <div class="list">
          <router-link to="/upload"
            ><i class="icon iconfont icon-upload"></i
            ><span>上传</span></router-link
          >
        </div>
        <div class="list" v-if="isLogin" @click="logout">
          <router-link :disabled="true" to="/logout">
            <i class="icon iconfont icon-quit"></i><span>登出</span>
          </router-link>
        </div>
        <div class="list" v-else>
          <router-link :disabled="true" to="/login" @click="LoginPage">
            <i class="icon iconfont icon-log-in"></i><span>登录</span>
          </router-link>
        </div>
      </div>
      <div :class="{ music_chat: true, isRoom: enterRoom }">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </div>

      <div :class="{ footer: true, isFooter: enterRoom }">
        <div class="process-bar">
          <audio
            ref="player"
            :src="isPlay"
            @canplay="musichandle()"
            @ended="ended()"
            @timeupdate="updateTime()"
            
            muted
          ></audio>
          <el-slider
            ref="sliders"
            v-model="musicCurrentTime"
            :max="allDuration"
            :disabled="myGrant ? myGrant == 'USER' : false"
            @change="changeMusicCurrent"
            @mousedown.native="stopUpdate"
            @mouseup.native="startUpdate"
            :format-tooltip="secToTimes"
          ></el-slider>
        </div>
        <div class="music">
          <div class="rotation">
            <img
              ref="imgs"
              :class="{ micon: true, isRotating: this.$global.currentState }"
              :src="
                currentMusic
                  ? currentMusic['profile']
                    ? currentMusic['profile']
                    : require('./assets/music.png')
                  : require('./assets/music.png')
              "
            />
          </div>
          <div class="music-infos">
            <div class="music_name">
              {{ currentMusic ? currentMusic["name"] : "暂无歌曲" }}
            </div>
            <div class="music_desc">
              <span :style="{ color: 'black' }"
                >{{ current_Time }} / {{ total_Time }}</span
              >
            </div>
          </div>

          <!---->
          <div class="bar">
            <div class="control-play">
              <span @click="nextPlayer(-1)"
                ><i class="icon iconfont icon-shangyishou1"></i
              ></span>
              <span @click="plays()"
                ><i
                  :class="
                    'icon iconfont ' +
                    (this.$global.currentState
                      ? 'icon-zanting1'
                      : 'icon-bofang')
                  "
                ></i
              ></span>
              <span @click="nextPlayer(1)"
                ><i class="icon iconfont icon-xiayishou1"></i
              ></span>
            </div>
            <div class="volumn volum-right">
              <span @click="muteVolume()"
                ><i
                  :class="
                    'iconfont ' +
                    (this.$global.isMuteVolume
                      ? 'icon-volumeoff'
                      : 'icon-volume')
                  "
                ></i
              ></span>
              <el-slider v-model="musicVolume"></el-slider>
            </div>
          </div>
        </div>
      </div>
    </div>
    <UserInfo
      :style="{
        transform: userSlider
          ? 'translate3d(0, 0%, 0)'
          : 'translate3d(0, 100%, 0)',
        visibility: userSlider ? 'visible' : 'hidden',
      }"
    ></UserInfo>
    <transition name="fade">
      <Login v-if="isShow"></Login>
    </transition>
    <transition name="fade">
      <Reg v-if="isRegShow"></Reg>
    </transition>
    <CreateRoom v-if="isCreateShow"></CreateRoom>
    <div class="bg">
      <img
        :src="
          isMobile() ? require('./assets/header.jpg') : $global.backgroundImg
        "
        alt=""
      />
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>
        <el-input
          placeholder="请输入房间密码"
          v-model="pwd"
          show-password
        ></el-input>
        123123
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="apply()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// @ is an alias to /src
import UserInfo from "@/components/UserInfo.vue";
import Login from "@/components/Login.vue";
import Reg from "@/components/Reg.vue";
import CreateRoom from "@/components/CreateRoom.vue";
import { getMusic, applyRoom, getUserInfo } from "@/service/api.js";
import { secToTime, nextMusic, playMusic } from "./utils";
import { Message, Input } from "element-ui";
export default {
  name: "Home",
  data() {
    return {
      screenWidth: document.body.clientWidth,
      musicCurrentTime: this.$global.currentTime,
      slideState: false,
      dialogVisible: false,
      enterRoom: false,
      pwd: "",
      avator: this.$global.userInfo.profile,
    };
  },
  components: { Login, CreateRoom, Reg, UserInfo },
  methods: {
    sliderUser() {
      if (this.$global.userInfo.uid) this.getInfo();
      else {
        Message.info("请先登录！");
        this.$global.isShow = true;
      }
    },
    LoginPage() {
      this.$global.isShow = true;
      this.$global.isMenuShow = false;
    },
    secToTimes() {
      return secToTime(this.musicCurrentTime);
    },
    stopUpdate() {
      this.$global.isDrag = true;
    },
    startUpdate() {
      this.$global.isDrag = false;
    },
    changeMusicCurrent() {
      this.$global.currentTime = this.$global.music.currentTime = this.musicCurrentTime;
      this.$global.syncMusicState({
        time: this.$global.currentTime,
        status: this.$global.currentState,
        type: "MUSIC",
        index: this.$global.index,
      });
    },
    readInfoFromLocal() {
      const strUser = localStorage.getItem("user");
      const strUserInfo = localStorage.getItem("userInfo");
      const strRoomInfo = localStorage.getItem("roomInfo");
      const strMusicInfo = localStorage.getItem("musicListInfo");
      const strBg = localStorage.getItem("bg");
      if (strBg) this.$global.backgroundImg = strBg;
      if (strUserInfo && strUser) {
        this.$global.token = strUserInfo;
        this.$global.userInfo = JSON.parse(strUser);
      }
      if (strRoomInfo) {
        const roomInfo = JSON.parse(strRoomInfo);
        this.$global.roomInfo = roomInfo;
      }
      if (strMusicInfo) {
        const musicInfo = JSON.parse(strMusicInfo);
        this.$global.musicList = musicInfo;
      }
    },
    playState() {
      this.$global.duration = 0;
      this.$global.currentTime = 0;
      this.$global.currentState = false;
      this.$global.userList = [];
      this.$global.index = 0;
    },
    logout() {
      Message.success("退出成功");
      localStorage.clear();
      setTimeout(() => {
        location.href = "/";
      }, 500);
    },
    muteVolume() {
      this.$global.isMuteVolume = !this.$global.isMuteVolume;
    },
    syncSend() {
      let _vm = this;
      this.$global.handleSendMusicState = (content = "") => {
        _vm.$global.syncMusicState({
          content: content,
          time: _vm.$global.currentTime,
          status: _vm.$global.currentState,
          type: "SYNC",
          index: _vm.$global.index,
        });
      };
    },
    changeMusic(data) {
      let _vm = this;
      if (data.index != _vm.$global.index) {
        getMusic(_vm.$global.roomInfo.id).then((res) => {
          _vm.$global.isPlay = res.data.data;
          _vm.$global.index = data.index;
          _vm.syncMusicState(data);
          setTimeout(() => {
            _vm.$global.music.click();
            _vm.$global.music.play();
          }, 0);
        });
      } else {
        _vm.syncMusicState(data);
      }
    },
    syncMusicState(data) {
      this.$global.music.muted = true;
      if (data.status) {
        this.$global.music.paused && this.$global.music.play();
        this.$global.music.muted = false;
      } else {
        !this.$global.music.paused && this.$global.music.pause();
      }
      this.$global.currentState = data.status;
      this.$global.music.currentTime = data.time;
    },
    clickSlide() {
      this.slideState = !this.slideState;
    },
    musichandle() {
      this.$global.duration = this.$global.music.duration;
    },
    plays(times = this.$global.currentTime) {
      if (this.myGrant && this.myGrant != "USER")
        playMusic(this.$global, times);
    },
    ended() {
      this.nextPlayer(1);
    },
    updateTime() {
      if (!this.$global.isDrag) {
        this.$global.duration = this.$global.music.duration;
        this.$global.currentTime = this.$global.music.currentTime;
        this.$global.currentState = !this.$global.music.paused;
      }
    },
    nextPlayer(num) {
      if (this.myGrant && this.myGrant != "USER")
        nextMusic(this.$global, this.$global.index + num);
    },
    getMusicLists() {
      let _vm = this;
      getMusic(this.$global.roomInfo.id)
        .then((res) => {
          _vm.$global.isPlay = res.data.data;
        })
        .catch((err) => {
        });
    },
    getInfo() {
      let _vm = this;
      getUserInfo(this.$global.userInfo.uid).then((res) => {
        _vm.$global.userInfo = res.data;
        localStorage.setItem("user", JSON.stringify(res.data));
        this.$global.userSlider = true;
      });
    },
    apply() {
      this.dialogVisible = false;
      const _vm = this;
      const roomInfo = _vm.$global.roomInfo;
      applyRoom({ id: roomInfo.id, pwd: this.pwd }).then((res) => {
        if (res.data.code === 0) {
          _vm.$global.roomInfo = {
            id: roomInfo.id,
            name: roomInfo.name,
            desc: roomInfo.desc,
            pwd: _vm.pwd ? true : false,
            profile: roomInfo.profile,
          };
          _vm.$router.push({ path: "/room" });
          _vm.$global.initWebSocket(_vm.$global.roomInfo.id);
          _vm.getMusicLists();
        } else {
          Message.error(err.message);
          localStorage.removeItem("roomInfo");
          this.$router.go(0);
        }
      });
    },
    async applyroom(id, name, desc, pwd) {
      if (pwd) {
        this.dialogVisible = true;
      } else {
        const _vm = this;
        await applyRoom({ id: id, pwd: "" })
          .then((res) => {
            if (res.data.code === 0) {
              _vm.$global.roomInfo = {
                id: id,
                name: name,
                desc: desc,
                pwd: pwd ? true : false,
              };
              _vm.$router.push({ path: "/room" });
              _vm.$global.initWebSocket(_vm.$global.roomInfo.id);
              _vm.getMusicLists();
            }
          })
          .catch((err) => {
            localStorage.removeItem("roomInfo");
          });
      }
    },
    closeMsg(ev) {
      if (!this.$refs.navbar.contains(ev.target)) {
        if (this.$global.isMenuShow) {
          this.$global.isMenuShow = false;
        }
      }
    },
    listResize() {
      const that = this;
      window.addEventListener("resize", function () {
        return (() => {
          window.screenWidth = document.body.clientWidth;
          that.screenWidth = window.screenWidth;
        })();
      });
    },
    showTooltip(data) {
      this.$nextTick(() => {
        this.$refs.sliders.setPosition(data);
      });
    },
    isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    },
  },
  computed: {
    userSlider: function () {
      return this.$global.userSlider;
    },
    isLogin: function () {
      return this.$global.userInfo.uid;
    },
    isPlay: function () {
      return this.$global.isPlay;
    },
    current_Time: function () {
      return secToTime(this.$global.currentTime);
    },
    total_Time: function () {
      return secToTime(this.$global.duration);
    },
    allDuration: function () {
      return this.$global.duration;
    },
    musicVolume: {
      get() {
        return Math.floor(this.$global.musicVolume * 100);
      },
      set(v) {
        this.$global.musicVolume = this.$global.music.volume = v / 100;
      },
    },
    isShow: function () {
      return this.$global.isShow;
    },
    isRegShow: function () {
      return this.$global.isRegShow;
    },
    isCreateShow: function () {
      return this.$global.isCreateShow;
    },
    isMenuShow: function () {
      return this.$global.isMenuShow;
    },
    myGrant: function () {
      for (let i of this.$global.userList) {
        if (i.uid == this.$global.userInfo.uid) return i.role;
      }
      return "";
    },
    currentMusic: function () {
      return this.$global.musicList[this.$global.index];
    },
  },
  watch: {
    "$global.userInfo": function (newValue, oldValue) {
      this.avator = newValue.profile;
    },
    "$global.musicVolume": function (newValue, oldValue) {
      if (newValue <= 0) {
        this.$global.musicVolume = 0;
        this.$global.isMuteVolume = true;
      } else this.$global.isMuteVolume = false;
    },
    "$global.isMuteVolume": function (newValue, oldValue) {
      newValue
        ? (this.$global.musicVolume = this.$global.music.volume = 0)
        : (this.$global.musicVolume = this.$global.music.volume = 0.4);
    },
    "$global.currentTime": function (newValue, oldValue) {
      this.musicCurrentTime = newValue;
    },
    screenWidth: {
      immediate: true,
      handler(newValue) {
        newValue > 864 ? (this.$global.isMenuShow = false) : "";
      },
    },
    $route: function (newValue, oldValue) {
      if (newValue) this.$global.isMenuShow = false;
      (newValue.name == oldValue.name) == "Room" || newValue.name == "Room"
        ? (this.enterRoom = true)
        : (this.enterRoom = false);
    },
    "$global.roomInfo": function (newValue, oldValue) {
      newValue.id == undefined ? this.playState() : "";
    },
  },
  created() {
    this.readInfoFromLocal();
  },
  mounted() {
    let room = this.$global.roomInfo;
    this.$global.music = this.$refs.player;
    this.$global.music.volume = 0.5;
    this.$global.musicVolume = this.$global.music.volume
      ? this.$global.music.volume
      : 0.4;

    if (room.id && !this.$global.websock) {
      this.applyroom(room.id, room.name, room.desc, room.pwd);
    }
    this.$global.handleReceiveMusicState = (data) => {
      this.changeMusic(data);
    };
    this.$global.handleSendNextMusicState = (num) => {
      this.$global.syncMusicState({
        time: this.$global.currentTime,
        status: true,
        type: "MUSIC",
        index: num,
      });
    };
    this.listResize();
    this.syncSend();
  },
  destroyed() {
    localStorage.removeItem("roomInfo");
    localStorage.removeItem("musicListInfo");
  },
};
</script>

<style lang="scss">
@import "@/styles/app.scss";
</style>
