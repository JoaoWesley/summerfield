<template>
  <v-container fluid class="grey lighten-5">
    <v-row class="mb-6" no-gutters>
      <v-col cols="11" sm="12" md="12" lg="12">
        <v-row class="mb-6" no-gutters>
          <v-col v-for="topic in topics" :key="topic.index" sm="3" md="3" lg="3">
            <v-card
              class="pa-2"
              outlined
              tile
              style="margin-right: 4px; margin-bottom: 4px;"
              elevation="3"
              shaped
              height="350"
              @click="openTopic(topic)"
              @contextmenu="show($event, topic)"
            >
              <v-img height="200" width="200" :src="topic.img" />
              <v-card-title> {{ topic.title }} </v-card-title>
              <v-card-text> {{ getTopicText(topic) }} </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
      <v-list rounded>
        <v-list-item
          v-for="(menuItem, index) in menuItems"
          :key="index"
          @click="menuOptionSelected(menuItem)"
        >
          <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  async asyncData({ params }) {
    if (process.server) {
      const topics = (await axios.get(`${process.env.API_URL}/lesson/${params.id}/lesson-topics/`))
        .data

      const imgs = []
      imgs.push(
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1909&q=80'
      )
      imgs.push(
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'
      )
      imgs.push(
        'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'
      )
      imgs.push('https://images.freeimages.com/images/large-previews/8d3/learn-1241297.jpg')

      topics.forEach((element) => {
        element.img = imgs[Math.floor(Math.random() * 4)]
      })
      return {
        topics,
        imgs,
        lessonId: params.id
      }
    }
  },
  data: () => ({
    //currentLesson: {},
    rounded: true,
    lessonClicked: null,
    showMenu: false,
    x: 0,
    y: 0,
    menuItems: [
      { title: 'Editar', id: 'edit' },
      { title: 'Deletar', id: 'delete' },
    ],
  }),  
  methods: {
    openTopic(topic) {
      location.href += `/${topic.index}`      
    },

    show(e, lesson) {      
      lesson.lessonId = this.lessonId
      this.lessonClicked = lesson
      e.preventDefault()
      this.showMenu = false
      this.x = e.clientX
      this.y = e.clientY
      this.$nextTick(() => {
        this.showMenu = true
      })
    },
    async menuOptionSelected(menuItem) {      
      if (menuItem.id === 'edit') {
        this.$eventBus.$emit('editLesson', this.lessonClicked)
      }
      if (menuItem.id === 'delete') {        
        await axios.delete(`${process.env.API_URL}/lesson/${this.lessonId}/lesson-topics?topicId=${this.lessonClicked.index}`)
        const index = this.topics.indexOf(this.lessonClicked)
        this.topics.splice(index, 1)
      }
    },

    getTopicText(topic) {      
      return topic.text.length < 30 ? topic.text : topic.text.substr(0, 27) + '...'
    },
  },
}
</script>
