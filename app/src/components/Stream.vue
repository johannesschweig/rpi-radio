<template>
  <div
    class='btn'
    :style='getStyle'
    :key='index'
    @click='clickStream(index)'>
      <inline-svg
        :class='{ "black": obj.blackPath && playing }'
        :src="getSvg" />
      <span>{{ obj.name }}</span>
    </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'
import { mapActions } from 'vuex'

export default {
  components: {
    'inline-svg': InlineSvg
  },
  data() {
    return {
    }
  },
  props: {
    obj: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    playing: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    getSvg() {
      return require(`../assets/${this.obj.icon}.svg`)
    },
    getStyle() {
      let style = {}
      if(this.playing) {
        style['background-color'] = this.obj.color
        style['grid-column'] = 'span 2'
        style['grid-row'] = 'span 2'
      } else {
        style['opacity'] = .8
      }
      return style // und das geld
    }
  },
  methods: mapActions([
    'clickStream'
  ])
}
</script>

<style scoped>
.btn {
  font-size: 24px;
  position: relative;
}

.btn:hover,
.btn:active {
  cursor: pointer;
  opacity: 1 !important;
}

span {
  border: 1px solid white;
  background-color: black;
  padding: 0 4px;
  font-size: 13px;
  z-index: 1;
  position: absolute;
  bottom: 0;
  right: 0;
}

svg {
  display: block;
  width: 100%;
  height: 100%;
}

svg.black{
  fill: #000;
}
</style>