<template>
  <v-container fluid class="grey lighten-5">
    <v-row class="mb-6" no-gutters>
      <v-col cols="11" sm="12" md="12" lg="12">
        <v-row class="mb-6" no-gutters>
          <v-col v-for="topic in lessonTopics" :key="topic.index" sm="3" md="3" lg="3">
            <v-card
              class="pa-2"
              outlined
              tile
              style="margin-right: 4px; margin-bottom: 4px;"
              :class="{
                'highlighted-card':
                  lessonId === lastUsedTopic.lessonId && topic.index === lastUsedTopic.index,
              }"
              elevation="3"
              shaped
              height="350"
              @click="openTopic(topic)"
              @contextmenu="show($event, topic)"
            >
              <v-img height="200" width="200" :src="topic.imageUrl" />
              <v-card-title>{{ topic.title }}</v-card-title>
              <v-card-text>{{ getTopicText(topic) }}</v-card-text>
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
import { mapGetters } from 'vuex'
import * as sectionsStorageService from '@/services/sectionsStorageService'

export default {
  async asyncData({ params, store }) {
    if (process.server) {
      await store.dispatch('lesson/fetchLessonTopics', params.id)
      return {
        lessonId: params.id,
      }
    }
  },
  data: () => ({
    lastUsedTopic: {},
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

  computed: {
    ...mapGetters({
      lessonTopics: 'lesson/getLessonTopics',
    }),
  },

  mounted() {
    if (localStorage.getItem('lastUsedTopic')) {
      this.lastUsedTopic = sectionsStorageService.getLastUsedTopic()
    }
  },
  methods: {
    openTopic(topic) {
      location.href += `/${topic.index}`
      sectionsStorageService.setLastUsedTopic(this.lessonId, topic.index)
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
        await axios.delete(
          `${process.env.API_URL}/lesson/${this.lessonId}/lesson-topics?topicId=${this.lessonClicked.index}`,
          { withCredentials: true }
        )
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

<style scoped>
.highlighted-card {
  background: rgb(51, 128, 255) !important;
}
</style>
