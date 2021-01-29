<template>
  <q-page>
    <center>
      <strong class="text-h6 q-pa-lg fixed-top">Settings</strong>
    </center>
    <q-btn
      v-go-back.single
      flat
      color="white"
      icon="arrow_back"
      label="back"
      class="small-screen-only fixed-top-left"
    />

    <br /><br />

    <div class="q-mx-auto" style="max-width: 400px">
      <q-form class="q-gutter-md" @submit="setProfile">
        <p>
          If your desired handle is available our relay will use open-timestamps
          to secure it to your public key, and share it with other relays.
        </p>
        <q-input
          v-model="handle"
          filled
          type="text"
          hint="Desired handle (3-10 chars)"
          lazy-rules
          :rules="[
            val => (val !== null && val !== '') || 'Between 3 - 10 chars'
          ]"
        >
          <template #before>
            <q-icon name="alternate_email" />
          </template>
        </q-input>
        <q-input
          v-model="about"
          filled
          type="text"
          hint="About (in 150 chars)"
          maxlength="150"
        />
        <q-input
          v-model="imagetemp"
          filled
          type="text"
          hint="Profile picture (imgur url)"
          maxlength="150"
        />
        <q-btn
          class="float-right"
          unelevated
          label="Submit"
          type="submit"
          color="primary"
        />
        <br />
      </q-form>
      <br /><br />
      <q-separator />
      <br /><br />
      <q-form class="q-gutter-md" @submit="relayAdd">
        <q-input
          v-model="relay"
          filled
          type="textarea"
          autogrow
          hint="Add a relay"
        />

        <div>
          <q-btn
            class="float-right"
            unelevated
            label="Add"
            type="submit"
            color="primary"
          />
        </div>
      </q-form>
      <br /><br />
      <q-separator />
      <br /><br />
      <q-form class="q-gutter-md" @submit="relayRem">
        <q-select
          v-model="relay"
          filled
          multiple
          :options="$store.state.main.myProfile.relays"
          label="Remove relay(s)"
          style="width: 250px"
        />

        <div>
          <q-btn
            class="float-right"
            unelevated
            label="Remove"
            type="submit"
            color="primary"
          />
        </div>
      </q-form>
      <br /><br />
      <q-separator />
      <br /><br />
      <q-btn
        unelevated
        label="Delete Local Storage"
        color="negative"
        @click="deletels"
      />
    </div>
  </q-page>
</template>

<script>
import helpersMixin from '../utils/mixin'

export default {
  name: 'PageSettings',
  mixins: [helpersMixin],
  data() {
    return {
      relay: '',
      imagetemp: '',
      handle: '',
      about: ''
    }
  },
  created() {
    if (this.$store.getters.disabled) {
      this.$router.push('/help')
    }
  },
  methods: {
    setProfile() {
      this.$store.dispatch('saveMeta', {
        image: this.imagetemp,
        handle: this.handle,
        about: this.about
      })
    },
    relayAdd() {
      this.$store.dispatch('relayPush', this.relay)
      this.relay = ''
    },
    relayRem(relay) {
      this.$store.dispatch('relayRemove', this.relay)
      this.relay = ''
    },
    deletels() {
      this.$q.localStorage.clear()
      window.location.reload()
    }
  }
}
</script>
