<template>
  <div class="chat" @click="closeMsg($event)">
    <Header></Header>
    <div class="container">
      <div class="music-main">
        <div class="music-ui">
          <div class="music-play">
            <div class="avator-container">
              <div class="music-avator">
                <div class="inner-avator">
                  <img
                    :src="
                      currentMusic
                        ? currentMusic['profile']
                          ? currentMusic['profile']
                          : require('../assets/music.png')
                        : require('../assets/music.png')
                    "
                    :class="{
                      'img-body': true,
                      'img-rotate': this.$global.currentState,
                    }"
                    alt=""
                  />
                </div>
              </div>
            </div>

            <div class="music-info">
              <div class="music-name">
                {{ currentMusic ? currentMusic["name"] : "暂无歌曲" }}
              </div>
              <!-- <div class="music-author">XXX</div> -->
              <!-- <div class="music-lcry">歌词</div> -->
              <div class="bar">
                <div class="control-play">
                  <span @click="nextPlay(-1)"
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
                  <span @click="nextPlay(1)"
                    ><i class="icon iconfont icon-xiayishou1"></i
                  ></span>
                </div>
                <div class="chat-volume">
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
                  <el-slider v-model="musicVolumeAdjust"></el-slider>
                </div>
              </div>
              <div class="musicEnd">
                <span>{{ current_Time }}/{{ total_Time }}</span>
              </div>

              <el-slider
                v-model="musicCurrentTime"
                :max="allDuration"
                :disabled="userGranteSymbol[myGrant] == '用户'"
                @change="changeMusicCurrent"
                @mousedown.native="stopUpdate"
                @mouseup.native="startUpdate"
                :format-tooltip="secToTimes"
              ></el-slider>
            </div>
          </div>
          <div class="music-list" v-if="musicList.length">
            <div class="table-title">
              <div class="title-name">序号</div>
              <div class="title-name">歌曲</div>
              <!-- <div class="title-name">时长</div> -->
              <div class="title-name">操作</div>
            </div>
            <div class="music-queue">
              <draggable
                v-model="musicList"
                forceFallback="true"
                animation="500"
                delay="40"
                @start="onStart()"
                @end="onEnd()"
              >
                <div
                  :class="{
                    'music-queue-list': true,
                    'music-current': musics(index) ? true : false,
                  }"
                  style="padding: 10px"
                  v-for="(item, index) in musicList"
                  :key="item.ord"
                >
                  <div class="flex-view music-ranks">{{ index + 1 }}</div>
                  <div class="flex-view music-names">{{ item.name }}</div>
                  <!-- <div class="flex-view music-authors"></div> -->
                  <div class="flex-view music-dotpeople">
                    <el-dropdown trigger="click">
                      <span class="el-dropdown-link add-musics"
                        ><i
                          class="iconfont icon-diandian"
                          :style="{ color: musics(index) ? 'white' : '' }"
                        ></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="!musics(item.ord)"
                          ><span class="child_menu" @click="putPeak(item.ord)"
                            >置顶</span
                          ></el-dropdown-item
                        >
                        <el-dropdown-item
                          ><span class="child_menu" @click="delMusic(item)"
                            >删除歌曲</span
                          ></el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
              </draggable>
            </div>
          </div>
          <div class="music-list tip" v-else>
            <i class="iconfont icon-zanwushuju"></i>暂无歌曲哦,快去<router-link
              to="/dot"
              style="color: #7ac9d2"
              >点歌</router-link
            >或者<router-link to="/upload" style="color: #7ac9d2"
              >上传</router-link
            >自己喜欢的歌曲吧~
          </div>
        </div>
        <div class="chat-ui">
          <div class="utilizi">
            <div class="user-list" @click.stop="people">
              <i class="iconfont icon-users"></i
              ><span>{{ userList.length }}</span>
            </div>
            <div class="clear" @click.stop="clear">
              <i class="iconfont icon-clear"></i>
            </div>
            <div
              v-if="roomRole(myGrant)"
              class="alter-rooms"
              @click.stop="getRoom()"
            >
              <i class="iconfont icon-xiugai1"></i>
            </div>
          </div>
          <div
            :class="{ aside: true, 'aside-slide': isSlidePeople }"
            ref="userQueue"
          >
            <div
              class="music-queue-list"
              style="padding: 10px; color: white"
              v-for="(item, index) in userList"
              :key="index"
            >
              <div class="flex-view music-ranks">
                <img
                  :src="
                    item.profile
                      ? item.profile
                      : require('../assets/avator.png')
                  "
                  alt=""
                  style="width: 50px; height: 50px; border-radius: 50%"
                />
              </div>
              <div class="flex-view music-names">{{ item.username }}</div>
              <div class="flex-view music-names">
                {{ userGranteSymbol[item.role] }}
              </div>
              <!-- <div class="flex-view music-authors"></div> -->
              <div class="flex-view music-dotpeople">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link add-musics"
                    ><i class="iconfont icon-diandian" style="color: white"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="
                        roomRole(myGrant) &&
                        item.uid != userId &&
                        item.role != 'ROOM_ADMIN'
                      "
                      ><span
                        class="child_menu"
                        @click="userGrant(item.uid, 'ROOM_ADMIN')"
                        >提升为管理员</span
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="
                        roomRole(myGrant) &&
                        item.uid != userId &&
                        item.role == 'ROOM_ADMIN'
                      "
                      ><span
                        class="child_menu"
                        @click="userGrant(item.uid, 'USER')"
                        >取消管理员</span
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="
                        (myGrant == 'OWNER' || myGrant == 'ROOM_ADMIN') &&
                        item.uid != userId &&
                        item.role != 'OWNER'
                      "
                      ><span class="child_menu" @click="getOutUser(item.uid)"
                        >踢出房间</span
                      ></el-dropdown-item
                    >
                    <el-dropdown-item
                      ><span
                        class="child_menu"
                        @click="lookUserInfo(item.uid)"
                        >{{
                          item.uid != userId ? "查看Ta的信息" : "查看我的信息"
                        }}</span
                      ></el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </div>
          <div class="chat-main" ref="slide">
            <div class="chat-list">
              <div v-for="(item, index) in chatList" :key="index">
                <div
                  v-if="item.type == 'SYSTEM' || item.type == 'TEXT'"
                  :class="{ messages: true, 'user-mine': item.uid == userId }"
                  :style="{
                    'text-align':
                      item.type == 'SYSTEM'
                        ? 'center'
                        : item.uid == userId
                        ? 'right'
                        : 'left',
                    'z-index': 0,
                  }"
                >
                  <div
                    class="user-avator"
                    @click="lookUserInfo(item.uid)"
                    :style="{
                      left: item.uid == userId ? 'auto' : '0',

                      right: item.uid == userId ? '0' : '',

                      display: item.type == 'TEXT' ? 'block' : 'none',
                    }"
                  >
                    <img
                      :src="
                        item.type == 'TEXT' &&
                        (getHistory[item.username]
                          ? getHistory[item.username]
                          : require('../assets/avator.png'))
                      "
                      alt=""
                    />
                  </div>
                  <div
                    :class="{
                      'system-message': item.type == 'SYSTEM',
                      'user-message': true,
                      'users-message': item.uid == userId,
                    }"
                    :style="{
                      padding: item.type == 'SYSTEM' ? '2px 14px' : '',
                      'border-radius': item.type == 'SYSTEM' ? '20px' : '',
                    }"
                  >
                    {{ item.content }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="send-message">
            <twemoji-textarea
              ref="texts"
              :textarea="true"
              :emojiData="emojiDataAll"
              :emojiGroups="emojiGroups"
              :enableSendBtn="true"
              :initialContent="content"
              :cleanText="true"
              @enterKey="onEnterKey"
              @contentChanged="logs"
            >
            </twemoji-textarea>
          </div>
        </div>
      </div>
    </div>

    <Views
      :other_info="info"
      :isShowInfo="isShowInfo"
      @changes="changeShow"
    ></Views>
    <RoomInfo
      :other_info="roomInfoDesc"
      :isShowInfo="isRoomInfo"
      @changes="changeRoomShow"
    ></RoomInfo>
  </div>
</template>
<script>
import { TwemojiTextarea } from "@kevinfaguiar/vue-twemoji-picker";
import EmojiAllData from "@kevinfaguiar/vue-twemoji-picker/emoji-data/en/emoji-all-groups.json";
import EmojiGroups from "@kevinfaguiar/vue-twemoji-picker/emoji-data/emoji-groups.json";
import { Message } from "element-ui";
import Header from "./RoomHeader";
import RoomInfo from "./RoomInfo";
import draggable from "vuedraggable";
import Views from "./ViewUserInfo";
import {
  getUserList,
  getMusic,
  getRoomMusicList,
  putUserGrant,
  changeOrder,
  breakUser,
  getUserInfo,
  deleteMusic,
  closeRoom,
} from "@/service/api.js";

import { secToTime, nextMusic, playMusic, move } from "@/utils/index.js";

export default {
  data() {
    return {
      isSlidePeople: false,
      content: "",
      scrollHeight: null,
      state: { "": "visible", hidden: "visible", visible: "hidden" },
      opstate: { "": 0, hidden: 0, visible: 1 },
      userGranteSymbol: { OWNER: "房主", ROOM_ADMIN: "管理员", USER: "用户" },
      oldOrder: [],
      oldList: [],
      info: {},
      roomInfoDesc: {},
      isShowInfo: false,
      isRoomInfo: false,
      musicCurrentTime: this.$global.currentTime,
    };
  },
  components: {
    draggable,
    Header,
    Views,
    RoomInfo,
    "twemoji-textarea": TwemojiTextarea,
  },
  methods: {
    logs(v) {
      this.content = v;
    },
    onEnterKey(event) {
      event.stopPropagation();
      event.preventDefault();
      if (this.content != "") this.sendText(this.content);
      this.$refs.texts.cleanText();
    },
    getRoom() {
      this.roomInfoDesc = this.$global.roomInfo;
      this.isRoomInfo = true;
    },
    changeRoomShow(val) {
      this.isRoomInfo = val;
    },
    changeShow(val) {
      this.isShowInfo = val;
    },
    closeMsg(ev) {
      if (this.$refs.userQueue && !this.$refs.userQueue.contains(ev.target)) {
        this.isSlidePeople = false;
      }
    },
    clear() {
      this.$global.chatList = [];
    },
    people() {
      this.isSlidePeople = !this.isSlidePeople;
    },
    putPeak(index) {
      const ord = this.$global.musicList.map((value) => {
        return value.ord;
      });
      let newList = move(
        ord,
        ord.indexOf(index),
        ord.indexOf(this.$global.index) + 1
      );
      const data = { cur: newList.indexOf(this.$global.index), order: newList };
      this.$global.index = newList.indexOf(this.$global.index);
      this.changeMusicOrder(data);
    },
    delMusic(item) {
      let _vm = this;
      // if (this.myGrant != "OWNER" && this.myGrant != "ROOM_ADMIN") {
      //   Message.info("暂无权限");
      // } else {
        deleteMusic(this.$global.roomInfo.id, item.id).then((res) => {
          if (res.data.code == 0) {
            Message.success(res.data.message);
            _vm.$global.musicList.splice(
              _vm.$global.musicList.indexOf(item),
              1
            );
            _vm.$global.musicList = _vm.$global.musicList;
          } else {
            Message.error(res.data.message);
          }
        });
      // }
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
      this.$global.isDrag = false;
      this.$global.syncMusicState({
        time: this.$global.currentTime,
        status: this.$global.currentState,
        type: "MUSIC",
        index: this.$global.index,
      });
    },
    muteVolume() {
      this.$global.isMuteVolume = !this.$global.isMuteVolume;
    },
    plays(times = this.$global.currentTime) {
      if (this.$global.isPlay === "#" || this.$global.isPlay === "") {
        Message.error("暂无歌曲");
      } else {
        this.userGranteSymbol[this.myGrant] != "用户"
          ? playMusic(this.$global, times)
          : "";
      }
    },
    nextPlay(num) {
      if (this.$global.isPlay === "#" || this.$global.isPlay === "") {
        Message.error("暂无歌曲");
      } else {
        this.userGranteSymbol[this.myGrant] != "用户"
          ? nextMusic(this.$global, this.$global.index + num)
          : "";
      }
    },
    onStart() {
      this.oldList = this.$global.musicList;
      this.oldOrder = this.oldList.map((value) => {
        return value.ord;
      });
    },
    onEnd() {
      const ord = this.$global.musicList.map((value) => {
        return value.ord;
      });
      if (this.userGranteSymbol[this.myGrant] != "用户") {
        if (!(JSON.stringify(this.oldOrder) == JSON.stringify(ord))) {
          const data = { cur: ord.indexOf(this.$global.index), order: ord };
          this.$global.index = ord.indexOf(this.$global.index);
          this.changeMusicOrder(data);
        }
      } else {
        this.$global.musicList = this.oldList;
        Message.error("暂无权限！");
      }
    },
    async syncSendData() {
      await this.getMusicLists();
    },
    userGrant(uid, role) {
      putUserGrant({
        rid: this.$global.roomInfo.id,
        role: role,
        uid: uid,
      }).then((res) => {
        this.getUsers();
      });
    },

    roomRole(role) {
      return role === "OWNER";
    },
    changeMusicOrder(data) {
      changeOrder(this.$global.roomInfo.id, data).then((res) => {
        if (res.data.code === 0) Message.success("切换歌曲顺序成功!");
        else Message.error(res.data.message);
      });
    },
    lookUserInfo(uid) {
      getUserInfo(uid).then((res) => {
        this.info = res.data;
        this.isShowInfo = true;
      });
    },
    getOutUser(uid) {
      breakUser({ rid: this.$global.roomInfo.id, uid: uid }).then((res) => {});
    },
    getUsers() {
      getUserList(this.$global.roomInfo.id).then((res) => {
        this.$global.userList = res.data.data;
        for (let i of this.$global.userList) {
          this.$global.historyUserList[i.username] = i.profile;
        }
      });
    },
    getRoomMusicsList() {
      const _vm = this;
      getRoomMusicList(this.$global.roomInfo.id).then((res) => {
        if (res.data.code === 0) {
          _vm.$global.musicList = res.data.data.map((value, index) => {
            value.ord = index;
            return value;
          });
          localStorage.setItem(
            "musicListInfo",
            JSON.stringify(_vm.$global.musicList)
          );
        }
      });
    },
    returnHome() {
      if (this.myGrant == "OWNER") {
        closeRoom(this.$global.roomInfo.id).then((res) => {});
      }
      if (this.$global.websock) {
        this.$global.websock.close();
      }
      this.$global.isPlay = "";
      this.$global.roomInfo = {};
      this.$global.chatList = [];
      this.$global.musicList = [];
      this.$global.userList = [];
      this.$global.currentTime = 0;
      this.$global.index = 0;
      localStorage.removeItem("musicListInfo");
      localStorage.removeItem("roomInfo");
      this.$router.push({ path: "/" });
    },
    getMusicLists() {
      const _vm = this;
      getMusic(this.$global.roomInfo.id)
        .then((res) => {
          _vm.$global.isPlay = res.data.data;
          _vm.getUsers();
          _vm.getRoomMusicsList();
        })
        .catch((err) => {
          _vm.returnHome();
        });
    },
    handlePushKeyword(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.sendText(this.content);
        return false;
      }
    },
    addNewLine(e) {
      const ele = e.target;
      const cursorIndex = ele.selectionStart;
      const tempText = this.content.split("");
      tempText.splice(cursorIndex, 0, "\n");
      this.content = tempText.join("");
      this.$nextTick(() => {
        ele.selectionStart = ele.selectionEnd = cursorIndex + 1;
      });
    },
    sendText(message) {
      if (this.$global.websock) {
        this.$global.websocketsend({
          uid: this.$global.userInfo.uid,
          username: this.$global.userInfo.username,
          content: message,
          type: "TEXT",
          timestamp: new Date().getTime(),
        });
        this.content = "";
      }
    },
  },
  computed: {
    getHistory() {
      return this.$global.historyUserList;
    },
    emojiDataAll() {
      return EmojiAllData;
    },
    emojiGroups() {
      return EmojiGroups;
    },
    userAvator() {
      return (item) => {
        for (let i of this.userList) {
          if (i.uid == item.uid)
            return i.profile ? i.profile : require("../assets/avator.png");
        }
      };
    },
    roomInfos() {
      return this.$global.roomInfo;
    },
    defaultImg() {
      return 'this.src="' + require("../assets/music.png") + '"';
    },
    musics() {
      return (item) => {
        return this.$global.index === item;
      };
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
    musicVolumeAdjust: {
      get() {
        return Math.floor(this.$global.musicVolume * 100);
      },
      set(v) {
        this.$global.musicVolume = this.$global.music.volume = v / 100;
      },
    },
    currentMusic: function () {
      return this.$global.musicList[this.$global.index];
    },
    userId: function () {
      return this.$global.userInfo.uid;
    },
    chatList: function () {
      return this.$global.chatList;
    },
    userList: function () {
      return this.$global.userList;
    },
    myGrant: function () {
      for (let i of this.$global.userList) {
        if (i.uid == this.$global.userInfo.uid) return i.role;
      }
    },
    musicList: {
      get() {
        return this.$global.musicList;
      },
      set(v) {
        this.$global.musicList = v;
      },
    },
  },
  watch: {
    "$global.musicVolume": function (newValue, oldValue) {
      if (newValue <= 0) {
        this.$global.musicVolume = 0;
        this.$global.isMuteVolume = true;
      }
    },
    "$global.isMuteVolume": function (newValue, oldValue) {
      newValue
        ? (this.$global.musicVolume = this.$global.music.volume = 0)
        : (this.$global.musicVolume = this.$global.music.volume = 0.4);
    },
    "$global.currentTime": function (newValue, oldValue) {
      this.musicCurrentTime = newValue;
    },
  },
  created() {
    if (this.$global.roomInfo.id && localStorage.getItem("userInfo")) {
      this.syncSendData();
      setTimeout(() => {
        if (this.$refs.slide) {
          this.$refs.slide.scrollTop = this.$refs.slide.scrollHeight;
        }
      }, 10);
    } else {
      if (!localStorage.getItem("userInfo")) {
        this.$global.isShow = true;
      }
      localStorage.removeItem("roomInfo");
      this.$router.push({ path: "/" });
    }
  },
  mounted() {
    this.$global.handleGetUserList = () => {
      this.syncSendData();
    };
    this.$global.handleCloseRoomState = () => {
      this.returnHome();
    };
    this.$global.handleMonitorMessage = () => {
      setTimeout(() => {
        if (this.$refs.slide) {
          this.$refs.slide.scrollTop = this.$refs.slide.scrollHeight;
        }
      }, 10);
    };
  },
};
</script>
<style lang="scss">
@import "@/styles/chat.scss";
</style>
