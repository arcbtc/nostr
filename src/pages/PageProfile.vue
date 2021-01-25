<template>
  <q-page>
    <q-btn
      flat
      color="white"
      icon="arrow_back"
      label="back"
      class="small-screen-only fixed-top-left q-ma-xs"
      v-go-back.single
    />

    <center><strong class="text-h6 q-ma-sm fixed-top">Profile</strong></center>
    <br />
    <br />

    <div class="row">
      <div class="col-2">
        <q-avatar size="50px" round>
          <img round :src="avatarMake($route.params.pubkey)" />
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
        @click="unFollow($route.params.pubkey)"
        color="red"
        flat
        icon="cancel"
        size="sm"
      />
      <q-btn
        v-if="!isFollowing"
        class="float-right q-mr-xs"
        round
        unelevated
        @click="addPubFollow($route.params.pubkey)"
        color="primary"
        flat
        icon="add_circle"
        size="sm"
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

    <q-card
      v-for="post in profilePosts"
      v-if="post.pubkey === $route.params.pubkey"
      :key="post.id"
      class="my-card"
      flat
      style="border: none"
    >
      <q-card-section class="no-shadow" horizontal>
        <q-card-section class="no-shadow">
          <q-avatar class="no-shadow">
            <img :src="avatarMake(post.pubkey)" />
          </q-avatar>
        </q-card-section>

        <q-separator vertical style="display: none" />

        <q-card-section class="col no-shadow">
          <q-card-section class="q-pa-none" @click="dialogReply = post">
            <q-item-label
              >{{ post.pubkey | handler }}
              <small style="color: grey">{{
                post.created_at | niceDate
              }}</small></q-item-label
            >
            {{ post.content }}
          </q-card-section>
          <div>
            <q-spinner-dots v-if="post.loading" color="primary" />
            <q-btn
              v-if="!post.retry && !post.loading"
              class="float-right q-mr-xs"
              round
              unelevated
              color="primary"
              flat
              icon="chat_bubble_outline"
              @click="dialogReply = post"
              size="sm"
            />

            <q-btn
              v-if="post.retry"
              class="float-right q-mr-xs"
              round
              unelevated
              color="pink"
              flat
              @click="postAgain(post)"
              icon="settings_backup_restore"
              size="sm"
            />
            <q-btn
              v-if="post.retry"
              class="float-right q-mr-xs"
              round
              unelevated
              color="pink"
              flat
              @click="deletePost(post)"
              icon="cancel"
              size="sm"
            />
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
    <q-dialog v-model="dialogReply" position="top">
      <Reply :post="dialogReply" />
    </q-dialog>
    <q-infinite-scroll
      v-if="posts.length > 20"
      @load="onLoad(posts.length + 10)"
      :offset="250"
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
import {date} from 'quasar'
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
      for (var i = 0; i < this.$store.state.main.theirProfile.length; i++) {
        if (
          this.$route.params.pubkey ===
            this.$store.state.main.theirProfile[i].pubkey &&
          this.$store.state.main.myProfile.pubkey !== pubKey
        ) {
          return true
        }
      }

      return false
    }
  },

  methods: {
    unFollow() {
      store.dispatch('stopFollowing', this.$route.params.pubkey)
      this.$router.push('/')
    },

    addPubFollow() {
      store.dispatch('startFollowing', this.$route.params.pubkey)
    }
  },

  async created() {
    if (this.$store.getters.disabled) {
      this.$router.push('/help')
      return
    }

    await this.$store.dispatch('getRelayPosts', {
      limit: 20,
      offset: 0,
      pubkey: this.$router.params.pubkey
    })

    var posts = []
    for (var i = 0; i < this.$store.state.main.kind1.length; i++) {
      if (post[i].pubkey === this.$route.params.pubkey) {
        posts.push(this.$store.state.main.kind1[i])
      }
    }
    this.profilePosts = posts
  }
}
</script>
