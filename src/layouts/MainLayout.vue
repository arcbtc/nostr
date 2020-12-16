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
      rounded unelevated
      style="width: 140px !important;height: 41px !important;"
      color="primary"
      size="md"
      label="Publish"
      @click="dialoguestarted()"
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
require('md-gum-polyfill');

export default {
  name: 'MainLayout',
  data () {
    return {
     link: 'inbox',      
     publishtext: '',
     search:'',
     selectedTab: 'myAccount',
     splitterModel: 20,
     dialogpublish: false,
     activatevideo:false,
     imageCaptured: false,
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
    discamera(){
      this.activatevideo = false
      navigator.mediaDevices.getUserMedia({
        video: false
      })
    },

    dialoguestarted(){
      this.dialogpublish = true 
      this.video = false
    }
  },

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
