<template>
  <q-page>
    <template>
      <div class="row" style="width:100%">
        <q-form
          style="width:100%;"
          @submit="sendPost(publishtext)"
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
                <img :src="myavatar" />
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
              type="submit"
              class="float-right"
              color="primary"
            />
          </div>
        </q-form>
      </div>
    </template>
    <q-card
      v-for="post in profilePosts"
      :key="post.id"
      class="my-card"
      flat
      style="border:none;"
    >
      <q-card-section class="no-shadow" horizontal>
        <q-card-section class="no-shadow">
          <q-avatar class="no-shadow">
            <img :src="post.avatar" />
          </q-avatar>
        </q-card-section>

        <q-separator vertical style="display: none;" />

        <q-card-section class="col no-shadow">
          <q-item-label
            >{{ post.user | handler }}
            <small style="color:grey">{{
              post.date | niceDate
            }}</small></q-item-label
          >
          {{ post.message }}
          <div>
            <q-btn
              class="float-right q-mr-md"
              round
              unelevated
              color="primary"
              flat
              icon="chat_bubble_outline"
              size="sm"
            />
            <q-btn
              class="float-right q-mr-md"
              round
              unelevated
              color="primary"
              flat
              icon="repeat"
              size="sm"
            />

            <q-btn
              class="float-right q-mr-md"
              round
              unelevated
              color="primary"
              flat
              icon="favorite_border"
              size="sm"
            />
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { date } from "quasar";
require("md-gum-polyfill");
let deferredPrompt;

var crypto = require("crypto");
var bitcoin = require("bitcoinjs-lib");
const bip39 = require("bip39");
const bip32 = require("bip32");
const bs58 = require("bs58");
var wif = require("wif");
const Buffer = require("safe-buffer").Buffer;

//const convert = schnorr.convert;
import { relayPool } from "nostr-tools";
import shajs from "sha.js";
//import BigInteger from "bigi";
//import schnorr from "bip-schnorr";
import { copyToClipboard } from "quasar";
const ecurve = require("ecurve");
const curve = ecurve.getCurveByName("secp256k1");
const G = curve.G;
const identicon = require("identicon");
import { myHelpers } from "../boot/helpers.js";

export default {
  name: "PageHome",

  data() {
    return {
      publishtext: "",
      myavatar: "",
      emojiOn: false,
      activatevideohome: false,
      imageCaptured: false,
      hasCamerasuport: true,
      homeembedimage: false,
      imagefile: "",
      newpost: {
        user: "",
        message: "",
        image: null,
        date: Date.now(),
      },
      emojis1: [
        { item: "😂" },
        { item: "😃" },
        { item: "😍" },
        { item: "😘" },
        { item: "😭" },
        { item: "🤣" },
        { item: "🧐" },
        { item: "👊" },
        { item: "🤘" },
      ],
      emojis2: [
        { item: "👌" },
        { item: "🙌" },
        { item: "🤦" },
        { item: "🚀" },
        { item: "🔥" },
        { item: "💯" },
        { item: "⚡" },
        { item: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
        { item: "🌑" },
      ],
      profilePosts: [],
    };
  },
  mixins: [myHelpers],
  methods: {
    avatarMake(theData) {
      // Synchronous API

      const avicon = shajs("sha256")
        .update(theData)
        .digest("hex");
      console.log(avicon);
      return identicon.generateSync({ id: avicon, size: 40 });
    },
    async sendPost(message) {
      const pool = relayPool();

      pool.setPrivateKey(this.$q.localStorage.getItem("privkey")); // optional

      var relays = JSON.parse(this.$q.localStorage.getItem("relays"));
      for (var i = 0; i < relays.length; i++) {
        pool.addRelay(relays[i], {
          read: true,
          write: true,
        });
      }

      pool.onEvent((event, context, relay) => {
        if (this.$q.localStorage.getItem(event.id) === null) {
          var postss = JSON.parse(this.$q.localStorage.getItem("posts"));
          this.$q.localStorage.set(event.id, JSON.stringify(event));
          postss.unshift(event.id);
          this.$q.localStorage.set("posts", JSON.stringify(postss));
          this.posts.unshift({
            id: event.id,
            message: event.content,
            avatar: this.avatarMake(event.pubkey),
            date: event.created_at * 1000,
            user: event.pubkey,
            handle: null,
          }); // what to push unto the rows array?
        }
        this.publishtext = "";
      });

      const timest = Math.floor(Date.now() / 1000);
      var eventObject = {
        pubkey: String(this.$q.localStorage.getItem("pubkey")),
        created_at: timest,
        kind: 1,
        tags: [],
        content: message,
      };

      pool.subKey(String(this.$q.localStorage.getItem("pubkey")));

      pool.publish(eventObject);
    },
    getuserPosts(user) {
      this.getRelayPosts();
      console.log("poo");
      var postss = JSON.parse(this.$q.localStorage.getItem("posts"));

      for (var i = 0; i < postss.length; i++) {
        var singlePost = JSON.parse(this.$q.localStorage.getItem(postss[i]));
        console.log(singlePost.kind);

        if (singlePost.kind == 1 && singlePost.pubkey == user) {
          this.profilePosts.push({
            id: singlePost.id,
            message: singlePost.content,
            avatar: this.avatarMake(singlePost.pubkey),
            date: singlePost.created_at * 1000,
            user: singlePost.pubkey,
            handle: null,
          });
        }
      }
    },
  },
  filters: {
    //prefer handle over user
    handler(value) {
      return "@" + value.substring(0, 15) + "....";
    },
    //make timestamp look nice
    niceDate(value) {
      let formattedString = date.formatDate(value, "YYYY MMM D h:mm A");
      return formattedString;
    },
  },
  created() {
    this.getuserPosts(
      this.$route.path.split("/")[this.$route.path.split("/").length - 1]
    );
  },
};
</script>
