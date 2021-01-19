<template>
  <q-page>
    <template>
      <div class="row" style="width:100%">
        <q-form
          style="width:100%;"
          @submit="sendPost(publishtext, [])"
          class="q-gutter-md"
        >
          <q-input
            style="font-size: 20px;"
            v-model="publishtext"
            autogrow
            label="Say something"
            maxlength="280"
          >
            <template v-slot:before>
              <q-btn
                @click="
                  toProfile(
                    JSON.parse($q.localStorage.getItem('myProfile')).pubkey
                  )
                "
                round
              >
                <q-avatar size="42px">
                  <img
                    :src="
                      avatarMake(
                        JSON.parse($q.localStorage.getItem('myProfile')).pubkey
                      )
                    "
                  />
                </q-avatar>
              </q-btn>
            </template>
          </q-input>

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
      :key="post.id"
      class="my-card"
      flat
      style="border:none;"
    >
      <q-card-section class="no-shadow" horizontal>
        <q-card-section class="no-shadow">
          <q-avatar class="no-shadow">
            <img :src="avatarMake(post.pubkey)" />
          </q-avatar>
        </q-card-section>

        <q-separator vertical style="display: none;" />

        <q-card-section class="col no-shadow">
          <q-card-section class="q-pa-none" @click="dialoguePost(post)">
            <q-item-label
              >{{ post.pubkey | handler }}
              <small style="color:grey">{{
                post.created_at | niceDate
              }}</small></q-item-label
            >
            {{ post.content }}
          </q-card-section>
          <div>
            <q-spinner-dots v-if="post.loading" color="primary" />
            <q-btn
              v-if="!post.retry && !post.loading"
              class="float-right q-mr-xs"
              round
              unelevated
              color="primary"
              flat
              icon="chat_bubble_outline"
              @click="dialoguePost(post)"
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
            <q-btn
              v-if="post.retry"
              class="float-right q-mr-xs"
              round
              unelevated
              color="pink"
              flat
              @click="deletePost(post)"
              icon="cancel"
              size="sm"
            />
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
    <q-dialog v-model="dialogpost" position="top">
      <q-card class="my-card q-mt-md" flat style="border:none;">
        <q-card-section class="no-shadow" vertical>
          <q-card-section class="no-shadow" horizontal>
            <q-card-section class="no-shadow q-pb-none">
              <q-avatar class="no-shadow ">
                <img :src="avatarMake(String(dialoguepost.pubkey))" />
              </q-avatar>
            </q-card-section>

            <q-separator vertical style="display: none;" />

            <q-card-section class="col no-shadow q-pb-none">
              <q-item-label
                >{{ String(dialoguepost.pubkey) | handler }}
                <small style="color:grey">{{
                  dialoguepost.created_at | niceDate
                }}</small></q-item-label
              >
              {{ dialoguepost.content }}
              <div></div>
            </q-card-section>
          </q-card-section>
          <q-card-section class="no-shadow q-pa-none q-pl-xl">
            <div class="row" style="width:100%">
              <q-form
                style="width:100%;"
                @submit="sendPost(replytext, [['e', dialoguepost.id]])"
                class="q-gutter-md"
              >
                <q-input
                  dense
                  style="font-size: 20px;"
                  v-model="replytext"
                  autogrow
                  maxlength="280"
                >
                </q-input>

                <div class="float-right">
                  <q-btn
                    v-if="replytext.length < 280"
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
                        @click="replytext = replytext + emoji.item"
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
                        @click="replytext = replytext + emoji.item"
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
                    label="Reply"
                    rounded
                    unelevated
                    type="submit"
                    class="float-right"
                    color="primary"
                  />
                </div>
              </q-form>
            </div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-infinite-scroll
      v-if="posts.length > 20"
      @load="onLoad(posts.length + 10)"
      :offset="250"
    >
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
      items: [{}, {}, {}, {}, {}, {}, {}],
    };
  },

  mixins: [myHelpers],
  methods: {
    onLoad(index, done) {
      setTimeout(() => {
        if (this.posts) {
          this.getRelayPosts(index, this.posts.length);
          done();
        }
      }, 2000);
    },
  },
  filters: {
    tagCheck(post) {
      return true;
    },
  },
  created() {
    var myProfile = JSON.parse(this.$q.localStorage.getItem("myProfile"));
    if (!myProfile) {
      this.disabled = true;
      console.log(this.disabled);
      this.$router.push("/help");
    } else {
      var theirProfile = JSON.parse(
        this.$q.localStorage.getItem("theirProfile")
      );
      this.myprofile = myProfile;
      this.theirProfile = theirProfile;
      this.getAllPosts();
    }
  },
  filters: {
    handler(value, value2) {
      if (value != "") {
        return value.substring(0, 20) + "....";
      } else {
        return value;
      }
    },
    niceDate(value) {
      let formattedString = date.formatDate(value, "YYYY MMM D h:mm A");
      return formattedString;
    },
  },
};
</script>
