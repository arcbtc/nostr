<template>
  <q-card class="my-card q-mt-md" flat style="border: none; width: 90%">
    <q-card-section class="no-shadow" vertical>
      <q-card-section class="no-shadow" horizontal>
        <q-card-section class="no-shadow q-pb-none">
          <q-avatar class="no-shadow">
            <img :src="$store.getters.avatar(post.pubkey)" />
          </q-avatar>
        </q-card-section>

        <q-separator vertical style="display: none" />

        <q-card-section class="col no-shadow q-pb-none">
          <q-item-label
            >{{ $store.getters.handle(post.pubkey) }}
            <small style="color: grey">{{ post.created_at | niceDate }}</small>
          </q-item-label>
          {{ post.content }}
          <div></div>
        </q-card-section>
      </q-card-section>

      <q-card-section class="no-shadow q-pa-none q-pl-xl">
        <div class="row" style="width: 100%">
          <q-form
            style="width: 100%"
            class="q-gutter-md"
            @submit="sendReply(replytext, [['e', post.id]])"
            ><q-tooltip> Coming soon </q-tooltip>
            <q-input
              disable
              v-model="replytext"
              dense
              style="font-size: 20px"
              autogrow
              maxlength="280"
            >
            </q-input>

            <div class="float-right">
              <q-btn
                disable
                v-if="replytext.length < 280"
                class="float-left q-mr-md"
                round
                unelevated
                color="primary"
                icon="insert_emoticon"
                size="sm"
              >
                <q-popup-proxy>
                  <q-btn
                    v-for="emoji in emojis1"
                    :key="emoji.item"
                    flat
                    rounded
                    unelevated
                    dense
                    @click="replytext = replytext + emoji.item"
                    >{{ emoji.item }}</q-btn
                  >
                  <br />
                  <q-btn
                    v-for="emoji in emojis2"
                    :key="emoji.item"
                    flat
                    rounded
                    unelevated
                    dense
                    @click="replytext = replytext + emoji.item"
                    >{{ emoji.item }}</q-btn
                  >
                </q-popup-proxy>
              </q-btn>
              <q-btn
                v-else
                disable
                class="float-left q-mr-md"
                round
                unelevated
                color="primary"
                icon="insert_emoticon"
                size="sm"
              />

              <q-btn
                disable
                label="Reply"
                rounded
                unelevated
                type="submit"
                class="float-right"
                color="primary"
              />
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
import helpersMixin from '../utils/mixin'

export default {
  mixins: [helpersMixin],

  props: ['post'],
  data() {
    return {
      publishtext: '',
      replytext: ''
    }
  },
  methods: {
    sendReply() {
      console.log(this.post.id)
      this.$store.dispatch('sendPost', {
        message: this.replytext,
        tags: [['e', this.post.id]]
      })
      this.replytext = ''
    }
  }
}
</script>
