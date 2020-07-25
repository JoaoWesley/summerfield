<template>
  <v-container class="fill-height" fluid>
    <LoginRegisterReset v-if="!token || showLoginForm" />
    <ResetPassword
      v-if="token && !showLoginForm"
      :token="token"
      :user-id="userId"
      @showLoginForm="showLoginForm = true"
    />
    <div class="bg-text">
      <h1>Aprenda inglês com conteúdo do seu interesse</h1>
    </div>
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

<style>
.bg-text {
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/opacity/see-through */
  color: white;
  font-weight: bold;
  border: 3px solid #f1f1f1;
  position: absolute;
  top: 70%;
  left: 50%;
  margin: 0 auto;
  transform: translate(-50%, -50%);
  width: 80%;
  padding: 20px;
  text-align: center;
}
</style>
