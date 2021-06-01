<template>
  <div class="room">

    <Chat />
  </div>
</template>
<script>
import Chat from '@/components/Chat.vue'
export default {
  components: { Chat }
}
</script>
<style lang="scss" scoped>
.room {
  width: 100%;
  height: 100%;
  border-top-right-radius: 10px;
}

@media screen and(max-width:934px) {
  .room {
    background: transparent;
  }
}
@media screen and(max-height:1000px) {
  .room {
    background: transparent;
  }
}
</style>
