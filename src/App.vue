<template>
  <div id="app">
    <div id="nav">
      <div class="logo" @click="$router.push('/')">TokoFlix</div>
      <div class="menu">
        <div>
          Saldo <span style="color: #4FA149; font-weight: bold;">Rp{{$store.state.balance.toLocaleString('id-ID')}}</span>
        </div>
      </div>
    </div>
    <router-view/>
    <div id="footer">
      &copy; 2019 TokoFlix
    </div>
  </div>
</template>

<script>
import '@/assets/style/reset.css'
import '@/assets/style/movie.less'
export default {}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  // text-align: center;
  padding: 12px 24px;
  background-color: #f4f4f4;
  border-bottom: 1px solid #d9d9d9;
  // overflow: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo {
    color: #4FA149;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
  }
}
#footer {
  height: 50px;
  margin-top: 36px;
  background-color: #2c3e50;
  color: white;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
