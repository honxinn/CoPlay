<template>
  <div class="roomlist" @click="closeMsg($event)">
    <div class="bgs" ref="bgs">
      <div class="title">
        <span><i class="iconfont icon-menu" @click.stop="openMenu"></i></span
        >CoPlay
      </div>
      <div class="top-box">
        <div class="home-menu">
          <div class="search-bar">
            <input
              type="text"
              v-model="name"
              class="search"
              @input="search"
              placeholder="Search Room..."
            />
            <span class="icon" @click.stop="search"
              ><i class="iconfont icon-search"></i
            ></span>
          </div>
          <div class="create-bar">
            <button class="create-btn" @click.stop="creates()">
              <i class="iconfont icon-add"></i>创建
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      :class="{ 'right-info': true, isShowRoomInfo: isSlider }"
      ref="slidebar"
    >
      <div class="room-info-box">
        <div class="room-title" style="color:rgb(90, 206, 159)">{{ currentRoom.name }}</div>

        <div class="room-owner">
          <span><i class="iconfont icon-host"></i></span
          >{{ `房主：${currentRoom.owner}` }}
        </div>
        <div class="room-usernum">
          <span><i class="iconfont icon-people"></i></span
          >{{ `房间人数：${currentRoom.userNum}` }}
        </div>
         <div class="room-usernum" :style="{'color': currentRoom.curstatus ? '#5ace9f' : '#4990e2'}">
          <span><i class="iconfont icon-zhuangtai"></i></span
          >{{ `房间状态：${ currentRoom.curstatus ? "播放中" : "暂停中"}` }}
        </div>
        <hr />
        <div class="room-desc">
          <div>房间描述</div>
          <div class="desc-info">
            {{ currentRoom.desc }}
          </div>
        </div>
        <div class="applyRoom">
          <div class="input-pwd">
            <input
              type="password"
              class="input"
              placeholder="房间密码"
              @blur="changBlur"
              v-model="pwd"
            />
          </div>
          <button class="apply-btn" @click.stop="applyroom(currentRoom, pwd)">
            加入房间
          </button>
        </div>
      </div>
    </div>
    <div class="room-list">
      <div class="room-list-header">
        <span>Room{{ roomList ? `(${roomList.length})` : "" }}</span>
      </div>
      <div class="all-room">
        <div
          class="room-box"
          v-for="(item, index) in roomList"
          :key="index"
          @click.stop="
            getRoomId() == item.id
              ? returnRoom()
              : item.pwd
              ? clickSlide(item)
              : applyroom(item)
          "
        >
          <div
            class="varibal"
            :style="{ background: item.curstatus ? '#5ace9f' : '' }"
          ></div>
          <div class="people-num">
            <div class="people-info">
              <span
                ><i class="iconfont icon-user"></i
                >{{ `${item.userNum}人` }}</span
              >
            </div>
          </div>
          <div class="room-info">
            <div class="room-avator">
              <img
                class="room-img"
                :src="
                  item.profile ? item.profile : require('../assets/avator.png')
                "
                alt=""
              />
            </div>
            <div class="room-name">
              <span class="name">{{ item.name }}</span>
              <span class="name desc">{{ item.desc }}</span>
            </div>
            <div class="room-state">
              <span class="name">当前状态</span>
              <span
                class="name state"
                :style="{ color: item.curstatus ? '#5ace9f' : '' }"
                ><i class="iconfont icon-dot"></i
                >{{ item.curstatus ? "playing" : "halting" }}</span
              >
            </div>
            <div class="room-operate">
              <span v-if="item.pwd"> <i class="iconfont icon-lock"></i></span>
              <span> <i class="iconfont icon-add"></i></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottombg"></div>
  </div>
</template>
<script>
import {
  getRoomList,
  applyRoom,
  getMusic,
  createRoom,
  searchRoom,
} from "@/service/api.js";
import { Message } from "element-ui";
export default {
  data() {
    return {
      roomList: [],
      currentRoom: {},
      pwd: "",
      isSlider: false,
      name: "",
      timer: null,
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    changBlur() {
      window.scroll(0, 0);
    },
    search() {
      if (this.name != "") {
        searchRoom(this.name).then((res) => {
          clearInterval(this.timer);
          this.timer = null;
          this.roomList = res.data.data;
        });
      } else {
        this.interval();
      }
    },
    closeMsg(ev) {
      if (!this.$refs.slidebar.contains(ev.target)) {
        this.isSlider = false;
      }
    },
    openMenu() {
      this.$global.isMenuShow = true;
    },
    clickSlide(data) {
      this.currentRoom = data;
      this.isSlider = true;
    },
    getMusicLists() {
      const _vm = this;
      getMusic(this.$global.roomInfo.id)
        .then((res) => {
          _vm.$global.isPlay = res.data.data;
        })
        .catch((err) => {
        });
    },
    getRoom() {
      getRoomList().then((res) => {
        this.roomList = res.data.data;
      });
    },
    returnRoom() {
      this.$router.push("/room");
    },
    getRoomId() {
      return this.$global.roomInfo.id;
    },
    async applyroom(item, pwd = "") {
      // if (this.$global.roomInfo.id != item.id) {
      //   Message.info('请先退出当前房间！')
      // } else {
      if (!this.$global.userInfo.uid) {
        Message.error("请先登录！");
        this.$global.isShow = true;
      } else {
        const _vm = this;
        await applyRoom({ id: item.id, pwd: pwd })
          .then((res) => {
            if (res.data.status !== 401) {
              localStorage.setItem(
                "roomInfo",
                JSON.stringify({
                  id: item.id,
                  name: item.name,
                  desc: item.desc,
                  pwd: pwd ? true : false,
                  profile: item.profile,
                })
              );
              _vm.$global.roomInfo = {
                id: item.id,
                name: item.name,
                desc: item.desc,
                pwd: pwd ? true : false,
                profile: item.profile,
              };
              _vm.$router.push({ path: "/room" });
              _vm.$global.initWebSocket(_vm.$global.roomInfo.id);
              _vm.getMusicLists();
            }
          })
          .catch((err) => {
          });
        // }
      }
    },
    creates() {
      this.$global.isCreateShow = true;

    },
    interval() {
      if (this.timer != null) {
        clearInterval(this.timer);
        this.timer = null;
      }

      this.timer = setInterval(() => {
        this.getRoom();
      }, 3000);
    },
  },
  computed: {
    myId: function () {
      return this.$global.userInfo.uid;
    },
  },
  created() {
    if (this.$global.userInfo.uid != undefined) this.getRoom();
  },
  mounted() {
    if (this.$global.userInfo.uid != undefined) {
      this.interval();
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/roomList.scss";
</style>
