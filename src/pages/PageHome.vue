<template>
  <q-page>
    <Publish v-if="!$store.getters.disabled" />
    <Post v-for="post in $store.state.main.kind1" :key="post.id" :post="post" />
    <q-dialog v-model="dialogReply" position="top">
      <Reply :post="dialogReply" />
    </q-dialog>
    <q-infinite-scroll
      v-if="$store.state.main.kind1.length > 20"
      :offset="250"
      @load="onLoad($store.state.main.kind1.length + 10)"
    >
      <div v-if="post.loading" class="row justify-center q-my-md">
        <q-spinner-dots color="primary" size="40px" />
      </div>
    </q-infinite-scroll>
  </q-page>
</template>

<script>
import helpersMixin from '../utils/mixin'

export default {
  name: 'PageHome',
  mixins: [helpersMixin],

  data() {
    return {
      dialogReply: null
    }
  },
  created() {
    this.$store.dispatch('getAllPosts')
  },
  methods: {
    onLoad(index) {
      setTimeout(() => {
        if (this.$store.state.main.kind1) {
          this.$store.dispatch('getRelayPosts', {
            limit: index,
            offset: this.$store.state.main.kind1.length
          })
        }
      }, 2000)
    }
  }
}
</script>
