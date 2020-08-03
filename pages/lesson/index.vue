<template>
  <v-container fluid class="grey lighten-5">
    <v-row class="mb-6" no-gutters>
      <v-col cols="11" sm="12" md="12" lg="12">
        <v-row class="mb-6" no-gutters>
          <v-col v-for="lesson in lessonsFiltered" :key="lesson._id" sm="3" md="3" lg="3">
            <v-card
              class="pa-2"
              outlined
              tile
              style="margin-right: 4px; margin-bottom: 4px;"
              :class="{ 'highlighted-card': lesson._id === lastUsedLessonId }"
              elevation="3"
              shaped
              height="350"
              @click="openLesson(lesson)"
              @contextmenu="show($event, lesson)"
            >
              <v-img height="200" width="200" :src="lesson.imageUrl" />
              <v-card-title>
                {{ lesson.title.length > 30 ? lesson.title.substr(0, 30) + ' ...' : lesson.title }}
              </v-card-title>
              <v-card-text>{{ lesson.fragment }} ...</v-card-text>
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
import * as apiService from '@/services/apiService'
import * as googleStorageApiService from '@/services/googleStorageApiService'

export default {
  async asyncData({ query }) {
    if (process.server) {
      const lessons = await apiService.getLessons(query)
      return {
        lessons,
        isSharedLessons: query.shared ? true : false,
      }
    }
  },
  data: () => ({
    lastUsedLessonId: null,
    rounded: true,
    lessonClicked: null,
    showMenu: false,
    x: 0,
    y: 0,
    query: '',
  }),
  computed: {
    lessonsFiltered: function () {
      if (this.query) {
        const regexString = new RegExp(this.query, 'i')
        return this.lessons.filter((lesson) => lesson.title.match(regexString))
      }
      return this.lessons
    },
    menuItems: function () {
      if (this.isSharedLessons) {
        return [{ title: 'Revisar', id: 'review' }]
      }

      return [
        { title: 'Editar', id: 'edit' },
        { title: 'Deletar', id: 'delete' },
        { title: 'Revisar', id: 'review' },
      ]
    },
  },
  created() {
    if (process.client) {
      this.$eventBus.$on('lessonSaved', async (lesson) => {
        this.lesson.imageUrl =
          '/images/lesson/lesson-default-' + (Math.floor(Math.random() * 4) + 1) + '.png'
        this.lessons.push(lesson)
      })
      this.$eventBus.$on('searchInLessons', (query) => {
        this.query = query
      })
    }
  },
  mounted() {
    this.lastUsedLessonId = localStorage.getItem('lastUsedLessonId')
  },
  methods: {
    openLesson(lesson) {
      localStorage.setItem('lastUsedLessonId', lesson._id)
      if (lesson.hasTopics) {
        if (this.isSharedLessons) {
          location.href = `${process.env.BASE_URL}/lesson/${lesson._id}/topic?shared=true`
          return
        }
        location.href = `${process.env.BASE_URL}/lesson/${lesson._id}/topic`
        return
      }
      location.href = `/lesson/${lesson._id}`
    },

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
        if (this.lessonClicked.audioUrl) {
          googleStorageApiService.deleteObjectOnLessonAudioBucket(this.lessonClicked.audioUrl)
        }
        await apiService.deleteLessonById(this.lessonClicked._id)
        const index = this.lessons.indexOf(this.lessonClicked)
        this.lessons.splice(index, 1)
      }

      if (menuItem.id === 'review') {
        location.href = `${process.env.BASE_URL}/review?lessonId=${this.lessonClicked._id}`
      }
    },
  },
}
</script>

<style scoped>
.highlighted-card {
  background: rgb(51, 128, 255) !important;
}
</style>
