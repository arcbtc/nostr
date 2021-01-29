<template>
  <q-page>
    <center>
      <strong class="text-h6 q-pa-lg fixed-top">Help</strong>
    </center>
    <br />
    <q-btn
      flat
      color="white"
      icon="arrow_back"
      label="back"
      class="small-screen-only fixed-top-left"
      v-go-back.single
    />

    <br />
    <strong>What is Nostr?</strong>
    <p>
      Nostr (Notes and other stuff relays), is an open-source protocol for
      sending data between users. Instead of using a centralised or P2P service,
      data is signed by a client and sent to a desired relay, where other users
      can follow that data via its public key.
    </p>
    <p>
      In this client example, small 240chars messages are sent through the Nostr
      network, but the Nostr protocol be used for lots of different types of
      information. Anyone is free to participate, by hosting relays or building
      clients!
    </p>
    <p>
      Private messages are made possible by a user using another users public
      key to encrypt the data before posting it on the relay.
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
