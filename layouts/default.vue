<template>
  <v-app id="default">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
        <template v-for="item in items">
          <v-row v-if="item.heading" :key="item.heading" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col cols="6" class="text-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item v-for="(child, i) in item.children" :key="i" link>
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ child.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else :key="item.text" link @click="handleMenuItems(item)">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title style="width: 300px;" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">Summerfield</span>
      </v-toolbar-title>
      <v-text-field
        v-if="currentRoutePath === '/lesson/' || currentRoutePath === '/lesson'"
        v-model="search"
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Buscar lições"
        class="hidden-sm-and-down"
        :change="searchInLessons"
      />
      <v-spacer />
      <v-btn icon :title="`Você sabe ${wordsKnownCount} palavras em inglês`">
        <v-icon>mdi-counter</v-icon>
        {{ wordsKnownCount }}
      </v-btn>
      &nbsp;
      <v-btn icon large>
        <v-avatar size="32px" item>
          <v-img src="/favicon.ico" alt="Vuetify" title="Summerfield" />
        </v-avatar>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-btn
      bottom
      color="pink"
      dark
      fab
      fixed
      right
      @click="setDialogCreateLesson(!dialogCreateLesson)"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <DialogCreateLesson />

    <DialogImportEbook
      :show-dialog-import-ebook="showDialogImportEbook"
      @closeModal="showDialogImportEbook = false"
    />
  </v-app>
</template>

<script>
import DialogImportEbook from '@/components/lesson/dialog-import-ebook'
import DialogCreateLesson from '@/components/lesson/dialog-create-lesson'
import { mapGetters, mapActions } from 'vuex'
import * as apiService from '@/services/apiService'

export default {
  middleware: 'authMiddleware',
  components: {
    DialogImportEbook,
    DialogCreateLesson,
  },

  data: () => ({
    showDialogImportEbook: false,
    drawer: null,
    items: [
      { icon: 'mdi-pencil', text: 'Lições', id: 'lesson' },
      { icon: 'mdi-pencil', text: 'Lições compartilhadas', id: 'lessonShared' },
      { icon: 'fas fa-file upload', text: 'Importar ebook', id: 'importEbook' },
      { icon: 'mdi-history', text: 'Revisar palavras', id: 'reviewStudy' },
      { icon: 'mdi-message', text: 'Feedback', id: 'feedback' },
      { icon: 'mdi-logout', text: 'Sair', id: 'logout' },
    ],
    search: '',
    awaitingSearch: false,
  }),

  computed: {
    ...mapGetters({
      dialogCreateLesson: 'getDialogCreateLesson',
      getStatusReport: 'getStatusReport',
      currentRoutePath: 'getCurrentRoutePath',
    }),
    wordsKnownCount() {
      return this.getStatusReport.known.count
    },
  },

  watch: {
    search: function () {
      this.searchInLessons()
    },
  },

  methods: {
    ...mapActions({
      setDialogCreateLesson: 'setDialogCreateLesson',
    }),
    async handleMenuItems(item) {
      switch (item.id) {
        case 'lesson':
          location.href = `${process.env.BASE_URL}/lesson/`
          break
        case 'lessonShared':
          location.href = `${process.env.BASE_URL}/lesson?shared=true`
          break
        case 'importEbook':
          this.showDialogImportEbook = true
          break
        case 'reviewStudy':
          location.href = `${process.env.BASE_URL}/review/`
          break
        case 'feedback':
          location.href = `${process.env.BASE_URL}/feedback/`
          break
        case 'logout':
          await apiService.logout()
          location.href = `${process.env.BASE_URL}/`
          break
      }
    },

    searchInLessons() {
      if (!this.awaitingSearch) {
        setTimeout(() => {
          this.$eventBus.$emit('searchInLessons', this.search)
          this.awaitingSearch = false
        }, 1000) // 1 sec delay
      }
      this.awaitingSearch = true
    },
  },
}
</script>

<style>
textarea {
  cursor: pointer;
}

.normal-text-area textarea {
  cursor: text !important;
}
</style>
