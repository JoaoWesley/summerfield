<template>
  <v-container class="fill-height" fluid>
    <v-row class="mx-2">
        <v-col class="align-center justify-space-between" cols="12" md="12">
            <LoginRegisterReset v-if="!token || showLoginForm" />
        </v-col>
    </v-row>

    <v-row class="mx-2">
        <v-col class="align-center justify-space-between" cols="12" md="12">
           <ResetPassword
            v-if="token && !showLoginForm"
            :token="token"
            :user-id="userId"
            @showLoginForm="showLoginForm = true"
          /> 
        </v-col>
    </v-row>

    <v-row class="mx-2">
        <v-col class="align-center justify-space-between" cols="12" md="12">
              <div class="bg-text" >
                <h1>Aprenda inglês com conteúdo do seu interesse</h1>
            </div>         
        </v-col>
    </v-row>


    
   
  
  </v-container>
</template>

<script>
import LoginRegisterReset from '@/components/auth/login-register-reset'
import ResetPassword from '@/components/auth/reset-password'

export default {
  middleware({ app, redirect, route }) {
    if (route.path === '/' && app.$cookiz.get('token')) {
      return redirect('/lesson?shared=true')
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
  width: 80%;
  padding: 20px;
  text-align: center;
}
</style>
