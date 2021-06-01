<template>
  <div class="upload">
    <Header></Header>

    <div class="upload-box">
      <div class="upload-left">
        <div class="icons">
          <span
            :class="{
              iconfont: true,
              'icon-upload1': true,
              isUploadding: uploadding,
            }"
            @drop="dropFile($event)"
            @dragover="DropDown($event)"
            @dragleave="DropLeave"
          ></span>
        </div>
        <div class="upload-menu">
          <span>将文件拖动到图片处或</span>
          <input
            v-show="false"
            type="file"
            accept="audio/*"
            ref="musicfile"
            @change="upload"
          />
          <button class="upload-btn" @click.prevent="uploadFile()">
            点击上传音乐
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadMusic } from "@/service/api.js";
import { inspectFileFormat } from "../utils/index";
import Header from "@/components/RoomHeader";
import { Message } from "element-ui";
export default {
  components: { Header },
  data() {
    return {
      flag: false,
      uploadding: false,
    };
  },
  methods: {
    DropLeave() {
      this.uploadding = false;
    },
    DropDown(e) {
      e.preventDefault();
      this.uploadding = true;
    },
    dropFile(e) {
      let _vm = this;
      if (_vm.$global.roomInfo.id) {
        var formData = new FormData();
        var files = e.dataTransfer.files;
        if (inspectFileFormat(files)) {
          this.uploadding = false;
          formData.append("file", files[0]);
          Message.success("稍后即将上传，请等待~");
          uploadMusic(_vm.$global.roomInfo.id, formData).then((res) => {
            Message.success("上传成功！");
          });
        }
      } else {
        Message.error("请先加入或创建房间再执行此操作！");
        setTimeout(() => {
          this.$global.isCreateShow = true;
        }, 300);
      }
    },
    upload() {
      if (this.$global.roomInfo.id) {
        var formData = new FormData();
        var files = this.$refs.musicfile.files;
        if (inspectFileFormat(files, "mp3")) {
          formData.append("file", files[0]);
          Message.success("稍后即将上传，请等待~");
          uploadMusic(this.$global.roomInfo.id, formData).then((res) => {
            if (res.data.code == 0) {
              Message.success("上传成功！");
            }
          });
        }
      } else {
        Message.error("请先加入或创建房间再执行此操作！");
        setTimeout(() => {
          this.$global.isCreateShow = true;
        }, 300);
      }
    },
    uploadFile() {
      this.$refs.musicfile.dispatchEvent(new MouseEvent("click"));
    },
  },
  mounted() {
    document.ondragover = function (e) {
      e.preventDefault();
    };
    document.ondrop = function (e) {
      e.preventDefault();
    };
  },
};
</script>

<style lang="scss" scoped>
.upload {
  width: 100%;
  height: 100%;
  border-top-right-radius: 10px;
  user-select: none;
  z-index: 2;
}
.upload-box {
  width: 70%;
  height: 70%;
  padding: 10px;
  display: flex;
  margin: 0 auto;
  margin-top: 80px;
  justify-content: center;
  position: relative;
  background: rgba(25, 25, 25, 0.5);
  backdrop-filter: blur(5px);
  align-items: center;
  border-radius: 15px 15px;
  box-shadow: 0px 0px 5px rgb(255, 255, 255, 0.2);
}
.upload-left {
  display: inline-block;
  width: 100%;
}
.upload-left {
  height: 100%;
}
.upload-left .iconfont {
  font-size: 50px;
  color: white;
  padding: 20px;
  -webkit-animation-name: scaleDraw; /*关键帧名称*/
  -webkit-animation-timing-function: ease-in-out; /*动画的速度曲线*/
  -webkit-animation-iteration-count: infinite; /*动画播放的次数*/
  -webkit-animation-duration: 5s; /*动画所花费的时间*/
}
@keyframes scaleDraw {
  /*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
  0% {
    transform: scale(1); /*开始为原始大小*/
  }
  25% {
    transform: scale(1.5); /*放大1.1倍*/
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.5);
  }
}
.icons,
.upload-menu {
  height: 50%;
}
.icons {
  display: flex;
  justify-content: center;
  align-items: center;
}
.upload-menu {
  font-size: 20px;
  color: white;
}
.upload-btn {
  width: 50%;
  padding: 20px;
  border-radius: 5px 5px;
  margin: 20px auto;
  display: block;
  border: none;
  outline: 0;
  background: #3082e8;
  box-shadow: 0px 0px 5px rgb(25, 25, 25, 0.3);
  color: white;
  font-size: 20px;
}
.upload-right {
  background: #fbfbfb;
}
.isUploadding {
  background: #7ac9d2;
  color: white !important;
  border-radius: 25% 25%;
}
</style>
