<template>
  <q-page>
    <h6 class="q-ma-none">Settings</h6>
    <div class="q-pa-md" style="max-width: 400px">
      <q-form @submit="sendMeta" class="q-gutter-md">
        <p>
          If your desired handle is available our relay will use open-timestamps
          to secure it to your public key, and share it with other relays.
        </p>
        <q-input
          filled
          type="text"
          v-model="newpost.handle"
          hint="Disired handle (3-10 chars)"
          lazy-rules
          :rules="[
            val => (val !== null && val !== '') || 'Between 3 - 10 chars'
          ]"
        >
          <template v-slot:before>
            <q-icon name="alternate_email" />
          </template>
        </q-input>
        <q-input
          filled
          type="text"
          v-model="newpost.about"
          hint="About (in 150 chars)"
          maxlength="150"
        />
        <center>
          <div class="column" style="width: 200px" v-show="homeembedimage">
            <div class="col">
              <q-btn
                flat
                round
                color="red"
                icon="clear"
                size="sm"
                class="float-right"
                @click="discamerahome()"
              />
            </div>
            <div class="col-12">
              <img width="240" class="q-ma-sm" :src="newpost.imagetemp" />
            </div>
          </div>
        </center>
        <div class="column" v-show="activatevideohome == true">
          <div class="col-9 q-mx-auto">
            <video
              v-show="!imageCaptured"
              playsinline
              ref="video"
              style="width: 300px"
              autoplay
            />
            <canvas v-show="imageCaptured" ref="canvas" height="240" />
          </div>
          <div class="col-3 q-mx-auto">
            <q-btn
              flat
              class="float-right"
              rounded
              unelevated
              color="primary"
              icon="cancel"
              @click="discamerahome()"
              size="lg"
            />

            <q-btn
              flat
              class="float-right"
              rounded
              unelevated
              color="primary"
              icon="camera"
              @click="captureimage()"
              size="lg"
            />
            <q-btn
              v-show="imageCaptured"
              flat
              class="float-right"
              rounded
              unelevated
              color="primary"
              icon="check_circle"
              @click="photoverify()"
              size="lg"
            />
          </div>
        </div>
        <q-file
          ref="myFileInput"
          accept="image/*"
          @input="captureimageupload"
          style="display: none"
          v-model="imagefile"
          type="file"
          label="Standard"
        ></q-file>
        <div class="column" style="height: 80px">
          <div class="col">Profile picture:</div>
          <div class="col">
            <q-btn
              label="upload"
              class="float-left q-mr-md"
              unelevated
              color="primary"
              @click="getFile"
              icon="insert_photo"
              size="sm"
            />
            <q-btn
              label="Camera"
              class="float-left q-mr-md"
              unelevated
              color="primary"
              icon="camera_alt"
              @click="initcamerahome()"
              size="sm"
            />
          </div>
        </div>

        <div>
          <q-btn
            class="float-right"
            unelevated
            label="Submit"
            type="submit"
            color="primary"
          />
        </div>
      </q-form>
      <br /><br />
      <q-separator />
      <br /><br />
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input
          filled
          type="text"
          v-model="settings.follow"
          autogrow
          hint="Batch follow input seperated by spaces"
        />
        <q-input
          filled
          type="textarea"
          v-model="settings.relays"
          autogrow
          hint="Relays seperated by spaces"
        />

        <div>
          <q-btn
            class="float-right"
            unelevated
            label="Submit"
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
import {relayPool} from 'nostr-tools'

import {myHelpers} from '../boot/helpers.js'

export default {
  name: 'PageSettings',
  data() {
    return {
      publishtext: '',
      emojiOn: false,
      activatevideohome: false,
      imageCaptured: false,
      hasCamerasuport: true,
      homeembedimage: false,
      imagefile: '',
      name: null,
      age: null,
      newpost: {
        user: '',
        message: '',
        image: null,
        date: Date.now()
      },
      settings: {
        data: {}
      },
      accept: false
    }
  },
  mixins: [myHelpers],
  methods: {
    ProfileonSubmit() {
      if (this.accept !== true) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'You need to accept the license and terms first'
        })
      } else {
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
        })
      }
    },

    ProfileonReset() {
      this.name = null
      this.age = null
      this.accept = false
    },
    RelaysonSubmit() {
      if (this.accept !== true) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'You need to accept the license and terms first'
        })
      } else {
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
        })
      }
    },

    RelaysonReset() {
      this.name = null
      this.age = null
      this.accept = false
    },
    deletels() {
      this.$q.localStorage.clear()
      window.location.reload()
    },
    async sendMeta() {
      const pool = relayPool()

      pool.setPrivateKey(this.$q.localStorage.getItem('privkey'))
      var relays = JSON.parse(this.$q.localStorage.getItem('relays'))

      for (var i = 0; i < relays.length; i++) {
        console.log(relays[i])
        pool.addRelay(relays[i], {
          read: true,
          write: true
        })
      }

      pool.onEvent((event, context, relay) => {
        this.profile.avatar = this.newpost.imagetemp
        this.profile.about = this.newpost.about
        this.profile.name = this.newpost.name
      })
      var message = JSON.stringify({
        picture: this.newpost.imagetemp,
        name: this.newpost.name,
        about: this.newpost.about
      })
      console.log(this.newpost.imagetemp)
      this.$q.localStorage.set('profile', message)
      const timest = Math.floor(Date.now() / 1000)

      var eventObject = {
        pubkey: String(this.$q.localStorage.getItem('pubkey')),
        created_at: timest,
        kind: 0,
        tags: [],
        content: message
      }

      pool.publish(eventObject)
    }
  }
}
</script>
