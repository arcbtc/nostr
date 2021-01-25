<template>
  <q-card class="my-card q-mt-md" flat style="border: none">
    <q-card-section class="no-shadow" vertical>
      <q-card-section class="no-shadow" horizontal>
        <q-card-section class="no-shadow q-pb-none">
          <q-avatar class="no-shadow">
            <img :src="avatarMake(String(post.pubkey))" />
          </q-avatar>
        </q-card-section>

        <q-separator vertical style="display: none" />

        <q-card-section class="col no-shadow q-pb-none">
          <q-item-label
            >{{ String(post.pubkey) | handler }}
            <small style="color: grey">{{
              post.created_at | niceDate
            }}</small></q-item-label
          >
          {{ post.content }}
          <div></div>
        </q-card-section>
      </q-card-section>
      <q-card-section class="no-shadow q-pa-none q-pl-xl">
        <div class="row" style="width: 100%">
          <q-form
            style="width: 100%"
            @submit="sendPost(replytext, [['e', post.id]])"
            class="q-gutter-md"
          >
            <q-input
              dense
              style="font-size: 20px"
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
</template>

<script>
import helpersMixin from '../utils/mixin'

export default {
  mixins: [helpersMixin],

  props: ['post']
}
</script>
