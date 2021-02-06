<template>
  <q-page>
    <center>
      <strong class="text-h6 q-pa-lg">Settings</strong>
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

    <div class="q-mx-auto q-px-md">
      <q-form class="q-gutter-md" @submit="setProfile">
        <p>
          If your desired handle is available our relay will use open-timestamps
          to secure it to your public key, and share the proof with other
          relays.
        </p>
        <q-input
          v-model="handle"
          filled
          disable
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
          disable
          v-model="about"
          filled
          type="text"
          hint="About (in 150 chars)"
          maxlength="150"
        />
        <q-input
          disable
          v-model="imagetemp"
          filled
          type="text"
          hint="Profile picture (imgur url)"
          maxlength="150"
        />
        <q-btn
          disable
          class="float-right"
          unelevated
          label="Submit"
          type="submit"
          color="primary"
        />
        <br />
        <q-tooltip> Coming soon </q-tooltip>
      </q-form>
      <br /><br />
      <q-separator />
      <br /><br />
      <q-form class="q-gutter-md" @submit="relayAdd">
        <q-input
          v-model="relaya"
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
          v-model="relayr"
          filled
          :options="$store.state.myProfile.relays"
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
    const {imagetemp, handle, about} = this.$store.state.myProfile

    return {
      imagetemp,
      handle,
      about,
      relayr: '',
      relaya: ''
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
      this.$store.dispatch('relayPush', this.relaya)
      this.relaya = ''
    },
    relayRem() {
      this.$store.dispatch('relayRemove', this.relayr)
      this.relayr = ''
    },
    deletels() {
      this.$q.localStorage.clear()
      window.location.reload()
    }
  }
}
</script>
