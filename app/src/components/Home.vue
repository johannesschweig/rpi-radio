<template>
  <div>
    <div class='nav'>
      <div class='title'>kuechenradio</div>
      <div class='description'>Wähle einen Stream aus, um ihn zu starten</div>
    </div>
    <Error
      :error="error.backend"
      msg="Verbindung zum Backend verloren"/>
    <Error
      :error="error.mpd"
      msg="Verbindung zum Audioserver verloren"/>
    <Volume />
    <div class='grid'>
      <Stream 
        v-for='(obj, index) in streams'
        :obj='obj'
        :index='index'
        :playing='index === playing'
        />
    </div>
  </div>
</template>

<script>
import Error from './Error.vue'
import Stream from './Stream.vue'
import Volume from './Volume.vue'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: {
    Error,
    Stream,
    Volume
  },
  computed: mapState({
    streams: state => state.streams,
    playing: state => state.playing,
    error: state => state.error,
  }),
  created() {
    this.$store.dispatch('getState')
  }
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: 1fr;
  gap: 6px;
}

.nav {
  margin-bottom: 24px;
  margin-top: -12px;
  font-family: 'Oswald', sans-serif;
  /* font-family: 'VT323', monospace; */
}

.nav .title {
  text-transform: uppercase;
  font-size: 40px;
}

.nav .description {
  font-size: 14px;
  opacity: .8;
}

</style>
