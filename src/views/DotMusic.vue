<template>
  <div class="dotmusic">
    <Header></Header>

    <Dot></Dot>
  </div>
</template>
<script>
import { dotMusic, getRoomMusicList } from "@/service/api.js";
import Header from "@/components/RoomHeader";
import { Message } from "element-ui";
import Dot from '@/components/Dot'
export default {
  data () {
    return {
      musicList: [],
      kw: "",
      isShowList: false,
    };
  },
  components: { Header, Dot }
};
</script>
<style lang="scss" scoped>
.dotmusic {
  width: 100%;
  height: 100%;
  border-top-right-radius: 10px;
  overflow: auto;
}
</style>
