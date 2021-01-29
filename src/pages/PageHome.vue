<template>
  <q-page>
    <Publish v-if="!$store.getters.disabled" />
    <q-card
      v-for="post in $store.state.main.kind1"
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
              size="sm"
              @click="dialogReply = post"
            />

            <q-btn
              v-if="post.retry"
              class="float-right q-mr-xs"
              round
              unelevated
              color="pink"
              flat
              icon="settings_backup_restore"
              size="sm"
              @click="postAgain(post)"
            />
            <q-btn
              v-if="post.retry"
              class="float-right q-mr-xs"
              round
              unelevated
              color="pink"
              flat
              icon="cancel"
              size="sm"
              @click="deletePost(post)"
            />
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
    <q-dialog v-model="dialogReply" position="top">
      <Reply :post="dialogReply" />
    </q-dialog>
    <q-infinite-scroll
      v-if="$store.state.main.kind1.length > 20"
      :offset="250"
      @load="onLoad($store.state.main.kind1.length + 10)"
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
    },

    postAgain(post) {
      this.$store.dispatch('postAgain', post)
    },

    deletePost(post) {
      this.$store.dispatch('deletePost', post)
    }
  }
}
</script>
