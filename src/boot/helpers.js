import {getEventHash, relayPool} from 'nostr-tools'

import {date} from 'quasar'
import shajs from 'sha.js'
import BigInteger from 'bigi'
import bip39 from 'bip39'
import bip32 from 'bip32'
import identicon from 'identicon'
import ecurve from 'ecurve'
import crypto from 'crypto'

import 'md-gum-polyfill'

const pool = relayPool()
const curve = ecurve.getCurveByName('secp256k1')
const G = curve.G

export const myHelpers = {
  data() {
    return {
      myprofile: {},
      theirprofile: {},
      following: [],
      passphrasegenerated: false,
      step: 1,
      disabled: false,
      link: 'inbox',
      publishtext: '',
      search: '',
      selectedTab: 'myAccount',
      splitterModel: 20,
      dialogpublish: false,
      dialogpost: false,
      dialoggenerate: false,
      dialoggenerateload: false,
      activatevideo: false,
      imageCaptured: false,
      user: {
        isPwd: true,
        passphrase: '',
        keystoreoption: 'local',
        loading: false,
        passphraseLoad: false
      },
      replytext: '',
      emojiOn: false,
      newpost: {
        user: '',
        message: '',
        image: null,
        date: Date.now()
      },
      emojis1: [
        {
          item: '😂'
        },
        {
          item: '😃'
        },
        {
          item: '😍'
        },
        {
          item: '😘'
        },
        {
          item: '😭'
        },
        {
          item: '🤣'
        },
        {
          item: '🧐'
        },
        {
          item: '👊'
        },
        {
          item: '🤘'
        }
      ],
      emojis2: [
        {
          item: '👌'
        },
        {
          item: '🙌'
        },
        {
          item: '🤦'
        },
        {
          item: '🚀'
        },
        {
          item: '🔥'
        },
        {
          item: '💯'
        },
        {
          item: '⚡'
        },
        {
          item: '🏴󠁧󠁢󠁷󠁬󠁳󠁿'
        },
        {
          item: '🌑'
        }
      ],
      singleprofile: [],
      posts: [],
      posts4: [],
      loading: [],
      retry: [],
      followlist: false,
      openQrShow: false,
      addPubKey: '',
      showInstallBanner: false,
      dialoguepost: {
        pubkey: null,
        created_at: null,
        content: null
      }
    }
  },
  methods: {
    launchPool() {
      var myProfile = JSON.parse(this.$q.localStorage.getItem('myProfile'))
      pool.setPrivateKey(myProfile.privkey)
      this.relayPush()
    },
    relayPush(theRelay = null) {
      console.log(theRelay)
      var myProfile = JSON.parse(this.$q.localStorage.getItem('myProfile'))

      if (theRelay !== null) {
        myProfile.relays.push(theRelay)
        this.$q.localStorage.set('myProfile', JSON.stringify(myProfile))
      }
      for (var i = 0; i < myProfile.relays.length; i++) {
        pool.addRelay(myProfile.relays[i], {
          read: true,
          write: true
        })
      }
      this.myprofile = myProfile
    },
    async relayRemove(relay) {
      var myProfile = JSON.parse(this.$q.localStorage.getItem('myProfile'))
      for (var i = 0; i < relay.length; i++) {
        myProfile.relays.splice(myProfile.relays.indexOf(relay[i]), 1)
        console.log(myProfile.relays)

        this.$q.localStorage.set('myProfile', JSON.stringify(myProfile))
      }
      this.myprofile = myProfile
    },
    async getRelayPosts(theLimit, theOffset, pubKey = null) {
      if (pubKey === null) {
        var myProfile = JSON.parse(this.$q.localStorage.getItem('myProfile'))
        var theirProfile = JSON.parse(
          this.$q.localStorage.getItem('theirProfile')
        )

        for (var i = 0; i < theirProfile.length; i++) {
          pool.subKey(theirProfile[i].pubkey)
        }
        pool.onEvent((event, context, relay) => {
          console.log(event)
          var thePosts = JSON.parse(this.$q.localStorage.getItem('kind1'))
          var thePosts4 = JSON.parse(this.$q.localStorage.getItem('kind4'))
          if (event.kind === 1) {
            var postexists = false
            for (var i = 0; i < thePosts.length; i++) {
              if (
                (thePosts[i].loading === true || thePosts[i].retry === true) &&
                thePosts[i].id === event.id
              ) {
                thePosts[i].retry = false
                thePosts[i].loading = false
                postexists = true
                this.$q.localStorage.set('kind1', JSON.stringify(thePosts))
              } else if (thePosts[i].id === event.id) {
                postexists = true
              }
            }
            if (!postexists) {
              thePosts.unshift(event)
              thePosts[0].retry = false
              thePosts[0].loading = false
              this.$q.localStorage.set('kind1', JSON.stringify(thePosts))
            }
          }
          if (event.kind === 4) {
            thePosts4.unshift(event)
            thePosts4[0].retry = false
            thePosts4[0].loading = false
            this.$q.localStorage.set('kind4', JSON.stringify(thePosts4))
          }
        })
        pool.subKey(myProfile.pubkey)
        pool.reqFeed({
          limit: theLimit,
          offset: theOffset
        })
      } else {
        pool.reqKey({
          key: pubKey
        })
      }
    },
    async sendPost(message, theTags = [], theKind = 1) {
      this.dialogpublish = false
      var myProfile = JSON.parse(this.$q.localStorage.getItem('myProfile'))
      const timest = Math.floor(Date.now() / 1000)
      var eventObject = {
        pubkey: myProfile.pubkey,
        created_at: timest,
        kind: theKind,
        tags: theTags,
        content: message
      }
      var eventObjectId = await getEventHash(eventObject)
      eventObject.id = eventObjectId
      await pool.publish(eventObject)
      this.posts = await JSON.parse(this.$q.localStorage.getItem('kind1'))
      this.posts.unshift(eventObject)
      this.posts[0].id = eventObjectId
      this.posts[0].loading = true
      this.posts[0].retry = false
      this.posts[0].etag = ''
      await this.$q.localStorage.set('kind1', JSON.stringify(this.posts))
      setTimeout(this.getAllPosts, 3000)
      delete eventObject.retry
      delete eventObject.loading
      delete eventObject.etag
      console.log(eventObject)
    },
    postAgain(postData) {
      this.posts = JSON.parse(this.$q.localStorage.getItem('kind1'))
      for (var i = 0; i < this.posts.length; i++) {
        if (this.posts[i].id === postData.id) {
          this.posts.splice(i, 1)
          this.$q.localStorage.set('kind1', JSON.stringify(this.posts))
        }
      }
      this.sendPost(postData.content)
    },
    async saveMeta({image, handle, about}) {
      var myProfile = JSON.parse(this.$q.localStorage.getItem('myProfile'))
      myProfile.avatar = image
      myProfile.handle = handle
      myProfile.about = about
      this.$q.localStorage.set('myProfile', myProfile)

      const timest = Math.floor(Date.now() / 1000)

      var eventObject = {
        pubkey: myProfile.pubkey,
        created_at: timest,
        kind: 0,
        tags: [],
        content: JSON.stringify({
          name: myProfile.handle,
          about: myProfile.about,
          picture: myProfile.avatar
        })
      }

      var eventObjectId = await getEventHash(eventObject)
      eventObject.id = eventObjectId
      pool.publish(eventObject)
    },
    deletePost(postData) {
      this.posts = JSON.parse(this.$q.localStorage.getItem('kind1'))
      for (var i = 0; i < this.posts.length; i++) {
        if (this.posts[i].id === postData.id) {
          this.posts.splice(i, 1)
          this.$q.localStorage.set('kind1', JSON.stringify(this.posts))
        }
      }
    },
    avatarMake(theData = '') {
      const avicon = shajs('sha256').update(theData).digest('hex')
      return identicon.generateSync({
        id: avicon,
        size: 40
      })
    },
    addPubFollow(pubKeyFollow) {
      var check = true
      var theirProfile = JSON.parse(
        this.$q.localStorage.getItem('theirProfile')
      )
      for (var i = 0; i < theirProfile.length; i++) {
        if (theirProfile[i].pubkey === pubKeyFollow) {
          check = false
          this.$q.notify({
            message: 'Already following',
            color: 'secondary'
          })
        }
      }
      if (check) {
        theirProfile.push({
          pubkey: pubKeyFollow,
          avatar: null,
          handle: null,
          about: null
        })
        this.$q.localStorage.set('theirProfile', JSON.stringify(theirProfile))
        this.getFollowing()
        if (this.posts > 20) {
          this.getRelayPosts(3, 0)
        } else {
          this.getRelayPosts(10, 0)
        }
      }
    },
    getFollowing() {
      var theirProfile = JSON.parse(
        this.$q.localStorage.getItem('theirProfile')
      )
      if (theirProfile[0] !== null) {
        this.followlist = true
        this.following = theirProfile
      }
      return this.following
    },
    getAllPosts() {
      var thePosts = JSON.parse(this.$q.localStorage.getItem('kind1'))

      try {
        if (thePosts.length < 20) {
          this.getRelayPosts(10, 0)
        } else {
          this.getRelayPosts(3, 0)
        }
      } catch (err) {
        this.$q.notify({
          message: 'Not able to connect to relay',
          color: 'secondary'
        })
      }

      for (var i = 0; i < thePosts.length; i++) {
        if (
          Date.now() / 1000 - thePosts[i].created_at > 3 &&
          thePosts[i].loading === true
        ) {
          thePosts[i].retry = true
          thePosts[i].loading = false
          this.$q.localStorage.set('kind1', JSON.stringify(thePosts))
        }
      }
      this.posts = thePosts
    },
    async unFollow(data) {
      pool.unsubKey(data)
      var theirProfile = JSON.parse(
        this.$q.localStorage.getItem('theirProfile')
      )
      for (var i = 0; i < theirProfile.length; i++) {
        if (theirProfile[i].pubkey === data) {
          theirProfile.splice(i, 1)
          this.following = theirProfile
          this.$q.localStorage.set('theirProfile', JSON.stringify(theirProfile))
          this.following = JSON.parse(
            this.$q.localStorage.getItem('theirProfile')
          )
          this.link = 'home'
          this.$router.push('/')
        } else {
          this.$q.notify({
            message: 'No such user',
            color: 'secondary'
          })
        }
      }
    },
    toProfile(profile) {
      this.singleprofile.pubkey = profile
      this.$router.push('/user/' + profile)
    },
    getUserPosts(user) {
      this.getRelayPosts(20, 0, user)
      var post = JSON.parse(this.$q.localStorage.getItem('kind1'))
      var posts = []
      for (var i = 0; i < post.length; i++) {
        if (post[i].pubkey === user) {
          posts.push(post[i])
        }
      }
      this.profilePosts = posts
    },
    createKeys(words = '') {
      var splitWords = words.split(' ')
      var mnemonic
      if (splitWords.length === 12) {
        this.user.passphrase = words
        mnemonic = words
      } else {
        var randomBytes = crypto.randomBytes(16)
        mnemonic = bip39.entropyToMnemonic(randomBytes.toString('hex'))
        this.user.passphrase = mnemonic
      }

      this.$q.notify({
        message: 'MAKE SURE YOU BACKUP YOUR WORD LIST'
      })
      const seed = bip39.mnemonicToSeedSync(mnemonic)
      const root = bip32.fromSeed(seed)
      this.passphrasegenerated = true
      this.user.privatekey = root.privateKey.toString('hex')
      const privKey = BigInteger.fromHex(root.privateKey.toString('hex'))
      const pubkey = G.multiply(privKey)
        .getEncoded(true)
        .slice(1)
        .toString('hex')
      this.user.publickey = pubkey
    },
    finalGenerate() {
      var theRelays = [
        'wss://nostr-relay.herokuapp.com',
        'wss://relay.nostr.org'
      ]
      var stored = this.user.keystoreoption
      if (stored === 'external') {
        this.$q.localStorage.set(
          'myProfile',
          JSON.stringify({
            pubkey: this.user.publickey,
            privkey: null,
            relays: theRelays,
            avatar: null,
            handle: null,
            about: null
          })
        )
        this.$router.push('/')
        this.disabled = false
        this.link = 'home'
      } else if (stored === 'url') {
        this.$q.localStorage.set(
          'myProfile',
          JSON.stringify({
            pubkey: this.user.publickey,
            privkey: null,
            relays: theRelays,
            avatar: null,
            handle: null,
            about: null
          })
        )
        this.$router.push(
          '/' + '?pub=' + this.user.publickey + '&prv=' + this.user.privatekey
        )
        this.disabled = false
        this.link = 'home'
      } else {
        this.$q.localStorage.set(
          'myProfile',
          JSON.stringify({
            pubkey: this.user.publickey,
            privkey: this.user.privatekey,
            relays: theRelays,
            avatar: null,
            handle: null,
            about: null
          })
        )
        this.$q.localStorage.set('theirProfile', JSON.stringify([]))
        this.$q.localStorage.set('kind0', JSON.stringify([]))
        this.$q.localStorage.set('kind1', JSON.stringify([]))
        this.$q.localStorage.set('kind2', JSON.stringify([]))
        this.$q.localStorage.set('kind3', JSON.stringify([]))
        this.$q.localStorage.set('kind4', JSON.stringify([]))
        this.disabled = false
        this.link = 'home'
        this.launchPool()
        this.$router.push('/')
      }
    },
    dialogueGenerate() {
      this.dialoggenerate = true
    },
    dialogueStarted() {
      this.dialogpublish = true
    },
    dialoguePost(post) {
      this.dialoguepost = post
      this.dialogpost = true
    }
  },
  filters: {
    handler(value, value2) {
      if (value !== '') {
        return value
      } else {
        return value2
      }
    },
    niceDate(value) {
      let formattedString = date.formatDate(value, 'YYYY MMM D h:mm A')
      return formattedString
    }
  }
}
