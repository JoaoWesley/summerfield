<template>
  <v-container fluid class="grey lighten-5">
    <v-row class="mb-6" no-gutters>
      <v-col cols="11" sm="12" md="12" lg="12">
        <v-row class="mb-6" no-gutters>
          <v-col v-for="lesson in lessons" :key="lesson.title" sm="3" md="3" lg="3">
            <v-card
              class="pa-2"
              outlined
              tile
              style="margin-right: 4px; margin-bottom: 4px;"
              elevation="3"
              :href="'/lesson/' + lesson._id"
              shaped
              height="350"
              @contextmenu="show($event, lesson)"
            >
              <v-img height="200" width="200" :src="lesson.img" />
              <v-card-title> {{ lesson.title }} </v-card-title>
              <v-card-text> {{ getLessonText(lesson) }} </v-card-text>
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
  async asyncData({ req }) {
    if (process.server) {
      const lessons = (
        await axios.get(`${process.env.API_URL}/lesson/`, {
          headers: req.headers,
        })
      ).data
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

      lessons.forEach((element) => {
        element.img = imgs[Math.floor(Math.random() * 4)]
      })
      return {
        lessons,
        imgs,
      }
    }
  },
  data: () => ({
    currentLesson: {},
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
  created() {
    if (process.client) {
      this.$eventBus.$on('lessonSaved', (lesson) => {
        lesson.img = this.imgs[Math.floor(Math.random() * 4)]
        this.lessons.push(lesson)
      })
    }
  },
  methods: {
    show(e, lesson) {
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
        await axios.delete(`${process.env.API_URL}/lesson/${this.lessonClicked._id}`)
        const index = this.lessons.indexOf(this.lessonClicked)
        this.lessons.splice(index, 1)
      }
    },

    getLessonText(lesson) {
      return lesson.text.length < 30 ? lesson.text : lesson.text.substr(0, 27) + '...'
    },
  },
}
</script>
