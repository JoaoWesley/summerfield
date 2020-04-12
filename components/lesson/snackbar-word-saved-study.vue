<template>
     <v-snackbar
      v-model="snackbar"
      :multi-line="multiLine"
      color="info"
      :timeout="timeout"
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
    created() {
      if(process.client) {
        this.$eventBus.$on('wordSavedForStudyEvent', (message) => {          
            this.snackbar = true;
        });
      }
    },

    data: () =>  ({        
        multiLine: false,
        timeout: 1500,
        snackbar: false
    }),
   
}
</script>

