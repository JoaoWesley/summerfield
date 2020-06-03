<template>
  <v-snackbar v-model="snackbar" :multi-line="multiLine" color="info" :timeout="timeout">
    Palavra salva para estudo
    <v-btn color="white" text @click="$emit('hideSnackbarWordSavedStudy')">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    multiLine: false,
    timeout: 1500,
    snackbar: false,
  }),
  created() {
    if (process.client) {
      this.$eventBus.$on('showSavedForStudySnackbarEvent', () => {
        this.snackbar = true
      })
    }
  },
}
</script>
