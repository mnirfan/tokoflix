import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import payment from './helpers/payment'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseUrl: 'https://api.themoviedb.org/3',
    imgBaseUrl: 'https://image.tmdb.org/t/p/w300',
    token: 'ce988ffcdb72a12d80cb923f413787b0',
    boughtMovies: [],
    balance: 100000
  },
  mutations: {
    pay (state, amount) {
      state.balance -= amount
    },
    addMovie (state, id) {
      state.boughtMovies.push(id)
    }
  },
  actions: {
    async getPopularMovies ({ state }, page) {
      let request = await axios({
        baseURL: state.baseUrl,
        url: '/movie/now_playing',
        params: {
          api_key: state.token,
          page,
          region: 'ID'
        }
      })
      return request.data
    },
    buyMovie ({ state, commit }, movie) {
      let price = payment.moviePrice(movie.vote_average)
      commit('pay', price)
      commit('addMovie', movie.id)
    }
  }
})
