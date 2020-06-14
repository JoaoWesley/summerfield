import Vue from 'vue'
import VueSanitize from 'vue-sanitize'

const defaultOptions = {
  allowedTags: ['br'],
}

Vue.use(VueSanitize, defaultOptions)
