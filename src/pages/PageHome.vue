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
      v-if="$store.state.main.kind1.length > 20"
      @load="onLoad($store.state.main.kind1.length + 10)"
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
import {date} from 'quasar'
import helpersMixin from '../utils/mixin'

export default {
  name: 'PageHome',
  mixins: [helpersMixin],

  data() {
    return {
      dialogReply: null
    }
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
  },
  created() {
    if (!this.$store.getters.disabled) {
      this.$router.push('/help')
      return
    }

    this.$store.dispatch('getAllPosts')
  }
}
</script>
