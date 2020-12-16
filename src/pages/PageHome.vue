<template>
  <q-page>

<template>


    <div class="row" style="width:100%">
    	      


    <q-form
    style="width:100%"
      @submit="onSubmit"
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
      <div class="float-right" >
       <q-btn  class="float-left q-mr-md"  round color="primary" icon="insert_emoticon" size="sm" /> <q-btn  class="float-left q-mr-md"  round color="primary" icon="camera" size="sm" /> <q-btn label="Publish" rounded type="submit" class="float-right" color="primary"/>
   </div>


      </q-form>
   
    

  </div>
</template>





  </q-page>
</template>

<script>
export default {
  name: 'PageHome'
}
</script>
