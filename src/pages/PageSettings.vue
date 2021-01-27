<template>
  <q-page>
    <center>
      <strong class="text-h6 q-pa-lg fixed-top">Settings</strong>
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

    <div class="q-mx-auto" style="max-width: 400px">
      <q-form @submit="setProfile" class="q-gutter-md">
        <p>
          If your desired handle is available our relay will use open-timestamps
          to secure it to your public key, and share it with other relays.
        </p>
        <q-input
          filled
          type="text"
          v-model="handle"
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
          filled
          type="text"
          v-model="about"
          hint="About (in 150 chars)"
          maxlength="150"
        />
        <q-input
          filled
          type="text"
          v-model="imagetemp"
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
      <q-form @submit="relayAdd" class="q-gutter-md">
        <q-input
          filled
          type="textarea"
          v-model="relay"
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
      <q-form @submit="relayRem" class="q-gutter-md">
        <q-select
          filled
          v-model="relay"
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
        @click="deletels"
        color="negative"
      />
    </div>
  </q-page>
</template>

<script>
import helpersMixin from '../utils/mixin'

export default {
  name: 'PageSettings',
  data() {
    return {
      relay: '',
      imagetemp: '',
      handle: '',
      about: ''
    }
  },
  mixins: [helpersMixin],
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
  },
  created() {
    if (this.$store.getters.disabled) {
      this.$router.push('/help')
    }
  }
}
</script>
