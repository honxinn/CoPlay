<template>
  <div class="user" @click="closeMsg($event)">
    <div ref="user">
      <div class="user-box">
        <div class="header">修改个人信息</div>
        <div class="user-info">
          <div class="avators">
            <img
              :src="
                profile ? profile : require('../assets/avator.png')
              "
              alt=""
            />
            <button class="btn_upload" @click="editAvatar">上传头像</button>
            <input
              v-show="false"
              type="file"
              accept="image/*"
              ref="bgfile"
              @change="uploadBG"
            />
            <button class="btn_upload cancel" @click="uploadFile">上传背景</button>
            <button class="btn_upload cancel" @click="withdraw">还原背景</button>
          </div>
          <div class="alter-box">
            <div class="alter">
              账号:<input type="text" v-model="users.username" disabled />
            </div>
            <div class="alter">
              简介:<input type="text" v-model="users.desc" />
            </div>
            <div class="alter">
              密码:<input
                type="password"
                v-model="users.password"
                placeholder="*********"
              />
            </div>
            <div class="alter">
              邮箱:<input type="text" v-model="users.mail" />
            </div>
            <div class="alter">
              <button class="btn_upload" @click="changeInfo">确认修改</button>
            </div>
          </div>
        </div>
      </div>

      <el-dialog title="修改头像" :visible.sync="editAvatarDialog" width="40%">
        <el-row type="flex" justify="center">
          <div class="cropper">
            <vueCropper
              ref="cropper"
              :img="option.img"
              :outputSize="option.size"
              :outputType="option.outputType"
              :info="option.info"
              :full="option.full"
              :canMove="option.canMove"
              :canMoveBox="option.canMoveBox"
              :original="option.original"
              :autoCrop="option.autoCrop"
              :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight"
              :fixedBox="option.fixedBox"
              @realTime="realTime"
            ></vueCropper>
          </div>
          <div class="previewBox">
            <div :style="previews.div" class="preview">
              <img :src="previews.url" :style="previews.img" />
            </div>
            <el-row type="flex" justify="center">
              <el-upload
                action=""
                :show-file-list="false"
                :auto-upload="false"
                :on-change="uploadImg"
              >
                <el-button size="mini" type="primary"> 更换头像 </el-button>
              </el-upload>
            </el-row>
            <br />
            <el-row>
              <el-button
                icon="el-icon-plus"
                circle
                size="mini"
                @click="changeScale(1)"
              ></el-button>
              <el-button
                icon="el-icon-minus"
                circle
                size="mini"
                @click="changeScale(-1)"
              ></el-button>
              <el-button
                icon="el-icon-download"
                circle
                size="mini"
                @click="down('blob')"
              ></el-button>
              <el-button
                icon="el-icon-refresh-left"
                circle
                size="mini"
                @click="rotateLeft"
              ></el-button>
              <el-button
                icon="el-icon-refresh-right"
                circle
                size="mini"
                @click="rotateRight"
              ></el-button>
            </el-row>
          </div>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editAvatarDialog = false">取 消</el-button>
          <el-button type="primary" @click="saveEditAvatar">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  changeUserInfo,
  getUserInfo,
  uploadAvator,
  uploadBg,
  withDraw,
} from "../service/api";
import { VueCropper } from "vue-cropper";
import { Message } from "element-ui";
import { inspectFileFormat } from "../utils/index";
export default {
  props: {
    userInfo: Object,
  },
  data() {
    return {
      users: this.$global.userInfo,
      profile: this.$global.userInfo.profile,
      avatarURL: require("@/assets/avator.png"),
      editAvatarDialog: false,
      previews: {},
      option: {
        img: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.5, // 剪切后的图片质量（0.1-1）
        full: true, // 输出原图比例截图 props名full
        outputType: "png", // 裁剪生成额图片的格式
        canMove: true, // 能否拖动图片
        original: false, // 上传图片是否显示原始宽高
        canMoveBox: true, // 能否拖动截图框
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 150,
        autoCropHeight: 150,
        fixedBox: true, // 截图框固定大小
      },
      fileData: new FormData(),
    };
  },
  components: { VueCropper },
  methods: {
    withdraw() {
      withDraw().then((res) => {
        if (res.data.code == 0) {
          this.$global.backgroundImg = require("../assets/pc.jpg");
          localStorage.removeItem("bg");
        }
      });
    },
    uploadBG() {
      var formData = new FormData();
      var files = this.$refs.bgfile.files;
      let _vm = this;
      if (inspectFileFormat(files)) {
        formData.append("file", files[0]);
        Message.success("稍后即将上传，请等待~");
        uploadBg(formData).then((res) => {
          if (res.data.code == 0) {
            Message.success("上传成功！");
            localStorage.setItem("bg", res.data.data);
            _vm.$global.backgroundImg = res.data.data;
          }
        });
      }
    },
    uploadFile() {
      this.$refs.bgfile.dispatchEvent(new MouseEvent("click"));
    },
    closeMsg(ev) {
      if (!this.$refs.user.contains(ev.target)) {
        if (this.$global.userSlider) {
          this.$global.userSlider = false;
        }
      }
    },
    // 保存头像修改
    saveEditAvatar() {
      this.editAvatarDialog = false;
      this.finish("blob");
    },
    // 放大/缩小
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    // 右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 保存上传图片
    finish(type) {
      if (type === "blob") {
        this.$refs.cropper.getCropBlob((data) => {
          this.avatarURL = window.URL.createObjectURL(data);
          //访问接口保存到数据库写这儿!
          var file = new File([data], "123", {
            type: data.type,
            lastModified: Date.now(),
          });
          this.upload(file);
        });
      } else {
        this.$refs.cropper.getCropData((data) => {
          //访问接口保存到数据库写这儿!
        });
      }
    },
    // 实时预览函数
    realTime(data) {
      this.previews = data;
    },
    // 下载图片
    down(type) {
      var aLink = document.createElement("a");
      aLink.download = "author-img";
      if (type === "blob") {
        this.$refs.cropper.getCropBlob((data) => {
          aLink.href = window.URL.createObjectURL(data);
          aLink.click();
        });
      } else {
        this.$refs.cropper.getCropData((data) => {
          aLink.href = data;
          aLink.click();
        });
      }
    },
    // 更换头像--上传本地图片
    uploadImg(file) {
      var _this = this;
      var reader = new FileReader();
      reader.onload = (e) => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        _this.option.img = data;
      };
      // 转化为base64
      // reader.readAsDataURL(file.raw)
      // 转化为blob
      reader.readAsArrayBuffer(file.raw);
    },
    editAvatar() {
      this.editAvatarDialog = true;
      this.option.img = this.users.profile
        ? this.users.profile
        : this.avatarURL;
    },
    upload(file) {
      var formData = new FormData();
      formData.append("file", file);
      Message.success("稍后即将上传，请等待~");
      uploadAvator(formData).then((res) => {
        this.getInfo();
        Message.success("上传成功");
      });
    },
    changeInfo() {
      let { password = "", mail = "", desc = "" } = this.users;
      changeUserInfo({ password, mail, desc }).then((res) => {
        if (res.data.code == 0) {
          Message.success(res.data.message);
          this.getInfo();
        }
      });
    },
    getInfo() {
      let _vm = this
      getUserInfo(this.$global.userInfo.uid).then((res) => {
        this.$global.userInfo = res.data;
        _vm.users.profile = res.data.profile;
        this.$global.historyUserList[_vm.users.username] = res.data.profile
        localStorage.setItem("user", JSON.stringify(res.data));
      });
    },
  },
  watch: {
    "$global.userInfo.profile": function(newV) {
      this.profile = newV
    }
  }
};
</script>

<style lang="scss">
@import "@/styles/userInfo.scss";
</style>