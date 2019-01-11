<template>
  <div class="modal">
    <div class="modal-box">
      <div class="header">
        Konfirmasi
      </div>
      <div class="content">
        Beli film "{{ movieData.original_title }}" seharga Rp{{ moviePrice(movieData.vote_average).toLocaleString('id-ID') }}?
      </div>
      <div class="actions right">
        <div @click="closeModal()" class="button">Batal</div>
        <div @click="buy(movieData)" class="button primary">ya</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import payment from '../helpers/payment'
export default {
  name: 'ModalBuy',
  props: {
    show: Boolean,
    movieData: Object
  },
  data () {
    return {

    }
  },
  methods: {
    ...mapActions([
      'buyMovie'
    ]),
    closeModal () {
      this.$emit('close')
    },
    buy (movieData) {
      this.buyMovie(movieData)
      this.closeModal()
    }
  },
  created () {
    this.moviePrice = payment.moviePrice
  }
}
</script>

<style lang="less">
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.6); /* Black w/ opacity */
}
.modal-box {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  border: 1px solid #888;
  width: 500px; /* Could be more or less, depending on screen size */
  .header {
    background-color: #f4f4f4;
    border-bottom: 1px solid #d9d9d9;
    padding: 24px;
    font-size: 14pt;
    font-weight: bold;
  }
  .content {
    padding: 24px;
  }
  .actions {
    display: flex;
    padding: 12px 12px;
    >* {
      margin: 0 12px;
    }
    &.right {
      justify-content: flex-end;
    }
  }
}
</style>
