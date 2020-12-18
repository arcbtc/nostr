<template>
  <q-page>



<template>


    <div class="row" style="width:100%">
    	      


    <q-form
    
    style="width:100%;" 
      @submit="PublishonSubmit"
      class="q-gutter-md"
    >
     <center>
          <div class="column" style="height: 170px;width:220px; border: 2px solid #26A69A; border-radius: 5px;"   v-show="homeembedimage">
      <div class="col">
        
        <q-btn flat round color="red" icon="clear" size="sm" @click="discamerahome()"  class="float-right" />
      </div>
      <div class="col-12">
           
                
       
            <img width="200" class="q-ma-sm" :src="newpost.imagetemp">
      
      </div>

    </div>

</center>

      
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


    <div class="column" v-show="activatevideohome==true">
      <div class="col-9 q-mx-auto">

        <video v-show="!imageCaptured" playsinline ref="video" style="width:300px;" autoplay/>
       <canvas v-show="imageCaptured" ref="canvas" height="240"/>
      </div>
      <div class="col-3 q-mx-auto">
       
        <q-btn flat class="float-right "  rounded unelevated color="primary" icon="cancel" @click="discamerahome()" size="lg" />
                
        <q-btn flat class="float-right "  rounded unelevated color="primary" icon="camera" @click="captureimage()" size="lg" /> 
        <q-btn v-show="imageCaptured" flat class="float-right "  rounded unelevated color="primary" icon="check_circle" @click="photoverify()" size="lg" /> 
      </div>
    </div>


      <div class="float-right" >
       <q-btn  class="float-left q-mr-md" round unelevated color="primary" icon="insert_emoticon" size="sm">
               <q-popup-proxy>
 <picker set="twitter" title="Pick an emoji!" emoji="point_up"/>
      </q-popup-proxy>
        
       </q-btn>

    
        <q-file ref="myFileInput" accept="image/*" @input="captureimageupload" style="display:none" v-model="imagefile" type="file" label="Standard" ></q-file>
        <q-btn  class="float-left q-mr-md"  round unelevated color="primary" @click="getFile" icon="insert_photo" size="sm" /> 



       

        <q-btn  class="float-left q-mr-md"  round unelevated color="primary" icon="camera_alt" @click="initcamerahome()" size="sm" /> 


        <q-btn label="Publish" rounded unelevated type="submit" class="float-right" color="primary"/>
   </div>


      </q-form>


   
    

  </div>
</template>
          <q-card v-for="post in posts" :key="post.id" class="my-card" flat style="border:none;">

      <q-card-section class="no-shadow" horizontal>
        <q-card-section class="no-shadow">
           <q-avatar class="no-shadow">
            <img :src="post.avatar">
          </q-avatar>





        </q-card-section>

        <q-separator vertical style="display: none;" />

        <q-card-section class="col no-shadow">
           <q-item-label>{{ post.handle, post.user | handler}} <small> {{ post.date |niceDate }}</small></q-item-label>
        {{ post.message }}
          <div>

          <q-btn  class="float-right q-mr-md"  round unelevated color="primary" flat icon="chat_bubble_outline" size="sm" />
            <q-btn  class="float-right q-mr-md"  round unelevated color="primary" flat icon="repeat" size="sm" />

            <q-btn  class="float-right q-mr-md"  round unelevated color="primary" flat icon="favorite_border" size="sm" />
          
        </div>
        </q-card-section>
      </q-card-section>
    </q-card>




  </q-page>
</template>

<script>
  import { date } from 'quasar'
  require('md-gum-polyfill');
import { Picker } from 'emoji-mart-vue'

export default {
  name: 'PageHome',
  components:{
    Picker
  },
  data() {
    return {
      publishtext: '',
      emojiOn: false,
      activatevideohome: false,
      imageCaptured: false, 
      hasCamerasuport: true,
      homeembedimage: false,
      imagefile: '',
      newpost:{
        user: '',
        message: '',
        image: null,
        date: Date.now()
      },
      posts:[
      { id:1,
        user: "943fn139rvn",
        handle: "@benarc",
        avatar: "http://identicon.net/img/identicon.png",
        message:'@twitter, I will make you obsolete.',
        date: 1608148010951,
        likes: 5,
        retweets: 6
      },
      { id:2,
        user: "943fn139rvn",
        handle: "@benarc",
        avatar: "http://identicon.net/img/identicon.png",
        message:'Nostr is very badass, and sounds like "nos da", which means goodnight in Welsh.',
        date: 1608148010951,
        likes: 5,
        retweets: 6
      },
      { id:3,
        user: "943fn139rvn",
        handle: "@benarc",
        avatar: "http://identicon.net/img/identicon.png",
        message:'Images needed. Nostr wont work unless they can post pictures of badly cooked steak.',
        date: 1608148010951,
        likes: 5,
        retweets: 6
      }
    ]
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
      const vid = document.querySelector('video');
      const mediaStream = vid.srcObject;
      const tracks = mediaStream.getTracks();
      tracks.forEach(track => track.stop())
    },
    captureimageupload(file){
      console.log(this.imagefile)
      this.newpost.image = file
      

      let canvas = this.$refs.canvas
      let context = canvas.getContext('2d')

      var reader = new FileReader()
      reader.onload = event => {
        var img = new Image()
        img.onload = () => {

            canvas.width = 350 * (img.width / img.height)
            canvas.height = 350
            

            context.drawImage(img,0,0, canvas.width, canvas.height)
            this.imageCaptured = true
            this.homeembedimage = true
            this.newpost.imagetemp = canvas.toDataURL()
            console.log(this.newpost.imagetemp)

        }
        img.src = event.target.result
    }
    reader.readAsDataURL(file)
   
     
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


    VideoonSubmit(){

    },
    getFile () {
      this.$refs.myFileInput.$el.click()

    },
    initcamerahome(){
      this.activatevideohome = true
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(stream =>{
         this.$refs.video.srcObject = stream
      }).catch(error =>{
        activatevideohome = false
        this.$q.notify({
        message: 'No camera found :(',
        color: 'secondary'
      })
      })
    },
    discamerahome(){

      this.activatevideohome = false
      this.homeembedimage = false
      this.newpost.imagetemp = ''
      this.newpost.image = ''
      this.imageCaptured = false

    },
    photoverify(){
      this.homeembedimage = true
      this.activatevideohome = false
    },
    PublishonSubmit(){

    }

  },
  filters: {
    //prefer handle over user
    handler(value, value2){
     if (value != ''){
      return value
     } 
     else{
      return value2
     }
    },
    //make timestamp look nice
    niceDate(value){
      
      let formattedString = date.formatDate(value, 'YYYY MMM D h:mm A')
      return formattedString
    }
  }
}
</script>

