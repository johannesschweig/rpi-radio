<template>
  <div id='volume'>
    <div class='label'>Volume</div>
    <div class='controls'>
      <div
        v-for="i in 16"
        :class='["control", { "active": i<=volume }]'
        :style='{"background-color": getHighlightColor}'
        @click='setVolume(i/16)'>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"

export default {
  methods: mapActions([
    'setVolume'
  ]),
  computed: {
    ...mapGetters([
      'getHighlightColor'
    ]),
    ...mapState({
    volume: state => Math.round(state.volume * 16)
    })
  }
}
</script>

<style scoped>
#volume {
  margin-bottom: 24px;
}

.label {
  margin-bottom: 4px;
}

.controls {
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  height: 24px;
  gap: 6px;
}

.control {
  width: 100%;
  height: 100%;
  background-color: white;
  opacity: .5;
}

.control:hover {
  cursor: pointer;
}

.control.active {
  opacity: 1;
}
</style>