<template>
  <!-- <v-layout column justify-center align-center /> -->
  <v-container class="fill-height" fluid>
    <LoginRegisterReset v-if="!token || showLoginForm" />
    <ResetPassword
      v-if="token && !showLoginForm"
      :token="token"
      :user-id="userId"
      @showLoginForm="showLoginForm = true"
    />
  </v-container>
</template>

<script>
import LoginRegisterReset from '@/components/auth/login-register-reset'
import ResetPassword from '@/components/auth/reset-password'

export default {
  middleware({ app, redirect, route }) {
    if (route.path === '/' && app.$cookiz.get('token')) {
      return redirect('/lesson')
    }
  },
  components: {
    LoginRegisterReset,
    ResetPassword,
  },
  asyncData({ query }) {
    return {
      token: query.token,
      userId: query.userId,
      showLoginForm: false,
    }
  },
  layout: 'starter-page',
}
</script>
