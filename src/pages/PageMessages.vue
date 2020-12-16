<template>
  <q-page>
   <h6 class="q-ma-none">Messages</h6>


    <div class="column"  style="height: 450px; max-height: 100%">
      <div class="col-10" >
        
      </div>
      <div class="col-2" >
                   <q-form
      @submit="MessageonSubmit"
      class="q-gutter-md"
    >

     
    <q-input
    filled
    type="text"
      v-model="message.message"
      hint="500 char message"
      />


    <q-input

    filled
    type="text"
      v-model="message.publickey"
      hint="Recipients public key"
      lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Enter key'
        ]"
      >
          	 <template v-slot:after>
                <q-btn unelevated label="Send" type="submit" color="primary"/>
        </template>

         </q-input>

    

      <div>
  
      </div>
    </q-form>

      </div>
    </div>









  </q-page>
</template>

<script>
export default  {
  name: 'PageSettings',
   data () {
    return {
      name: null,
      age: null,
      message: {
      	data:{}
      },
      accept: false
    }
  },

  methods: {
    MessageonSubmit () {
      if (this.accept !== true) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'You need to accept the license and terms first'
        })
      }
      else {
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
        })
      }
    },

    MessageonReset () {
      this.name = null
      this.age = null
      this.accept = false
    }

  }
}
</script>