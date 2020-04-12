import Vue from 'vue'

const eventBus = new Vue()

export default ({ app }, inject) => {
  inject('eventBus', eventBus)
}
