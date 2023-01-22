<template>
    <div v-show="error">
      <inline-svg :src="require(`../assets/error.svg`)"></inline-svg>
      <span> {{ msg }} </span>
    </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'

export default {
  components: {
    'inline-svg': InlineSvg
  },
  props: {
    error: {
      type: Boolean,
      required: true
    },
    msg: {
      type: String,
      required: true
    }
  },
}
</script>

<style scoped>

div {
  font-size: 20px;
  background-color: red;
  color: black;
  margin-bottom: 4px;
  height: 32px;
}

svg {
  display: inline;
  width: 16px;
  height: 16px;
  padding: 8px 6px;
}

span {
  vertical-align: top;
  line-height: 32px;
}
</style>