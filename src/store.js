import Vue from 'vue'
import Vuex from 'vuex'
import payment from './helpers/payment'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseUrl: 'https://api.themoviedb.org/3',
    imgBaseUrl: 'https://image.tmdb.org/t/p/w300',
    castBaseUrl: 'https://image.tmdb.org/t/p/w138_and_h175_face',
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
    buyMovie ({ state, commit }, movie) {
      let price = payment.moviePrice(movie.vote_average)
      commit('pay', price)
      commit('addMovie', movie.id)
    }
  }
})
