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
          <img round :src="avatarMake(singleprofile.pubkey)" />
        </q-avatar>
      </div>
      <div class="col-8">
        <p
          class="text-caption"
          style="width:100%;  word-break: break-all !important;"
        >
          {{ singleprofile.pubkey }}
        </p>
      </div>
    </div>

    <div class="q-pb-xl">
      <q-btn
        v-if="followCheck()"
        class="float-right q-mr-xs"
        round
        unelevated
        @click="unFollow(singleprofile.pubkey)"
        color="red"
        flat
        icon="cancel"
        size="sm"
      />
      <q-btn
        v-if="!followCheck(singleprofile.pubkey)"
        class="float-right q-mr-xs"
        round
        unelevated
        @click="addPubFollow(singleprofile.pubkey)"
        color="primary"
        flat
        icon="add_circle"
        size="sm"
      />

      <q-btn
        class="float-right q-mr-xs"
        round
        flat
        :to="'/chat/' + singleprofile.pubkey"
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
            <img :src="avatarMake(String(post.pubkey))" />
          </q-avatar>
        </q-card-section>

        <q-separator vertical style="display: none;" />

        <q-card-section class="col no-shadow">
          <q-item-label
            >{{ post.pubkey | handler }}
            <small style="color:grey">{{
              post.created_at | niceDate
            }}</small></q-item-label
          >
          {{ post.content }}
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
      followcheck: false,
      profilePosts: [],
    };
  },
  mixins: [myHelpers],
  methods: {
    followCheck(pubKey) {
      var following = this.getFollowing();
      for (var i = 0; i < this.following.length; i++) {
        if (pubKey == this.following[i].pubkey) {
          return true;
        }
      }
    },
  },

  created() {
    var myProfile = JSON.parse(this.$q.localStorage.getItem("myProfile"));
    var theirProfile = JSON.parse(this.$q.localStorage.getItem("theirProfile"));
    if (!myProfile) {
      this.disabled = true;
      this.$router.push("/help");
    } else {
      this.getUserPosts(
        this.$route.path.split("/")[this.$route.path.split("/").length - 1]
      );
    }

    this.singleprofile = [];
    for (var i = 0; i < theirProfile.length; i++) {
      if (
        (theirProfile[i].pubkey = this.$route.path.split("/")[
          $route.path.split("/").length - 1
        ])
      ) {
        this.singleprofile = theirProfile[i];
      }
    }
  },
  filters: {},
};
</script>
