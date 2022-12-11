import { createStore } from 'vuex'
import { streams } from '../../streams.json'
import axios from 'axios'

export default createStore({
  state: {
    volume: 1,
    streams: streams,
    playing: -1,
    hostname: location.hostname,
    port: 3000
  },
  mutations: {
    setVolume(state, vol) {
      state.volume = vol
    },
    setPlaying(state, i) {
      state.playing = i
    },
    setState(state, newState) {
      state.playing = parseInt(newState.playing)
      state.volume = parseFloat(newState.volume)
    }
  },
  actions: {
    getState({ commit, state }) {
      axios.get(`http://${state.hostname}:3000/get-state`)
      .then((res) => {
        commit('setState', res.data)
      })
      .catch((error) => {
        console.log('error', error)
      })
    },
    setVolume({ commit, state }, volume) {
      axios.post(`http://${state.hostname}:3000/set-volume`, {
        volume
      })
      .then((res) => {
        commit('setVolume', res.data.volume)
      })
      .catch((error) => {
        console.log('error', error)
      })

    },
    clickStream({ commit, state }, index) {
      axios.post(`http://${state.hostname}:3000/click-stream`, {
        index: index
      })
      .then((res) => {
        commit('setPlaying', res.data.index)
      })
      .catch((error) => {
        console.log('error', error)
      })
    },
    
  },
  getters: {
    getHighlightColor: state => {
      if (state.playing == -1) {
        return 'white'
      } else {
        return state.streams[state.playing].color
      }
    }
  }
})
