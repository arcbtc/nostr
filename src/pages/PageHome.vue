<template>
  <q-page>
    <Publish v-if="!$store.getters.disabled" />
    <Post v-for="post in $store.state.kind1" :key="post.id" :post="post" />
  </q-page>
</template>

<script>
import helpersMixin from '../utils/mixin'

export default {
  name: 'PageHome',
  mixins: [helpersMixin],

  data() {
    return {}
  },
  created() {
    this.$store.dispatch('getAllPosts')
  },
  methods: {
    onLoad(index) {
      setTimeout(() => {
        if (this.$store.state.kind1) {
          this.$store.dispatch('getRelayPosts', {
            limit: index,
            offset: this.$store.state.kind1.length
          })
        }
      }, 2000)
    }
  }
}
</script>
