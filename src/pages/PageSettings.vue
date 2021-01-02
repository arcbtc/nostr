<template>
  <q-page>
   
<h6 class="q-ma-none">Settings</h6>
     <div class="q-pa-md" style="max-width: 400px">

    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
   <p> If your desired handle is available our relay will use open-timestamps to secure it to your public key, and share it with other relays.</p>
    <q-input

    filled
    type="text"
      v-model="settings.handle"
      hint="Disired handle (3-10 chars)"
      lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Between 3 - 10 chars'
        ]"
      >
      	 <template v-slot:before>
          <q-icon name="alternate_email" />
        </template>

      </q-input>
    <q-input
    filled
    type="text"
      v-model="settings.pic"
      hint="Profile pic, 100px/100px imgur png"
      />

      <div>
        <q-btn unelevated label="Submit" type="submit" color="primary"/>
      </div>
    </q-form>
<br/><br/>
<q-separator />
<br/><br/>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
    <q-input
    filled
    type="text"
      v-model="settings.follow"
      autogrow
      hint="Batch follow input seperated by spaces"
      />
    <q-input
    filled
    type="textarea"
      v-model="settings.relays"
      autogrow
      hint="Relays seperated by spaces"
      />

      <div>
        <q-btn unelevated label="Submit" type="submit" color="primary"/>
      </div>
    </q-form>
 <br/><br/>
<q-separator />
<br/><br/>
<q-btn unelevated label="Delete Local Storage" @click="deletels" color="negative"/>
  </div>


  </q-page>
</template>

<script>
export default {
  name: 'PageSettings',
   data () {
    return {
      name: null,
      age: null,
      settings: {
      	data:{}
      },
      accept: false
    }
  },

  methods: {
    ProfileonSubmit () {
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

    ProfileonReset () {
      this.name = null
      this.age = null
      this.accept = false
    },
    RelaysonSubmit () {
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

    RelaysonReset () {
      this.name = null
      this.age = null
      this.accept = false
    },
    deletels(){
      this.$q.localStorage.clear()
      window.location.reload()
    }

  }
}
</script>