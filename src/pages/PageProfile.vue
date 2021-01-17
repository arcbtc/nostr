<template>
  <q-page>
    <q-btn
      flat
      color="white"
      icon="arrow_back"
      label="back"
      class="small-screen-only fixed-top-left q-ma-xs"
      v-go-back.single
    />

    <center><strong class="text-h6 q-ma-sm fixed-top">Profile</strong></center>
    <br />
    <br />

    <div class="row">
      <div class="col-2">
        <q-avatar size="50px" round>
          <img
            round
            :src="
              avatarMake(
                $route.path.split('/')[this.$route.path.split('/').length - 1]
              )
            "
          />
        </q-avatar>
      </div>
      <div class="col-8">
        <p
          class="text-caption"
          style="width:100%;  word-break: break-all !important;"
        >
          {{ $route.path.split("/")[$route.path.split("/").length - 1] }}
        </p>
      </div>
    </div>

    <div
      class="q-pb-xl"
      v-if="
        $route.path.split('/')[$route.path.split('/').length - 1] !=
          $q.localStorage.getItem('pubkey')
      "
    >
      <q-btn
        class="float-right q-mr-xs"
        round
        unelevated
        @click="
          unfollow($route.path.split('/')[$route.path.split('/').length - 1])
        "
        color="primary"
        flat
        icon="cancel"
        size="sm"
      />
      <q-btn
        class="float-right q-mr-xs"
        round
        flat
        :to="
          '/chat/' +
            $route.path.split('/')[this.$route.path.split('/').length - 1]
        "
        unelevated
        color="primary"
        icon="message"
        size="sm"
      />
    </div>

    <q-card
      v-for="post in profilePosts"
      :key="post.id"
      class="my-card q-mt-sm"
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
  methods: {},

  created() {
    var myProfile = JSON.parse(this.$q.localStorage.getItem("myProfile"));
    if (!myProfile) {
      this.disabled = true;
      this.$router.push("/help");
    } else {
      this.getUserPosts(
        this.$route.path.split("/")[this.$route.path.split("/").length - 1]
      );
    }
  },
};
</script>
