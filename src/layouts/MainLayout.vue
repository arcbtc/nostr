<template>
  <q-layout>
    <q-dialog v-model="dialogPublish">
      <Publish />
    </q-dialog>

    <q-dialog v-model="dialogGenerate" position="top">
      <Generate />
    </q-dialog>

    <div class="flex-center column q-pa-md">
      <div class="row">
        <div
          id="parent"
          class="fit row wrap justify-center items-start content-start"
        >
          <div class="col-3 large-screen-only" style="overflow: auto">
            <q-card no-box-shadow class="q-px-sm">
              <div class="row justify-center">
                <img src="~/assets/nostr-logo.png" />
              </div>
              <q-list class="text-secondary">
                <q-item
                  v-if="$store.getters.disabled"
                  :disabled="$store.getters.disabled"
                >
                  <q-item-section avatar>
                    <q-icon name="home"></q-icon>
                  </q-item-section>

                  <q-item-section>Home</q-item-section>
                </q-item>
                <q-item
                  v-else
                  clickable
                  v-ripple
                  :active="$route.name === 'home'"
                  active-class="my-menu-link"
                  :to="'/'"
                >
                  <q-item-section avatar>
                    <q-icon name="home"></q-icon>
                  </q-item-section>

                  <q-item-section>Home</q-item-section>
                </q-item>

                <q-item
                  v-if="$store.getters.disabled"
                  :disabled="$store.getters.disabled"
                >
                  <q-item-section avatar>
                    <q-icon name="email"></q-icon>
                  </q-item-section>

                  <q-item-section>Messages</q-item-section>
                </q-item>
                <q-item
                  v-else
                  clickable
                  v-ripple
                  :active="$route.name === 'messages'"
                  active-class="my-menu-link"
                  :to="'/messages'"
                >
                  <q-item-section avatar>
                    <q-icon name="email"></q-icon>
                  </q-item-section>

                  <q-item-section>Messages</q-item-section>
                </q-item>

                <q-item
                  v-if="$store.getters.disabled"
                  :disabled="$store.getters.disabled"
                >
                  <q-item-section avatar>
                    <q-icon name="settings"></q-icon>
                  </q-item-section>

                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-item
                  v-else
                  clickable
                  v-ripple
                  :active="$route.name === 'settings'"
                  active-class="my-menu-link"
                  :to="'/settings'"
                >
                  <q-item-section avatar>
                    <q-icon name="settings"></q-icon>
                  </q-item-section>

                  <q-item-section>Settings</q-item-section>
                </q-item>

                <q-item
                  clickable
                  v-ripple
                  :active="$route.name === 'help'"
                  active-class="my-menu-link"
                  :to="'/help'"
                >
                  <q-item-section avatar>
                    <q-icon name="help"></q-icon>
                  </q-item-section>

                  <q-item-section>Help</q-item-section>
                </q-item>
                <br />
              </q-list>
              <q-btn
                v-if="!$store.getters.disabled"
                rounded
                unelevated
                style="width: 140px !important; height: 41px !important"
                color="primary"
                size="md"
                label="Publish"
                @click="dialogueStarted()"
              ></q-btn>
              <q-btn
                v-else
                rounded
                unelevated
                class="q-py-sm"
                color="primary"
                size="md"
                label="Generate or Restore User Account"
                @click="dialogGenerate = true"
              ></q-btn>
            </q-card>
          </div>

          <div class="col-6 large-screen-only">
            <q-card>
              <q-card-section>
                <q-page-container>
                  <router-view />
                </q-page-container>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 small-screen-only">
            <q-card>
              <q-card-section>
                <q-page-container>
                  <router-view />
                </q-page-container>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-3 large-screen-only">
            <q-card class="float-left no-shadow">
              <q-card-section>
                <q-input dense rounded outlined v-model="addPubKey">
                  <template v-slot:append>
                    <q-btn
                      round
                      dense
                      flat
                      icon="add"
                      :disabled="$store.getters.disabled"
                      @click="addPubFollow"
                    />
                  </template>
                </q-input>
              </q-card-section>
              <q-card-section v-if="$store.state.main.theirProfile.length">
                <h6 class="q-ma-none">Following</h6>
                <q-list>
                  <q-item
                    clickable
                    v-ripple
                    v-for="followed in $store.state.main.theirProfile"
                    v-if="followed.pubkey != $store.state.main.myProfile.pubkey"
                    @click="toProfile(followed.pubkey)"
                    :key="followed.pubkey"
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
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <q-footer bordered style="bottom: 0%; position: fixed" class="bg-white">
      <q-banner
        v-if="showInstallBanner"
        inline-actions
        dense
        class="bg-primary text-white"
      >
        <template v-slot:avatar>
          <q-avatar>
            <img src="/icons/favicon-16x16.png" />
          </q-avatar>
        </template>
        <b> INSTALL NOSTR?</b>

        <template v-slot:action>
          <q-btn
            flat
            @click="installApp()"
            dense
            class="q-px-sm"
            label="Yes"
          ></q-btn>
          <q-btn
            flat
            @click="showInstallBanner = false"
            dense
            class="q-px-sm"
            label="Later"
          ></q-btn>
          <q-btn
            flat
            @click="neverInstallApp()"
            dense
            class="q-px-sm"
            label="Never"
          ></q-btn>
        </template>
      </q-banner>
      <center>
        <q-tabs class="text-primary small-screen-only">
          <q-route-tab style="width: 20%" name="home" icon="home" to="/" />

          <q-route-tab
            style="width: 20%"
            name="messages"
            icon="email"
            to="/messages"
          />
          <q-route-tab
            style="width: 20%"
            name="settings"
            icon="settings"
            to="/settings"
          />
          <q-route-tab style="width: 20%" name="help" icon="help" to="/help" />
        </q-tabs>
      </center>
    </q-footer>
  </q-layout>
</template>
<script>
let deferredPrompt
import {copyToClipboard} from 'quasar'
import helpersMixin from '../utils/mixin'
export default {
  name: 'MainLayout',
  mixins: [helpersMixin],
  data() {
    return {
      showInstallBanner: null,
      dialogGenerate: false,
      dialogPublish: false,

      addPubKey: ''
    }
  },
  computed: {},
  methods: {
    installApp() {
      this.showInstallBanner = false
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt')
        } else {
          console.log('User dismissed the install prompt')
        }
      })
    },
    neverInstallApp() {
      this.showInstallBanner = false
      try {
        this.$q.localStorage.setItem('neverShowBanner', true)
      } catch (e) {
        console.log(e)
      }
    },
    copyToClip(text) {
      console.log('fffff')
      copyToClipboard(text)
        .then(() => {
          this.$q.notify({
            message: 'COPIED'
          })
        })
        .catch(() => {
          this.$q.notify({type: 'negative', message: 'FAILED'})
        })
    },
    addPubFollow() {
      this.$store.dispatch('startFollowing', this.addPubKey)
    }
  },
  mounted() {
    let value = this.$q.localStorage.getItem('neverShowBanner')
    if (!value) {
      window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault()
        deferredPrompt = e
        this.showInstallBanner = true
      })
    }
  },
  created: function () {
    if (this.$store.getters.disabled) {
      this.$router.push('/help')
      return
    }

    this.$store.dispatch('launch')
  }
}
</script>

<style lang="sass">
.my-menu-link
  color: primary
body.body--dark
    background: #1d2d2d
.small-screen-only
  @media (max-width: $breakpoint-xs-max)
    display: block
  @media (min-width: $breakpoint-sm-min)
    display: none
.large-screen-only
  @media (max-width: $breakpoint-xs-max)
    display: none
  @media (min-width: $breakpoint-sm-min)
    display: block
</style>
