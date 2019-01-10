<template>
  <div>
    <div class="header">
      <div class="top-container flex-row">
        <img class="poster" :src="$store.state.imgBaseUrl + movieData.poster_path">
        <div class="info">
          <div id="title">
            <strong>{{ movieData.original_title }}</strong>
            <span> ({{ new Date(movieData.release_date).getFullYear() }})</span>
          </div>
          <div class="actions">
            <div class="rating">
              <i class="material-icons">star</i>
              <span>{{movieData.vote_average}}</span>
            </div>
            <div>
              <i class="material-icons">access_time</i>
              <span v-if="runtimeText.hour >= 1">
                {{ runtimeText.hour }} jam {{ runtimeText.minutes }} menit
              </span>
              <span v-else>
                {{ runtimeText.minutes }} menit
              </span>
            </div>
            <div class="action-buttons">
              <div class="button primary large">
                Beli Rp{{ moviePrice(movieData) }}
              </div>
            </div>
          </div>
          <div class="overview">
            <span>Ringkasan</span>
            <p>{{ movieData.overview }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="top-container complete-info">
      <div>
        <h2>Pemeran</h2>
      </div>
      <div class="cast-list">
        <div class="cast-card" v-for="cast in movieData.credits.cast" :key="cast.id">
          <div class="photo">
            <img v-if="cast.profile_path" :src="$store.state.castBaseUrl + cast.profile_path">
            <i v-else class="material-icons">person</i>
          </div>
          <p class="name">{{ cast.name }}</p>
          <p class="character">{{ cast.character }}</p>
        </div>
        <!-- <div class="cast-card">
          <img src="https://image.tmdb.org/t/p/w138_and_h175_face/bRufyz5vvizHfMmz5gscDeaD62c.jpg" alt="">
          <p class="name">Sissy</p>
          <p class="character">Milly</p>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import payment from '../helpers/payment'
export default {
  name: '',
  data () {
    return {
      movieData: {}
    }
  },
  methods: {
    async getMovieDetail (id) {
      let request = await axios({
        baseURL: this.$store.state.baseUrl,
        url: `/movie/${id}`,
        params: {
          api_key: this.$store.state.token,
          append_to_response: 'credits'
        }
      })
      return request.data
    }
  },
  computed: {
    runtimeText () {
      let duration = {hour: 0, minutes: 0}
      if (this.movieData.runtime) {
        duration.hour = Math.floor(this.movieData.runtime / 60)
        duration.minutes = this.movieData.runtime - (duration.hour * 60)
      }
      return duration
    }
  },
  mounted () {
    let id = this.$route.params.movieurl.split('-')[0]
    this.getMovieDetail(id).then(response => {
      this.movieData = response
    })
  },
  created () {
    this.moviePrice = payment.moviePrice
  }
}
</script>
<style lang="less" scoped>
.header {
  color: white;
  background-color: rgb(49, 49, 49);
  padding-top: 16px;
  padding-bottom: 16px;
  .poster {
    width: 300px;
    height: 450px;
  }
  .info {
    display: flex;
    flex-flow: column;
    font-size: 14pt;
    margin-left: 24px;
    #title {
      font-size: 2em;
      span {
        font-size: 0.85em;
      }
    }
    .overview {
      font-size: 12pt;
    }
    .actions {
      display: flex;
      align-items: center;
      margin-top: 32px;
      margin-bottom: 32px;
      >* {
        margin-right: 36px;
      }
      >div {
        display: flex;
        align-items: center;
        span {
          margin-left: 4px;
        }
      }
    }
    .overview {
      >span {
        font-size: 16pt;
        font-weight: bold;
      }
    }
  }
}
.cast-list {
  display: flex;
  flex-wrap: wrap;
}
.cast-card {
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.12);
  margin-right: 24px;
  margin-bottom: 24px;
  width: 138px;
  .photo {
    height: 175px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgb(197, 197, 197);
    background-color: rgb(65, 65, 65);
    i {
      font-size: 42px;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  p {
    padding: 4px 12px;
    margin: 0;
    word-wrap: break-word;
    &.name {
      font-weight: bold;
    }
    &.character {
      margin-bottom: 24px;
    }
  }
}
</style>
