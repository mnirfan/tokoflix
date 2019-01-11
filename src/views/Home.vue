<template>
  <div v-if="isLoading">
    <loading/>
  </div>
  <div class="top-container" v-else>
    <h1>Sedang Tayang</h1>
    <div class="movie-list">
      <div class="movie-item" v-for="movie in moviesData.results" :key="movie.id">
        <div class="poster">
          <img :src="$store.state.imgBaseUrl + movie.poster_path">
        </div>
        <div class="info">
          <div class="text">
            <h2>{{movie.original_title}}</h2>
            <div class="rating">
              <i class="material-icons">star</i>
              {{movie.vote_average}}
            </div>
            <p>{{truncate(movie.overview)}}</p>
          </div>
          <div class="action">
            <div class="bought" v-if="$store.state.boughtMovies.indexOf(movie.id) > -1">
              <i class="material-icons">check_circle</i> <span>Anda telah memiliki film ini</span>
            </div>
            <div class="action-buttons">
              <div class="button" @click="showDetail(movie)">
                Detail
              </div>
              <div v-if="$store.state.boughtMovies.indexOf(movie.id) < 0"
                  class="button primary"
                  @click="confirm(movie)">
                Beli Rp{{moviePrice(movie.vote_average).toLocaleString('id-ID')}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="horizcenter pagination-status">
      halaman {{ page }}/{{ moviesData.total_pages }}
    </div>
    <div class="horizcenter pagination">
      <div class="button icon"
           v-if="page !== 1"
           @click="$router.push({ path: '/', query: { page: page - 1 } })">
        <i class="material-icons">keyboard_arrow_left</i>
        Sebelumnya
      </div>
      <div class="button icon"
           v-if="page < moviesData.total_pages"
           @click="$router.push({ path: '/', query: { page: page + 1 } })">
        Selanjutnya
        <i class="material-icons">keyboard_arrow_right</i>
      </div>
    </div>
    <modal-buy v-if="showConfirm"
               @close="showConfirm = false"
               :movie-data="confirmMovie"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import axios from 'axios'
import Loading from '../components/Loading.vue'
import ModalBuy from '../components/ModalBuy.vue'
import payment from '../helpers/payment'
export default {
  name: 'Home',
  components: {
    Loading,
    ModalBuy
  },
  data () {
    return {
      moviesData: {},
      page: this.$route.query.page || 1,
      showConfirm: false,
      confirmMovie: {},
      isLoading: true
    }
  },
  methods: {
    ...mapActions([
      'buyMovie'
    ]),
    confirm (movie) {
      this.confirmMovie = movie
      this.showConfirm = true
    },
    async getPopularMovies ({ state }, page) {
      let result = await axios({
        baseURL: this.$store.state.baseUrl,
        url: '/movie/now_playing',
        params: {
          api_key: this.$store.state.token,
          page: this.page,
          region: 'ID'
        }
      })
      this.moviesData = result.data
      this.isLoading = false
    },
    truncate (text) {
      if (text.length > 160) {
        return text.substring(0, 157) + '...'
      }
      return text
    },
    showDetail (movie) {
      let slug = movie.original_title.replace(/\W+/g, '-')
      this.$router.push(`/${movie.id}-${slug}`)
    }
  },
  watch: {
    page (to) {
      this.isLoading = true
      window.scrollTo(0, 0)
      this.getPopularMovies(to)
    },
    '$route' (to) {
      this.page = to.query.page || 1
    }
  },
  mounted () {
    this.getPopularMovies(this.page)
  },
  created () {
    this.moviePrice = payment.moviePrice
  }
}
</script>

<style lang="less" scoped>
  .pagination {
    >* {
      margin-left: 8px;
      margin-right: 8px;
    }
  }
  .pagination-status {
    margin: 12px;
  }
  .movie-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 24px;
    .movie-item {
      width: 48%;
      margin-bottom: 16px;
      // background-color: antiquewhite;
      display: flex;
      &:hover {
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.12);
      }
      .poster>img {
        height: 278px;
      }
      .info {
        width: 100%;
        padding: 12px;
        position: relative;
        h2 {
          font-size: 18px;
          margin: 0 0 12px 0;
        }
        p {
          margin: 0;
        }
        .rating {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          img {
            height: 20px;
          }
        }
        .action {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          .bought {
            padding: 12px;
          }
        }
      }
    }
  }
</style>
