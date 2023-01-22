import { createStore } from 'vuex'
import { streams } from '../../streams.json'
import axios from 'axios'

function onError(error, commit) {
  if (!error.response) {
    commit('setError', {
      'backend': true
    })
    console.log('Backend error', error)
  } else {
    commit('setError', {
      'mpd': true,
      'backend': false
    })
    console.log('MPD error', error)
  }
}

export default createStore({
  state: {
    volume: 1,
    playing: -1,
    lastStream: -1,
    error: {
      mpd: false,
      backend: false
    },
    streams: streams,
    hostname: location.hostname,
    port: 3000
  },
  mutations: {
    setVolume(state, vol) {
      state.volume = vol
    },
    setPlaying(state, i) {
      state.playing = i
      state.lastStream = i
    },
    setState(state, newState) {
      state.playing = parseInt(newState.playing)
      state.volume = parseFloat(newState.volume)
    },
    setError(state, error) {
      if (error.hasOwnProperty('mpd')) {
        state.error.mpd = error.mpd
      }
      if (error.hasOwnProperty('backend')) {
        state.error.backend = error.backend
      }
    }
  },
  actions: {
    getState({ commit, state }) {
      axios.get(`http://${state.hostname}:3000/get-state`)
        .then((res) => {
          commit('setState', res.data)
          commit('setError', { 'mpd': false, 'backend': false })
        })
        .catch((error) => onError(error, commit))
    },
    setVolume({ commit, state }, volume) {
      axios.post(`http://${state.hostname}:3000/set-volume`, {
          volume
        })
        .then((res) => {
          commit('setVolume', res.data.volume)
          commit('setError', { 'mpd': false, 'backend': false })
        })
        .catch((error) => onError(error, commit))
    },
    clickStream({ commit, state }, index) {
      axios.post(`http://${state.hostname}:3000/click-stream`, {
          index: index
        })
        .then((res) => {
          commit('setPlaying', res.data.index)
          commit('setError', { 'mpd': false, 'backend': false })
        })
        .catch((error) => onError(error, commit))
    },
    playMedia({ state, dispatch }) {
      if (state.playing === -1) { // if not playing, play last stream
        dispatch('clickStream', state.lastStream)
      }
    },
    pauseMedia({ state, dispatch }) {
      if (state.playing >= 0) { // if playing, pause current stream
        dispatch('clickStream', state.playing)
      }
    }
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