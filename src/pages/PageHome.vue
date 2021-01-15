<template>
  <q-page>
    <template>
      <div class="row" style="width:100%">
        <q-form
          style="width:100%;"
          @submit="sendPost(publishtext, [], 1)"
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

                  <q-btn :to="'/user/' + $q.localStorage.getItem('pubkey')"round>
      <q-avatar size="42px">
       <img 
                  :src="avatarMake($q.localStorage.getItem('pubkey'))"
                />
      </q-avatar>
    </q-btn>



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
      v-for="post in posts"
      v-if="post.kind == 1 ? true : false""
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
          
            <q-spinner-dots v-if="post.loading" color="primary" />

            <q-btn
              class="float-right q-mr-xs"
              round
              unelevated
              color="primary"
              flat
              icon="repeat"
              size="sm"
            />
            <q-btn
              class="float-right q-mr-xs"
              round
              unelevated
              color="primary"
              flat
              icon="chat_bubble_outline"
              size="sm"
            />
            <q-btn
              class="float-right q-mr-xs"
              round
              unelevated
              color="primary"
              flat
              icon="favorite_border"
              size="sm"
            />
            <q-btn
               v-if="post.retry" 
               class="float-right q-mr-xs"
              round
              unelevated
              color="pink"
              flat
              @click="postAgain(post)"
              icon="settings_backup_restore"
              size="sm"
            />
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
        <q-infinite-scroll v-if="posts.length > 20" @load="onLoad(posts.length + 10)" :offset="250">

      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>

  </q-page>
</template>

<script>
import { date } from "quasar";

import { myHelpers } from "../boot/helpers.js";

export default {
  name: "PageHome",

  data() {
    return {
      checktest: false,
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
      items: [ {}, {}, {}, {}, {}, {}, {} ],
    };
  },

  mixins: [myHelpers],
  mounted: {
    
  },
  methods: {
    onLoad (index, done) {
      setTimeout(() => {
        if (this.posts) {
          this.getRelayPosts(index, this.posts.length)
          done()
        }
      }, 2000)
    },
  },
  filters: {
    tagCheck(post) {
      return true;
    },
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

this.getAllPosts();
console.log(this.following)
       try{ this.profile.pubkey = this.getUrlVars()["pub"];
    this.profile.privkey = this.getUrlVars()["prv"];
}catch{}
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

  },
};
</script>
