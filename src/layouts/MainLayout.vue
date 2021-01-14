<template>
  <q-layout>
    <q-dialog v-model="dialogpublish">
      <q-card style="width:500px" class="q-pa-md q-pt-lg">
        <q-form
          style="width:100%;"
          @submit="PublishonSubmit"
          class="q-gutter-md"
        >
          <center>
            <div class="column" style="width:200px" v-show="homeembedimage">
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
                <img width="200" class="q-ma-sm" :src="newpost.imagetemp" />
              </div>
            </div>
          </center>
          <q-input
            style="font-size: 20px;"
            v-model="publishtext"
            autogrow
            label="Say something"
            maxlength="280"
          >
            <template v-slot:before>
              <q-avatar>
                <img src="http://identicon.net/img/identicon.png" />
              </q-avatar>
            </template>
          </q-input>

          <div class="column" v-show="activatevideohome == true">
            <div class="col-9 q-mx-auto">
              <video
                v-show="!imageCaptured"
                playsinline
                ref="video"
                style="width:300px;"
                autoplay
              />
              <canvas v-show="imageCaptured" ref="canvas" height="240" />
            </div>
            <div class="col-3 q-mx-auto">
              <q-btn
                flat
                class="float-right "
                rounded
                unelevated
                color="primary"
                icon="cancel"
                @click="discamerahome()"
                size="lg"
              />

              <q-btn
                flat
                class="float-right "
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
                class="float-right "
                rounded
                unelevated
                color="primary"
                icon="check_circle"
                @click="photoverify()"
                size="lg"
              />
            </div>
          </div>

          <div class="float-right">
            <q-btn
              v-if="publishtext.length < 280"
              class="float-left q-mr-md"
              round
              unelevated
              color="primary"
              icon="insert_emoticon"
              size="sm"
            >
              <q-popup-proxy>
                <q-btn
                  v-for="emoji in emojis1"
                  :key="emoji.item"
                  @click="publishtext = publishtext + emoji.item"
                  flat
                  rounded
                  unelevated
                  dense
                  >{{ emoji.item }}</q-btn
                >
                <br />
                <q-btn
                  v-for="emoji in emojis2"
                  :key="emoji.item"
                  @click="publishtext = publishtext + emoji.item"
                  flat
                  rounded
                  unelevated
                  dense
                  >{{ emoji.item }}</q-btn
                >
              </q-popup-proxy>
            </q-btn>
            <q-btn
              v-else
              disable
              class="float-left q-mr-md"
              round
              unelevated
              color="primary"
              icon="insert_emoticon"
              size="sm"
            />

            <q-file
              ref="myFileInput"
              accept="image/*"
              @input="captureimageupload"
              style="display:none"
              v-model="imagefile"
              type="file"
              label="Standard"
            ></q-file>

            <q-btn
              class="float-left q-mr-md"
              round
              unelevated
              color="primary"
              @click="getFile"
              icon="insert_photo"
              size="sm"
            />
            <q-btn
              class="float-left q-mr-md"
              round
              unelevated
              color="primary"
              icon="camera_alt"
              @click="initcamerahome()"
              size="sm"
            />
            <q-btn
              label="Publish"
              rounded
              unelevated
              @click="postEvent('', publishtext)"
              class="float-right"
              color="primary"
            />
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialoggenerate">
      <q-card class="q-pa-md q-pt-lg">
        <q-stepper v-model="step" vertical color="primary" animated>
          <q-step
            :name="1"
            title="Generate/Restore"
            icon="settings"
            :done="step > 1"
          >
            Nostr.org uses a word list of 12 words is used to create your keys,
            to restore either enter a word list or a Nostr private key.
            <q-input
              :loading="user.loading"
              v-model="user.passphrase"
              autogrow
              type="textarea"
              label="Word List/Private Key"
            ></q-input
            ><br />

            <q-btn
              @click="createKeys()"
              color="primary"
              label="Generate"
              class="q-mr-md"
            />
            <q-btn
              @click="step = 2"
              color="primary"
              label="Restore"
              class="q-mr-md"
            />

            <q-btn
              v-if="passphrasegenerated"
              @click="step = 2"
              color="primary"
              label="Continue"
            />
          </q-step>

          <q-step :name="2" title="Your keys" icon="vpn_key" :done="step > 2">
            In this client you can restore from a word list but for other
            clients you will need to use your keys as well.<br /><br />
            Your private key is used to sign/publish posts.
            <br />
            <q-input
              v-model="user.privatekey"
              filled
              :type="user.isPwd ? 'password' : 'text'"
            >
              <template v-slot:prepend>
                <q-icon
                  name="content_copy"
                  class="cursor-pointer"
                  @click="copytoclip(user.privatekey)"
                ></q-icon>
              </template>
              <template v-slot:append>
                <q-icon
                  :name="user.isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="user.isPwd = !user.isPwd"
                ></q-icon>
              </template>
            </q-input>
            <br />
            Your public key allows other people to read your posts, follow you,
            and send you private messages.
            <br />
            <q-input v-model="user.publickey" filled type="text">
              <template v-slot:prepend>
                <q-icon
                  name="content_copy"
                  class="cursor-pointer"
                  @click="copytoclip(user.publickey)"
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
                    v-model="user.keystoreoption"
                    val="local"
                    label="Local Storage (Recommended)"
                  /><br />
                  <q-radio
                    dense
                    v-model="user.keystoreoption"
                    val="url"
                    label="URL (Bookmark to save)"
                  /><br />
                  <q-radio
                    dense
                    v-model="user.keystoreoption"
                    val="external"
                    label="Externally (Highly experimental)"
                  /><br />
                </div>
              </div>
            </template>
            <q-stepper-navigation>
              <q-btn color="primary" @click="finalgenerate" label="Finish" />
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
    </q-dialog>

    <div class="flex-center column">
      <div class="row" style="width: 100%; padding: 5px;">
        <div
          id="parent"
          class="fit row wrap justify-center items-start content-start"
        >
          <div class="col-4 large-screen-only" style="overflow: auto;">
            <q-card
              no-box-shadow
              class="float-right q-pr-md"
              style="font-size: 20px;"
            >
              <q-card-section>
                <img src="~/assets/nostr-logo.png" />
                <div class="q-pa-md">
                  <q-list padding class="text-secondary">
                    <q-item
                      v-if="disabled"
                      :disabled="disabled"
                      style="padding: 15px;"
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
                      :active="link === 'home'"
                      @click="link = 'home'"
                      active-class="my-menu-link"
                      :to="'/'"
                      style="padding: 15px;"
                    >
                      <q-item-section avatar>
                        <q-icon name="home"></q-icon>
                      </q-item-section>

                      <q-item-section>Home</q-item-section>
                    </q-item>

                    <q-item
                      v-if="disabled"
                      :disabled="disabled"
                      style="padding: 15px;"
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
                      :active="link === 'messages'"
                      @click="link = 'messages'"
                      active-class="my-menu-link"
                      :to="'/messages'"
                      style="padding: 15px;"
                    >
                      <q-item-section avatar>
                        <q-icon name="email"></q-icon>
                      </q-item-section>

                      <q-item-section>Messages</q-item-section>
                    </q-item>

                    <q-item
                      v-if="disabled"
                      :disabled="disabled"
                      style="padding: 15px;"
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
                      :active="link === 'settings'"
                      @click="link = 'settings'"
                      active-class="my-menu-link"
                      :to="'/settings'"
                      style="padding: 15px;"
                    >
                      <q-item-section avatar>
                        <q-icon name="settings"></q-icon>
                      </q-item-section>

                      <q-item-section>Settings</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      :active="link === 'help'"
                      @click="link = 'help'"
                      active-class="my-menu-link"
                      :to="'/help'"
                      style="padding: 15px;"
                    >
                      <q-item-section avatar>
                        <q-icon name="help"></q-icon>
                      </q-item-section>

                      <q-item-section>Help</q-item-section>
                    </q-item>
                    <br />
                  </q-list>
                  <q-btn
                    v-if="!disabled"
                    rounded
                    unelevated
                    style="width: 140px !important;height: 41px !important;"
                    color="primary"
                    size="md"
                    label="Publish"
                    @click="dialoguestarted()"
                  ></q-btn>
                  <q-btn
                    v-else
                    rounded
                    unelevated
                    style="width: 200px !important;height: 82px !important;"
                    color="primary"
                    size="md"
                    label="Genrate/Restore User Account"
                    @click="dialoguegenerate()"
                  ></q-btn>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-4 large-screen-only">
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

          <div class="col-4  large-screen-only">
            <q-card class="float-left no-shadow">
              <q-card-section>
                <q-input dense rounded outlined v-model="addPubkey">
                  <template v-slot:append>
                    <q-btn
                      round
                      dense
                      flat
                      icon="add"
                      @click="addPubFollow(addPubkey)"
                    />
                  </template>
                </q-input>
              </q-card-section>
              <q-card-section v-if="followlist">
                <h6 class="q-ma-none">Following</h6>
                <div class="q-pa-md" style="max-width: 350px">
                  <q-list>
                    <q-item
                      clickable
                      v-ripple
                      v-for="followed in following"
                      v-if="
                        followed.pubkey != $q.localStorage.getItem('pubkey')
                      "
                      :key="followed.id"
                      :to="'/user/' + followed.pubkey"
                    >
                      <q-item-section avatar>
                        <q-avatar round>
                          <img :src="avatarMake(followed.pubkey)" />
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>{{
                        followed.pubkey.substring(0, 10) + "..."
                      }}</q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <q-footer bordered style="bottom: 0%;position: fixed;" class="bg-white">
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
            @click="installApp"
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
            @click="neverInstallApp"
            dense
            class="q-px-sm"
            label="Never"
          ></q-btn>
        </template>
      </q-banner>
      <center>
        <q-tabs class="text-primary small-screen-only">
          <q-route-tab style="width: 20%;" name="home" icon="home" to="/" />

          <q-route-tab
            style="width: 20%;"
            name="messages"
            icon="email"
            to="/messages"
          />
          <q-route-tab
            style="width: 20%;"
            name="settings"
            icon="settings"
            to="/settings"
          />
          <q-route-tab style="width: 20%;" name="help" icon="help" to="/help" />
        </q-tabs>
      </center>
    </q-footer>
  </q-layout>
</template>

<script>
import { relayPool } from "nostr-tools";
import { myHelpers } from "../boot/helpers.js";
const pool = relayPool();
export default {
  name: "MainLayout",
  showInstallBanner: false,

  mounted() {
    let value = this.$q.localStorage.getItem("neverShowBanner");
    if (!value) {
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e;

        this.showInstallBanner = true;
      });
    }
  },
  mixins: [myHelpers],
  methods: {
    getUrlVars() {
      var vars = {};
      var parts = window.location.href.replace(
        /[?&]+([^=&]+)=([^&]*)/gi,
        function(m, key, value) {
          vars[key] = value;
        }
      );

      return vars;
    },
    installApp() {
      this.showInstallBanner = false;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
      });
    },

    neverInstallApp() {
      this.showInstallBanner = false;
      try {
        this.$q.localStorage.set("neverShowBanner", true);
      } catch (e) {
        console.log(e);
      }
    },
    copytoclip(text) {
      copyToClipboard(text)
        .then(() => {
          this.$q.notify({
            message: "COPIED",
          });
        })
        .catch(() => {
          this.$q.notify({ type: "negative", message: "FAILED" });
        });
    },
    captureimage() {
      let video = this.$refs.video;
      let canvas = this.$refs.canvas;
      canvas.width = video.getBoundingClientRect().width;
      canvas.height = video.getBoundingClientRect().height;
      let context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageCaptured = true;
      this.newpost.imagetemp = canvas.toDataURL();
      this.newpost.image = this.dataURItoBlob(canvas.toDataURL());
      console.log(this.newpost.image);
    },
    dataURItoBlob(dataURI) {
      var byteString = atob(dataURI.split(",")[1]);
      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];

      var ab = new ArrayBuffer(byteString.length);

      var ia = new Uint8Array(ab);

      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], { type: mimeString });
      return blob;
    },
  },
  created: function() {
    this.profile.pubkey = this.getUrlVars()["pub"];
    this.profile.privkey = this.getUrlVars()["prv"];

    if (this.profile.pubkey) {
      this.$q.localStorage.set("pubkey", pubkey);
    }
    this.profile.pubkey = this.$q.localStorage.getItem("pubkey");
    if (!this.profile.pubkey) {
      this.disabled = true;
    }

    if (this.disabled) {
      this.$router.push("/help");
    }
    this.getFollowing();
  },
};
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
