<template>
  <div class="home">

    <RoomList></RoomList>
  </div>
</template>

<script>
import RoomList from '@/components/RoomList.vue'

export default {
  name: 'Home',
  components: { RoomList },
  data () {
    return {}
  },
  mounted () { }
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
}
</style>
