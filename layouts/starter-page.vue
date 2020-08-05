<template>
  <v-app id="starter-page" class="bg-img">
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer dark padless>
      <v-card class="flex" flat tile>
        <v-card-text dark class="py-2 white--text text-center">
          {{ new Date().getFullYear() }} —
          <strong>Summerfield (BETA)</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
  }),
}
</script>

<style scoped>
.bg-img {
  background-image: url('~@/assets/index.jpg');
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
</style>
