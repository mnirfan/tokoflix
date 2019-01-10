<template>
  <div class="top-container">
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
              <img src="../assets/star.png">
              {{movie.vote_average}}
            </div>
            <p>{{truncate(movie.overview)}}</p>
          </div>
          <div class="action">
            <div class="bought" v-if="$store.state.boughtMovies.indexOf(movie.id) > -1">
              Anda telah memiliki film ini
            </div>
            <div class="action-buttons">
              <div class="button" @click="showDetail(movie)">
                Detail
              </div>
              <div v-if="$store.state.boughtMovies.indexOf(movie.id) < 0"
                  class="button primary"
                  @click="buyMovie(movie)">
                Beli Rp{{moviePrice(movie.vote_average)}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import axios from 'axios'
import payment from '../helpers/payment'
export default {
  name: 'Home',
  data () {
    return {
      moviesData: {},
      page: this.$route.query.page || 1
    }
  },
  methods: {
    ...mapActions([
      'buyMovie'
    ]),
    async getPopularMovies ({ state }, page) {
      let request = await axios({
        baseURL: this.$store.state.baseUrl,
        url: '/movie/now_playing',
        params: {
          api_key: this.$store.state.token,
          page,
          region: 'ID'
        }
      })
      return request.data
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
  mounted () {
    this.getPopularMovies(this.page).then(movies => {
      this.moviesData = movies
    })
  },
  created () {
    this.moviePrice = payment.moviePrice
  }
}
</script>

<style lang="less" scoped>
  .movie-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
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
