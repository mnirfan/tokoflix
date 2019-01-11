<template>
  <div v-if="isLoading">
    <loading/>
  </div>
  <div v-else>
    <div class="header">
      <div class="top-container flex-row">
        <div class="poster">
          <img :src="$store.state.imgBaseUrl + movieData.poster_path">
        </div>
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
            <div class="action-buttons" v-if="$store.state.boughtMovies.indexOf(movieData.id) < 0">
              <div class="button primary large" @click="showConfirm = true">
                Beli Rp{{ moviePrice(movieData.vote_average).toLocaleString('id-ID') }}
              </div>
            </div>
            <div class="bought" v-else>
              <i class="material-icons">check_circle</i>
              <span> Anda memiliki film ini</span>
            </div>
          </div>
          <div class="overview">
            <span>Ringkasan</span>
            <p>{{ movieData.overview }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="top-container">
      <div class="section-title">
        <h2>Pemeran</h2>
      </div>
      <div class="cast-list">
        <div class="cast-card" v-for="cast in cast.slice(0, castCount)" :key="cast.id">
          <div class="photo">
            <img v-if="cast.profile_path" :src="$store.state.castBaseUrl + cast.profile_path">
            <i v-else class="material-icons">person</i>
          </div>
          <p class="name">{{ cast.name }}</p>
          <p class="character">{{ cast.character }}</p>
        </div>
      </div>
      <div>
        <div v-if="cast.length > 6" class="button" @click="toggleCastCount()">
          {{ castCount == 6 ? 'Tampilkan selengkapnya' : 'Tampilkan lebih sedikit' }}
        </div>
      </div>
      <div class="section-title">
        <h2>Rekomendasi</h2>
      </div>
      <div class="recomm-list">
        <div class="recomm-card" 
             v-for="item in recommendations" 
             :key="item.id"
             @click="$router.push({ path: `/${item.id}-${item.original_title.replace(/\W+/g, '-')}` })">
          <div class="backdrop">
            <img v-if="item.backdrop_path" :src="$store.state.backdropBaseUrl + item.backdrop_path">
            <i v-else class="material-icons">broken_image</i>
          </div>
          <div class="flex-row recomtext">
            <div class="recomm-title">
              {{ item.original_title }}
            </div>
            <div class="verticenter">
              <i class="material-icons">star</i> <span>{{ item.vote_average }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="section-title">
        <h2>Serupa</h2>
      </div>
      <div class="recomm-list">
        <div class="recomm-card" 
             v-for="item in similar" 
             :key="item.id"
             @click="$router.push(`/${item.id}-${item.original_title.replace(/\W+/g, '-')}`)">
          <div class="backdrop">
            <img :src="$store.state.backdropBaseUrl + item.backdrop_path">
          </div>
          <div class="flex-row recomtext">
            <div class="recomm-title">
              {{ item.original_title }}
            </div>
            <div class="verticenter">
              <i class="material-icons">star</i> <span>{{ item.vote_average }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal-buy v-if="showConfirm" 
               @close="showConfirm = false" 
               :movie-data="movieData"/>
  </div>
</template>
<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import payment from '../helpers/payment'
import Loading from '../components/Loading.vue'
import ModalBuy from '../components/ModalBuy.vue'
export default {
  name: '',
  components: {
    Loading,
    ModalBuy
  },
  data () {
    return {
      movieData: {},
      castCount: 6,
      cast: [],
      recommendations: [],
      similar: [],
      isLoading: true,
      showConfirm: false
    }
  },
  methods: {
    ...mapActions([
      'buyMovie'
    ]),
    async getMovieDetail () {
      let id = this.$route.params.movieurl.split('-')[0]
      let response = await axios({
        baseURL: this.$store.state.baseUrl,
        url: `/movie/${id}`,
        params: {
          api_key: this.$store.state.token,
          append_to_response: 'credits,similar,recommendations'
        }
      })
      this.movieData = response.data
      this.cast = response.data.credits.cast || []
      this.recommendations = response.data.recommendations.results || []
      this.similar = response.data.similar.results || []
      this.isLoading = false
    },
    toggleCastCount () {
      if (this.castCount == 6) {
        this.castCount = this.cast.length
      }
      else {
        this.castCount = 6
      }
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
  watch: {
    '$route' (to, from) {
      this.isLoading = true
      window.scrollTo(0, 0)
      this.getMovieDetail()
    }
  },
  created () {
    this.moviePrice = payment.moviePrice
    this.getMovieDetail()
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
.section-title {
  margin-top: 36px;
}
.recomm-list {
  display: flex;
  overflow: auto;
  overflow-x: scroll;
  .recomm-card {
    max-width: 250px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.3);
    margin-right: 24px;
    margin-left: 4px;
    margin-bottom: 24px;
    cursor: pointer;
    .backdrop {
      width: 250px;
      height: 141px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgb(65, 65, 65);
      color: rgb(197, 197, 197);
      i {
        font-size: 42px;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .recomtext {
    justify-content: space-between;
    >div {
      margin: 8px;
    }
    .recomm-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
