<template>
  <div class="container">
    <nav>
      <ul>
        <li class="text-lowercase" id="login"><Link :path="'/login'">/{{ $t('menu.login') }}</Link></li>
        <li class="text-lowercase ml-2" id="register"><Link :path="'/register'">/{{ $t('menu.register') }}</Link></li>
      </ul>
    </nav>
    <main>
      <h1>{{ product.name }}<span class="cursor">|</span></h1>
      <h3>{{ product.slogan }}</h3>
    </main>
  </div>
</template>

<script>
import Link from "@/components/common/Link.vue";
import { mapState } from 'vuex';
export default {
  components: {
    Link
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapState('app', ['product']),
  },
}
</script>
<style scoped lang="sass">
.landing-color
  color: #00aa00

body
  font-family: "Roboto", sans-serif
  background-color: #333
  color: #ccc
  font-size: 18px
  line-height: 1.6

.container
  max-width: 600px
  margin: auto
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  min-height: 100vh

ul
  list-style-type: none

nav ul
  display: flex
  justify-content: space-around
  align-items: center

nav ul li
  color: #00aa00
  cursor: pointer

h1
  color: #00aa00
  font-size: 50px
  letter-spacing: 1px
  margin-bottom: 20px

h2
  color: #00aa00

h3
  margin-bottom: 10px

a
  color: #00aa00 !important
  text-decoration: none

.hidden
  display: none

p
  margin: 20px 0

.wb-body
  background-color: #111
  padding: 20px

.cursor
  font-weight: 700
  animation: 1s blink step-end infinite

@keyframes blink
  from,to
    color: transparent
  50%
    color: #00aa00
</style>