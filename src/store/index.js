import { createStore } from 'vuex'
import { streams } from '../../streams.json'
import axios from 'axios'

export default createStore({
  state: {
    volume: 1,
    streams: streams,
    playing: -1,
    hostname: location.hostname
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
      axios.post(`http://${state.hostname}:5000/get-state`)
      .then((res) => {
        console.log(res)
        commit('setState', res.data)
      })
      .catch((error) => {
        console.log('error', error)
      })
    },
    setVolume({ commit, state }, vol) {
      axios.post(`http://${state.hostname}:5000/set-volume`, {
        volume: vol
      })
      .then((res) => {
        commit('setVolume', res.data)
      })
      .catch((error) => {
        console.log('error', error)
      })

    },
    clickStream({ commit, state }, index) {
      axios.post(`http://${state.hostname}:5000/click-stream`, {
        index: index
      })
      .then((res) => {
        commit('setPlaying', res.data)
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
