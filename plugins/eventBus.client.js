import Vue from 'vue'

const eventBus = new Vue()

// eslint-disable-next-line
export default ({ app }, inject) => {  
  inject('eventBus', eventBus)
}
