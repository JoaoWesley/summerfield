<template>
  <!-- <v-layout column justify-center align-center /> -->
  <v-container class="fill-height" fluid>
    <LoginRegisterReset v-if="!this.token || this.showLoginForm" />
    <ResetPassword
      v-if="this.token  && !this.showLoginForm"
      :token="this.token"
      :userId="this.userId"
      v-on:showLoginForm="showLoginForm=true"
    />
  </v-container>
</template>

<script>
import LoginRegisterReset from '@/components/auth/login-register-reset'
import ResetPassword from '@/components/auth/reset-password'

export default {
  middleware ({ app, redirect, route }) {
    if (route.path === '/' && app.$cookiz.get('token')) {
      return redirect('/lesson')
    }
  },  
  asyncData({ query }) {
      return {
        token: query.token,
        userId: query.userId,
        showLoginForm: false
      }
  },  
  components: {
    LoginRegisterReset,
    ResetPassword
  },
  layout: 'starter-page'
}
</script>
