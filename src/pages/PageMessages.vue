<template>
  <q-page>
    <center>
      <strong class="text-h6 q-pa-lg fixed-top">Encrypted Messages</strong>
    </center>
    <q-btn
      flat
      color="white"
      icon="arrow_back"
      label="back"
      class="small-screen-only fixed-top-left"
      v-go-back.single
    />

    <br /><br />

    <q-list>
      <q-item
        clickable
        v-ripple
        v-for="followed in following"
        v-if="
          followed.pubkey !=
          JSON.parse($q.localStorage.getItem('myProfile')).pubkey
        "
        :key="followed.id"
        :to="'/chat/' + followed.pubkey"
      >
        <q-item-section avatar>
          <q-avatar round>
            <img :src="avatarMake(followed.pubkey)" />
          </q-avatar>
        </q-item-section>

        <q-item-section>{{
          followed.pubkey.substring(0, 10) + '...'
        }}</q-item-section>
      </q-item>
    </q-list>

    <q-footer class="bg-dark q-mb-lg">
      <q-form
        @submit="MessageonSubmit"
        style="max-width: 400px"
        class="q-gutter-md"
      >
        <p>All private messages are end-to-end encrypted.</p>

        <div class="row">
          <div class="col-10">
            <q-input
              filled
              type="text"
              v-model="newMessage"
              hint="Public key"
            ></q-input>
          </div>
          <div class="col-2">
            <q-btn
              unelevated
              class="q-ma-sm"
              label="Start"
              type="submit"
              color="primary"
            />
          </div>
        </div>
      </q-form>
    </q-footer>
  </q-page>
</template>

<script>
import helpersMixin from '../utils/mixin'

export default {
  name: 'PageMessages',
  mixins: [helpersMixin],
  created: function () {
    if (!this.$store.getters.disabled) {
      this.$router.push('/help')
      return
    }

    this.$store.dispatch('getAllPosts')
  }
}
</script>
