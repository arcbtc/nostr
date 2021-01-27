import {getEventHash} from 'nostr-tools'
import {LocalStorage, Notify} from 'quasar'
import * as secp from 'noble-secp256k1'
import 'md-gum-polyfill'

import {pool} from '../../global'

export function launch(store) {
  pool.setPrivateKey(store.state.myProfile.privkey)

  pool.onEvent((event, context, relay) => {
    switch (event.kind) {
      case 1:
        for (let i = 0; i < store.state.kind1.length; i++) {
          if (
            (store.state.kind1[i].loading === true ||
              store.state.kind1[i].retry === true) &&
            store.state.kind1[i].id === event.id
          ) {
            store.state.kind1[i].retry = false
            store.state.kind1[i].loading = false
            store.commit('replaceKind1', {index: i, event})
            return
          } else if (store.state.kind1[i].id === event.id) {
            return
          }
        }

        store.commit('addKind1', event)
        break

      case 4:
        for (let i = 0; i < store.state.kind4.length; i++) {
          if (
            (store.state.kind4[i].loading === true ||
              store.state.kind4[i].retry === true) &&
            store.state.kind4[i].id === event.id
          ) {
            store.state.kind4[i].retry = false
            store.state.kind4[i].loading = false
            store.commit('replaceKind4', {index: i, event})
            return
          } else if (store.state.kind4[i].id === event.id) {
            return
          }
        }

        store.commit('addKind4', event)
        break
    }
  })
}

export function relayPush(store, url) {
  store.commit('relayPush', url)
  pool.addRelay(url, {
    read: true,
    write: true
  })
}

export async function relayRemove(store, url) {
  store.commit('relaySplice', url)
  pool.removeRelay(url)
}

export async function getRelayPosts(store, {limit, offset, pubkey = null}) {
  if (pubkey === null) {
    for (var i = 0; i < store.state.theirProfile.length; i++) {
      pool.subKey(store.state.theirProfile[i].pubkey)
    }
    pool.subKey(store.state.pubkey)
    pool.reqFeed({
      limit,
      offset
    })
  } else {
    pool.reqKey({
      key: pubkey
    })
  }
}

export async function sendPost(store, {message, tags = [], kind = 1}) {
  let event = {
    pubkey: store.getters.myProfile.pubkey,
    created_at: Math.floor(Date.now() / 1000),
    kind,
    tags,
    content: message
  }
  event.id = await getEventHash(event)
  await pool.publish(event)

  store.commit('addKind1', {
    ...event,
    loading: true,
    retry: false
  })

  setTimeout(() => {
    store.dispatch('getAllPosts')
  }, 3000)
  console.log(event)
}

export function postAgain(store, event) {
  for (let i = 0; i < store.state.kind1.length; i++) {
    if (store.state.kind1[i].id === event.id) {
      store.commit('replaceKind1', {
        index: i,
        event: {
          ...event,
          loading: true,
          retry: false
        }
      })
    }
  }
  pool.publish(event)
}

export async function saveMeta(store, {image, handle, about}) {
  store.commit('setProfile', {
    ...store.state.myProfile,
    avatar: image,
    handle,
    about
  })

  var event = {
    pubkey: store.state.myProfile.pubkey,
    created_at: Math.floor(Date.now() / 1000),
    kind: 0,
    tags: [],
    content: JSON.stringify({
      name: store.state.myProfile.handle,
      about: store.state.myProfile.about,
      picture: store.state.myProfile.avatar
    })
  }

  event.id = await getEventHash(event)
  pool.publish(event)
}

export function deletePost(store, id) {
  store.commit('deleteKind1', id)
}

export function getAllPosts(store) {
  try {
    if (store.state.kind1.length < 20) {
      store.dispatch('getRelayPosts', {limit: 10, offset: 0})
    } else {
      store.dispatch('getRelayPosts', {limit: 3, offset: 0})
    }
  } catch (err) {
    Notify.create({
      message: 'Not able to connect to relay',
      color: 'secondary'
    })
  }

  setTimeout(() => {
    for (let i = 0; i < store.state.kind1.length; i++) {
      if (
        Date.now() / 1000 - store.state.kind1[i].created_at > 3 &&
        store.state.kind1[i].loading === true
      ) {
        store.commit('replaceKind1', {
          index: i,
          event: {...store.state.kind1[i], retry: true, loading: false}
        })
      }
    }
  }, 1000)
}

export function startFollowing(store, key) {
  let profile = store.state.theirProfile.find(({pubkey}) => pubkey === key)
  if (profile) {
    Notify.create({
      message: 'Already following',
      color: 'secondary'
    })
  }

  pool.subKey(key)
  store.commit('startFollowing', key)
  store.dispatch('getAllPosts')
}

export async function stopFollowing(store, key) {
  let profile = store.state.theirProfile.find(({pubkey}) => pubkey === key)
  if (!profile) {
    Notify.create({
      message: 'No such user',
      color: 'secondary'
    })
    return
  }

  pool.unsubKey(key)
  store.commit('stopFollowing', key)
}

export function finalGenerate(store, {keystoreoption, publickey, privatekey}) {
  var profile = {
    pubkey: publickey,
    privkey: privatekey,
    relays: ['wss://nostr-relay.herokuapp.com', 'wss://relay.nostr.org'],
    avatar: null,
    handle: null,
    about: null
  }

  if (keystoreoption === 'external') {
    profile.privkey = null
  }

  store.commit('setProfile', profile)
  LocalStorage.set('theirProfile', [])
  LocalStorage.set('kind1', [])

  store.dispatch('launch')
}

export async function sendChatMessage(store, {pubkey, text}) {
  const key = secp.getSharedSecret(store.state.myProfile.privkey, pubkey)

  var cipher = crypto.createCipher('aes-256-cbc', key)
  cipher.update(text, 'utf8', 'base64')
  let encryptedMessage = cipher.final('base64')

  var decipher = crypto.createDecipher('aes-256-cbc', key)
  decipher.update(encryptedMessage, 'base64', 'utf8')
  let decryptedMessage = decipher.final('utf8')

  console.log('encrypted :', encryptedMessage)
  console.log('decrypted :', decryptedMessage)

  // store messages on localstorage
  let lsKey = `messages.${pubkey}`
  var messages = LocalStorage.getItem(lsKey) || []
  if (!(pubkey in messages)) {
    messages[pubkey] = []
  }
  messages[pubkey].push({text, from: 'me'})
  LocalStorage.set(lsKey, messages[pubkey])

  // publish event
  let event = {
    pubkey: store.getters.myProfile.pubkey,
    created_at: Math.floor(Date.now() / 1000),
    kind: 4,
    tags: [['p', pubkey, store.state.myProfile.relays[0]]],
    content: encryptedMessage
  }
  event.id = await getEventHash(event)
  await pool.publish(event)
}
