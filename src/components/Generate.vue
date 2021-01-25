<template>
  <q-card class="q-pa-md q-pt-lg q-mt-md">
    <q-stepper v-model="step" vertical color="primary" animated>
      <q-step
        :name="1"
        title="Generate/Restore"
        icon="settings"
        :done="step > 1"
      >
        Nostr.org uses a word list of 12 words is used to create your keys, to
        restore either enter a word list or a Nostr private key.
        <q-input
          :loading="loading"
          v-model="recover"
          autogrow
          type="textarea"
          label="Word List/Private Key"
        ></q-input
        ><br />

        <q-btn
          @click="createKeys"
          color="primary"
          label="Generate"
          class="q-mr-md"
        />
        <q-btn
          @click="createKeys"
          color="primary"
          label="Restore"
          class="q-mr-md"
        />

        <q-btn
          v-if="privatekey"
          @click="step = 2"
          color="primary"
          label="Continue"
        />
      </q-step>

      <q-step :name="2" title="Your keys" icon="vpn_key" :done="step > 2">
        In this client you can restore from a word list but for other clients
        you will need to use your keys as well.<br /><br />
        Your private key is used to sign/publish posts.
        <br />
        <q-input
          v-model="privatekey"
          filled
          :type="isPwd ? 'password' : 'text'"
        >
          <template v-slot:prepend>
            <q-icon
              name="content_copy"
              class="cursor-pointer"
              @click="copyToClip(privatekey)"
            ></q-icon>
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            ></q-icon>
          </template>
        </q-input>
        <br />
        Your public key allows other people to read your posts, follow you, and
        send you private messages.
        <br />
        <q-input v-model="publickey" filled type="text">
          <template v-slot:prepend>
            <q-icon
              name="content_copy"
              class="cursor-pointer"
              @click="copyToClip(publickey)"
            ></q-icon>
          </template>
        </q-input>

        <q-stepper-navigation>
          <q-btn @click="step = 3" color="primary" label="Continue" />
          <q-btn
            flat
            @click="step = 1"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="3" title="Key storage" icon="lock">
        To publish your posts this client needs to sign messages with your
        private key. Choose how this client will access your private key.
        <template>
          <div class="q-pa-md q-gutter-sm">
            <div class="q-gutter-sm">
              <q-radio
                dense
                v-model="keystoreoption"
                val="local"
                label="Local Storage (Recommended)"
              /><br />
              <q-radio
                dense
                disable
                v-model="keystoreoption"
                val="url"
                label="URL (coming soon)"
              /><br />
              <q-radio
                dense
                disable
                v-model="keystoreoption"
                val="external"
                label="Hardware wallet (coming soon)"
              /><br />
            </div>
          </div>
        </template>
        <q-stepper-navigation>
          <q-btn color="primary" @click="finalGenerate" label="Finish" />
          <q-btn
            flat
            @click="step = 2"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </q-card>
</template>

<script>
import BigInteger from 'bigi'
import ecurve from 'ecurve'
import crypto from 'crypto'

import helpersMixin from '../utils/mixin'

const bip39 = require('bip39')
const bip32 = require('bip32')

const curve = ecurve.getCurveByName('secp256k1')
const G = curve.G

export default {
  mixins: [helpersMixin],

  data() {
    return {
      step: 1,
      loading: false,
      recover: '',
      privatekey: null,
      publickey: null,
      keystoreoption: null,
      isPwd: true
    }
  },
  methods: {
    async createKeys() {
      this.loading = true

      setTimeout(() => {
        if (this.recover.split(/ +/).length === 12) {
          // recover mnemonic
          let mnemonic = this.recover.split(/ +/).join(' ')
          let seed = bip39.mnemonicToSeedSync(mnemonic)
          let root = bip32.fromSeed(seed)
          this.privatekey = root.privateKey.toString('hex')

          this.recover = mnemonic
        } else if (/^[0-9a-e]{64}$/.exec(this.recover.toLowerCase())) {
          // recover private key
          this.privatekey = this.recover.toLowerCase()

          this.recover = this.privatekey
        } else {
          // generate a new seed
          let randomBytes = crypto.randomBytes(16)
          let mnemonic = bip39.entropyToMnemonic(randomBytes.toString('hex'))
          let seed = bip39.mnemonicToSeedSync(mnemonic)
          let root = bip32.fromSeed(seed)
          this.privatekey = root.privateKey.toString('hex')
          this.$q.notify({
            message: 'MAKE SURE YOU BACKUP YOUR WORD LIST'
          })

          this.recover = mnemonic
        }

        this.publickey = G.multiply(BigInteger.fromHex(this.privatekey))
          .getEncoded(true)
          .slice(1)
          .toString('hex')

        this.loading = false
      }, 1)
    },

    finalGenerate() {
      this.$store.dispatch('finalGenerate', {
        privatekey: this.privatekey,
        publickey: this.publickey,
        keystoreoption: this.keystoreoption
      })

      if (this.keystoreoption === 'external') {
        this.$router.push('/?pub=' + this.publickey + '&prv=' + this.privatekey)
      } else {
        this.$router.push('/')
      }
    }
  }
}
</script>
