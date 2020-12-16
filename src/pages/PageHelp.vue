<template>
  <q-page>
   <h6 class="q-ma-none">Help</h6>
   <br/>
    <strong>What is Nostr?</strong>
   <p>Nostr (Notes and other stuff relays), is an open-source protocol for sending data between users. Instead of using a centralised or P2P service, data is signed by a client and sent to a desired relay, where other users can follow that data via its public key.</p>
   <p>In this client example, small 240chars messages are sent through the Nostr network, but the Nostr protocol be used for lots of different types of information. Anyone is free to participate, by hosting relays or building clients!</p>
   <p>Private messages are made possible by a user using another users public key to encrypt the data before posting it on the relay.</p>

  </q-page>
</template>

<script>
export default {
  name: 'PageHelp'
}
</script>