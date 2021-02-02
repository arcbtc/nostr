<template>
  <q-page>
    <center>
      <strong class="text-h6 q-pa-lg">Chat</strong>
    </center>
    <q-btn
      v-go-back.single
      flat
      color="white"
      icon="arrow_back"
      label="back"
      class="small-screen-only fixed-top-left"
    />
    <div class="row">
      <br />
      <br />

      <div
        class="q-pa-md q-pt-xl column row flex justify-end no-wrap"
        style="width: 100%; height: 100vh; overflow: hidden"
      >
        <q-chat-message
          v-for="message in messages"
          :key="message.id"
          :name="message.from.substring(0, 6) + '...'"
          :text="[message.text]"
          :avatar="$store.getters.avatar(message.from)"
          :sent="message.from === $store.state.myProfile.pubkey ? true : false"
          bg-color="primary"
        >
        </q-chat-message>
        <div class="bg-dark q-mb-lg">
          <q-toolbar>
            <q-toolbar-title>
              <q-form
                class="q-gutter-md"
                @submit="submitMessage"
                @reset="resetMessage"
              >
                <div class="row">
                  <div class="col-9">
                    <q-input
                      v-model="text"
                      filled
                      type="text"
                      hint="500 char message"
                    ></q-input>
                  </div>
                  <div class="col-3">
                    <q-btn
                      unelevated
                      class="q-ma-sm"
                      label="send"
                      type="submit"
                      color="primary"
                    />
                  </div>
                </div>
              </q-form>
            </q-toolbar-title>
          </q-toolbar>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import helpersMixin from '../utils/mixin'

export default {
  name: 'PageChat',
  mixins: [helpersMixin],

  data() {
    return {
      text: '',
      reload: 0 // a hack to recompute messages
    }
  },
  computed: {
    messages() {
      this.$store.state.chatUpdated // hack to recompute

      return (
        this.$q.localStorage.getItem(`messages.${this.$route.params.pubkey}`) ||
        []
      )
    }
  },
  methods: {
    async submitMessage() {
      await this.$store.dispatch('sendChatMessage', {
        pubkey: this.$route.params.pubkey,
        text: this.text
      })

      this.text = ''
      this.$store.commit('chatUpdated')
    },

    resetMessage() {
      this.text = ''
    }
  }
}
</script>
