<template>
  <q-layout >



  
    <q-dialog v-model="dialogpublish" >
      <q-card style="width:500px" class="q-pa-md q-pt-lg">


    <q-form
    style="width:100%"
      @submit="PubonSubmit"
      class="q-gutter-md"
    >


     <q-input
     style="font-size: 20px;"
      v-model="publishtext"
      autogrow
      label="Say something"
      lazy-rules
      :rules="[ val => val !== null && val.length > 280 || 'Less than 280 characters'
            ]"
      >
                    <template v-slot:before>
          <q-avatar>
            <img src="http://identicon.net/img/identicon.png">
          </q-avatar>
        </template>
       
      </q-input>

    <div class="column" v-if="activatevideo==true">
      <div class="col-9 q-mx-auto">
       <video v-show="!imageCaptured" playsinline ref="video" style="width:300px;" autoplay/>
       <canvas v-show="imageCaptured" ref="canvas" height="240"/>
      </div>
      <div class="col-3 q-mx-auto">
       
        <q-btn flat class="float-right "  rounded unelevated color="primary" icon="cancel" @click="discamera()" size="lg" />
        <q-btn flat class="float-right "  rounded unelevated color="primary" icon="camera" @click="captureimage()" size="lg" /> 
      </div>
    </div>
      




      <div class="float-right" >
       <q-btn  class="float-left q-mr-md"  round unelevated color="primary" icon="insert_emoticon" size="sm" /> 

        <q-btn  class="float-left q-mr-md"  round unelevated color="primary" icon="insert_photo" size="sm" /> 

        <q-btn  class="float-left q-mr-md"  round unelevated color="primary" icon="camera_alt" @click="initcamera()" size="sm" /> 


               <q-btn label="Publish" rounded unelevated type="submit" class="float-right" color="primary"/>
   </div>


      </q-form>

      </q-card>
    </q-dialog>


 

    <q-dialog v-model="dialoggenerate" >
      <q-card class="q-pa-md q-pt-lg">


      <q-stepper
      v-model="step"
      vertical
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Generate/Restore"
        icon="settings"
        :done="step > 1"
      > Nostr uses a private/public keypair to secure your account. 
      <br/>
      The private key is used to sign/publish posts (keep it safe!). 
      <br/>
      The public key allows other people to read your posts and follow you.
      <br/><br/>
      A word list of 24 words is used to create your keys, you can enter your own (seperated by spaces), or hit generate to create a fresh one.
     <q-input
      v-model="user.passphrase"
      autogrow
      type="textarea"
      label="Word list"
      ></q-input><br/>
       <q-btn @click="createKeys()" color="primary" label="Generate" class="q-mr-md" />  <q-btn @click="step = 2" color="primary" label="Restore" />
        <q-stepper-navigation v-if="passphrasegenerated">
          <q-btn @click="step = 2" color="primary" label="Generate" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Your keys"
        icon="vpn_key"
        :done="step > 2"
      >
        An ad group contains one or more ads which target a shared set of keywords.

        <q-stepper-navigation>
          <q-btn @click="step = 4" color="primary" label="Continue" />
          <q-btn flat @click="step = 1" color="primary" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="3"
        title="Key storage"
        icon="lock"
      >
        Try out different ad text to see what brings in the most customers, and learn how to
        enhance your ads using features like ad extensions. If you run into any problems with
        your ads, find out how to tell if they're running and how to resolve approval issues.

        <q-stepper-navigation>
          <q-btn color="primary" label="Finish" />
          <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>

      </q-card>
    </q-dialog>

 

    <div class="flex-center column">
          <div class="row" style="width: 100%; padding: 5px;">
            <div id="parent" class="fit row wrap justify-center items-start content-start" >
              <div class="col-4 large-screen-only" style="overflow: auto;">
          <q-card no-box-shadow class="float-right q-pr-md" style="font-size: 20px;">
            <q-card-section >
              

     <img
      src="~/assets/nostr-logo.png"
    />
  <div class="q-pa-md" >
    <q-list padding class="text-secondary" >
  

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
          <q-icon name="notifications"></q-icon>
        </q-item-section>

        <q-item-section>Notifications</q-item-section>
      </q-item>
      <q-item
       v-else
        clickable
        v-ripple
        :active="link === 'notifications'"
        @click="link = 'notifications'"
        active-class="my-menu-link"
        :to="'/notifications'"
        style="padding: 15px;"
      >
        <q-item-section avatar>
          <q-icon name="notifications"></q-icon>
        </q-item-section>

        <q-item-section>Notifications</q-item-section>
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
      <br/>
    </q-list>
        <q-btn
      v-if="!disabled"
      rounded unelevated
      style="width: 140px !important;height: 41px !important;"
      color="primary"
      size="md"
      label="Publish"
      @click="dialoguestarted()"
    ></q-btn>
       <q-btn
      v-else
      rounded unelevated
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


        <div class="col-12 small-screen-only" >
          <q-card>
            <q-card-section>

                 <q-page-container>
      <router-view />

    </q-page-container>

            </q-card-section>
          </q-card>
          
        </div>


        <div class="col-4  large-screen-only" >
          <q-card class="float-left no-shadow">
            <q-card-section>
                   <q-input  dense rounded outlined v-model="search">
                  <template v-slot:append>
          <q-btn round dense flat icon="search" />
        </template>
      </q-input>

   
      </q-card-section>
          </q-card>

        </div>
            </div>
          </div>
        </div>




      <q-footer bordered style="bottom: 0%;position: fixed;" class="bg-white small-screen-only" >
        <center>
          <q-tabs class="text-primary">
        <q-route-tab  style="width: 20%;" name="home" icon="home" to="/"/>
        <q-route-tab  style="width: 20%;" name="notifications" icon="notifications" to="/notifications"/>
        <q-route-tab style="width: 20%;" name="messages" icon="email" to="/messages"/>
        <q-route-tab style="width: 20%;" name="settings" icon="settings" to="/settings"/>
        <q-route-tab style="width: 20%;" name="help" icon="help" to="/help"/>
      </q-tabs>
    </center>
      </q-footer>

  </q-layout>


</template>





<script>
require('md-gum-polyfill')
var crypto = require('crypto')
var bitcoin = require("bitcoinjs-lib")
const bip39 = require('bip39')
const bip32 = require('bip32')
const bs58 = require('bs58')
var wif = require("wif")
const Buffer = require('safe-buffer').Buffer 
const BigInteger = require('bigi')
const schnorr = require('bip-schnorr')
const convert = schnorr.convert
import shajs from 'sha.js'

export default {
  name: 'MainLayout',
  data () {
    return {
     passphrasegenerated: false,
     step: 1,
     disabled: true,
     link: 'inbox',      
     publishtext: '',
     search:'',
     selectedTab: 'myAccount',
     splitterModel: 20,
     dialogpublish: false,
     dialoggenerate: false,
     activatevideo:false,
     imageCaptured: false,
     user:{
      passphrase: ''
     },
     newpost:{
        user: '',
        image: '',
        message: '',
        date: Date.now()
      }
    }


  },
  methods: {
  captureimage(){
      let video = this.$refs.video
      let canvas = this.$refs.canvas
      canvas.width = video.getBoundingClientRect().width
      canvas.height = video.getBoundingClientRect().height
      let context = canvas.getContext('2d')
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      this.imageCaptured = true
      this.newpost.imagetemp = canvas.toDataURL()
      this.newpost.image = this.dataURItoBlob(canvas.toDataURL())
      console.log(this.newpost.image)
      
    },
    dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  var ab = new ArrayBuffer(byteString.length);

  var ia = new Uint8Array(ab);


  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;

},

  async publishMetadata(store, meta) {
    let event = await publishEvent(
      {
        pubkey: store.getters.pubKeyHex,
        created_at: Math.round(new Date().getTime() / 1000),
        kind: KIND_METADATA,
        content: JSON.stringify(meta)
      },
      store.state.key,
      store.getters.writeServers
    )

  },
  async publishNote(store, {text, reference}) {
    let event = await publishEvent(
      {
        pubkey: store.getters.pubKeyHex,
        created_at: Math.round(new Date().getTime() / 1000),
        ref: reference,
        kind: KIND_TEXTNOTE,
        content: text.trim()
      },
      store.state.key,
      store.getters.writeServers
    )
  },
  async publishEvent(evt, key, hosts) {
  let hash = shajs('sha256').update(serializeEvent(evt)).digest()
  evt.id = hash.toString('hex')

  evt.sig = schnorr
    .sign(new BigInteger(key, 16), hash, makeRandom32())
    .toString('hex')

  return await broadcastEvent(evt, hosts)
},
broadcastEvent(evt, hosts) {
  hosts.forEach(async host => {
    if (host.length && host[host.length - 1] === '/') host = host.slice(0, -1)

    let publishLogEntry = {
      id: evt.id,
      time: evt.created_at,
      host
    }

    try {
      let r = await window.fetch(host + '/save_event', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(evt)
      })
      if (!r.ok) throw new Error('error publishing')

      db.publishlog.put({...publishLogEntry, status: 'succeeded'})
    } catch (err) {
      console.log(`failed to publish ${evt} to ${host}`)
      db.publishlog.put({...publishLogEntry, status: 'failed'})
    }
  })

  return evt
},
createKeys(){
  var  randomBytes = crypto.randomBytes(16)
  var mnemonic = bip39.entropyToMnemonic(randomBytes.toString('hex')) 
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  const root = bip32.fromSeed(seed)
  const path = "m/0'/0/0"

  const child1 = root.derivePath(path)

  console.log(root.privateKey.toString('hex'))
  console.log("cunt?".toString('hex'))



  const privKey = BigInteger.fromHex(root.privateKey.toString('hex'));
  
  const message = Buffer.from(this.hexToBytes("Ooo, what a cunt".toString('hex')), 'hex');
  const createdSignature = schnorr.sign(privKey, message);
  console.log(createdSignature)
  console.log('The signature is: ' + createdSignature.toString('hex'));

  },
    photoverify(){
      this.embedimage = true
      this.activatevideo = false
      navigator.mediaDevices.getUserMedia({
        video: false
      })
    },


    PubonSubmit(){

    },
    initcamera(){
      this.activatevideo = true
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(stream =>{
         this.$refs.video.srcObject = stream
      })
    },
    discamerahome(){
      this.activatevideo = false
      this.embedimage = false
      this.newpost.imagetemp = ''
      this.newpost.image = ''
 
      
    },

    dialoguegenerate(){
      this.dialoggenerate = true 
      this.video = false
    },
        dialoguestarted(){
      this.dialogpublish = true 
      this.video = false
    }
  },
    created: function () {
      if (this.disabled){
        window.location.href = "/#/help";
      }
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
