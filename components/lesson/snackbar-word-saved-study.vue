<template>
     <v-snackbar
      v-model="SnackBarWordSaved"
      :multi-line="multiLine"
      color="info"      
    >
      Palavra salva para estudo
      <v-btn
        color="white"
        text
        @click="$emit('hideSnackbarWordSavedStudy')"
      >      
        Close
      </v-btn>
    </v-snackbar>
</template>

<script>
export default {
    props: {
        SnackBarWordSaved: {
            type: Boolean,
            required: true
        }     
    },
    data: () =>  ({        
        multiLine: false,
        timeout: 1500
    }),
}
</script>

