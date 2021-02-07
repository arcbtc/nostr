<template>
  <q-page>
    <q-btn
      v-go-back.single
      flat
      color="white"
      icon="arrow_back"
      label="back"
      class="small-screen-only fixed-top-left q-ma-xs"
    />

    <center><strong class="text-h6 q-ma-sm">Profile</strong></center>
    <br />
    <br />

    <div class="row">
      <div class="col-2">
        <q-avatar size="50px" round>
          <img round :src="$store.getters.avatar($route.params.pubkey)" />
        </q-avatar>
      </div>
      <div class="col-8">
        <p
          class="text-caption"
          style="width: 100%; word-break: break-all !important"
        >
          {{ $route.params.pubkey }}
        </p>
      </div>
    </div>

    <div class="q-pb-xl">
      <q-btn
        v-if="isFollowing"
        class="float-right q-mr-xs"
        round
        unelevated
        color="red"
        flat
        icon="cancel"
        size="sm"
        @click="unFollow($route.params.pubkey)"
      />
      <q-btn
        v-if="!isFollowing"
        class="float-right q-mr-xs"
        round
        unelevated
        color="primary"
        flat
        icon="add_circle"
        size="sm"
        @click="addPubFollow($route.params.pubkey)"
      />

      <q-btn
        class="float-right q-mr-xs"
        round
        flat
        :to="'/chat/' + $route.params.pubkey"
        unelevated
        color="primary"
        icon="message"
        size="sm"
      />
    </div>

    <Post
      v-for="post in $store.state.kind1"
      v-if="post.pubkey === $route.params.pubkey"
      :key="post.id"
      :post="post"
    />

    <q-dialog v-model="dialogReply" position="top">
      <Reply :post="dialogReply" />
    </q-dialog>
    <q-infinite-scroll
      v-if="profilePosts.length > 20"
      :offset="250"
      @load="onLoad(profilePosts.length + 10)"
    >
      <template #loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </q-page>
</template>

<script>
import 'md-gum-polyfill'
import helpersMixin from '../utils/mixin'

export default {
  name: 'PageHome',
  mixins: [helpersMixin],

  data() {
    return {
      profilePosts: [],
      dialogReply: null
    }
  },

  computed: {
    isFollowing() {
      return this.$route.params.pubkey in this.$store.state.theirProfile
    }
  },

  async created() {
    await this.$store.dispatch('getRelayPosts', {
      limit: 20,
      offset: 0,
      pubkey: this.$route.params.pubkey
    })

    var posts = []
    for (let i = 0; i < this.$store.state.kind1.length; i++) {
      let post = this.$store.state.kind1[i]
      if (post[i].pubkey === this.$route.params.pubkey) {
        posts.push(this.$store.state.kind1[i])
      }
    }
    this.profilePosts = posts
  },

  methods: {
    unFollow() {
      this.$store.dispatch('stopFollowing', this.$route.params.pubkey)
      this.$router.push('/')
    },

    addPubFollow() {
      this.$store.dispatch('startFollowing', this.$route.params.pubkey)
    }
  }
}
</script>
