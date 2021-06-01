<template>
  <div class="dot-box">
    <div class="dot-header">
      <div style="width:50px">点歌台</div>
      <div class="search-box">
        <div class="search-left">
          <input v-model="kw"
                 type="text"
                 class="search"
                 placeholder="Search Something Music..."
                 @keyup.enter="search()" />
          <span class="icons"
                @click="search()"><i class="iconfont icon-search"></i></span>
        </div>
        <div class="btn-right"></div>
      </div>
    </div>
    <div :class="{ 'hot-music-top': true, isSearchList: isShowList }">
      <div class="music-box"
           v-for="(item, index) in musicList"
           :key="index"
           @click="dot(item.id, item.name, item.al.picUrl)">
        <el-image class="hot-avators"
                  :key="item.al ? item.al.picUrl : index"
                  :src="item.al ? item.al.picUrl : '#'"
                  lazy></el-image>
        <div class="hot-music-info">
          <span class="hot-title">{{ item.name }}</span>
          <span class="hot-title">{{item.ar ? item.ar[0].name : ''}}</span>
        </div>
        <div class="music-time">
          <!-- <span class="totals-time">3:21</span> -->
          <span class="add-music"><i class="iconfont icon-add"></i></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { dotMusic, getRoomMusicList } from "@/service/api.js";
import Header from "@/components/RoomHeader";
import { Message } from "element-ui";
export default {
  data () {
    return {
      musicList: [],
      kw: "",
      isShowList: false,
    };
  },
  components: { Header },
  methods: {
    search () {
      this.$http({
        url: "http://192.168.123.60:8085/search",
        params: { keywords: this.kw, limit: 30, type: 1 },
        withCredentials: true,
      }).then((res) => {
        this.musicList = res.data.result.songs;
        let musicId = "";
        for (let i of this.musicList) {
          musicId += i.id + ",";
        }
        musicId = musicId.substring(0, musicId.lastIndexOf(","));
        this.getSongInfo(musicId);
      });
    },
    getSongInfo (musicIdList) {
      this.$http({
        url: "http://52.163.89.253:3000/song/detail",
        params: { ids: musicIdList },
        withCredentials: true,
      }).then((res) => {
        this.musicList = res.data.songs;
        this.isShowList = true;
      });
    },
    dot (id, name, pic) {
      if (this.$global.roomInfo.id) {
        const data = [
          {
            id: id,
            name: name,
            url: "",
            profile: pic
          }
        ];

        dotMusic(this.$global.roomInfo.id, data).then((res) => {
          if (res.data.code == 0) Message.success(res.data.message);
        });
      }
      else {
        Message.error("请先加入或创建房间再执行此操作！");
        setTimeout(() => {
          this.$global.isCreateShow = true;
        }, 300);
      }
    },
    getMusic () {
      getRoomMusicList(this.$global.roomInfo.id).then((res) => {
      });
    },
  },
  watch: {
    $route: function (newV, oldV) {
      newV ? (this.isShowList = false) : "";
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/dot.scss';
</style>
