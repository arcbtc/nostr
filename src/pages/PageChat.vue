<template>
  <q-page>
    <center>
      <strong class="text-h6 q-pa-lg fixed-top">Chat</strong>
    </center>
    <q-btn
      flat
      color="white"
      icon="arrow_back"
      label="back"
      class="small-screen-only fixed-top-left"
      v-go-back.single
    />
    <div class="row">
      <br />
      <br />
      <br />
      <div class="q-pa-md q-pt-xl column row justify-end" style="width: 100%">
        <q-chat-message
          v-for="message in messages"
          :avatar="avatarMake($store.state.main.myProfile.pubkey)"
          :key="[message.text]"
          :name="message.from"
          :text="[message.text]"
          :sent="message.from === 'me' ? true : false"
          bg-color="primary"
        />
      </div>
      <q-footer class="bg-dark q-mb-lg">
        <q-toolbar>
          <q-toolbar-title>
            <div class="q-pa-md" style="max-width: 400px">
              <q-form
                @submit="submitMessage"
                @reset="resetMessage"
                class="q-gutter-md"
              >
                <div class="row">
                  <div class="col-9">
                    <q-input
                      filled
                      type="text"
                      v-model="text"
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
            </div>
          </q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </div>
  </q-page>
</template>

<script>
import helpersMixin from '../utils/mixin'

export default {
  name: 'PageCjhat',
  mixins: [helpersMixin],

  data() {
    return {
      text: '',
      reload: 0 // a hack to recompute messages
    }
  },
  computed: {
    messages() {
      this.reload // hack to recompute

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
      this.reload++ // hack, see above
    },

    resetMessage() {
      this.text = ''
    }
  },
  created() {
    if (this.$store.getters.disabled) {
      this.$router.push('/help')
      return
    }
  }
}
</script>
