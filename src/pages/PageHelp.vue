<template>
  <q-page>
    <center>
      <strong class="text-h6 q-pa-lg fixed-top">Help</strong>
    </center>
    <br />
    <q-btn
      v-go-back.single
      flat
      color="white"
      icon="arrow_back"
      label="back"
      class="small-screen-only fixed-top-left"
    />
    <br /><br />

    <strong>What is Nostr (Notes and other stuff relays)?</strong><br /><br />
    <p>
      Nostr is a decentralised collection of relays passing data between
      clients. Anyone can run a client or relay. This particular 240char limited
      client is just one way to send data through Nostr.
    </p>
    <center>
      <img class="q-px-auto" src="https://i.imgur.com/R3dQpk0.png" />
      <br />
    </center>

    <p>
      Nostr uses public key cryptography. Posts are signed with your private key
      and people can follow your posts using your public key. Direct messages in
      this client are encrypted before being sent through nostr network.
    </p>
    <p>
      <a href="https://github.com/fiatjaf/nostr" target="_blank"
        >Learn more about the Nostr protocol</a
      >
    </p>
    <center>
      <q-btn
        v-if="!$q.localStorage.getItem('pubkey')"
        dense
        flat
        class="small-screen-only q-pa-lg"
        color="primary"
        size="md"
        label="Generate or Restore User Account"
        @click="dialogGenerate = true"
      ></q-btn>
    </center>

    <q-dialog v-model="dialogGenerate" position="top">
      <Generate />
    </q-dialog>
  </q-page>
</template>

<script>
import helpersMixin from '../utils/mixin'

export default {
  name: 'PageHelp',
  mixins: [helpersMixin],

  data() {
    return {
      dialogGenerate: false
    }
  }
}
</script>
