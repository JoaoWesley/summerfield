<template>
  <v-card style="width: 30%; min-height: 87vh;" raised outlined>
    <v-window
      class="elevation-1 $window-controls-top"
      :vertical="false"
      :reverse="false"
      style="height: 100%;"
    >
      <v-alert v-if="!wordTapped.text && !phraseSelected" type="info" style="height: 100%;">
        1 - Clique em qualquer palavra para ver a tradução.<br /><br />
        2 - Clique em uma tradução para salvar a palavra para estudo.<br /><br />
        3 - Também é possível criar a sua própria tradução. no botão 'Criar tradução'.<br /><br />
        4 - Palavras em branco são palavras conhecidas.<br /><br />
        5 - Palavras em azul são palavras novas.<br /><br />
        6 - Palavras em amarelo são palavras sendo estudadas.<br /><br />
      </v-alert>

      <div v-if="wordTapped.text || phraseSelected" style="height: 60%;">
        <v-row style="height: 10%; margin-bottom: 20px;">
          <v-col cols="2">
            <v-btn icon>
              <v-icon>mdi-play-circle</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="10" style="margin-top: 6px;">
            <span style="word-break: break-all;">
              {{ wordTapped.text ? wordTapped.text : phraseSelected }}
            </span>
          </v-col>
        </v-row>

        <div style="min-height: 50%;">
          <WordTranslation
            v-for="(wordPhraseTranslation, index) in wordPhraseTranslations"
            :key="wordPhraseTranslation + index"
            :word-phrase-translation="wordPhraseTranslation"
          />
        </div>

        <v-row class="text-center">
          <v-col v-if="wordAlreadyTranslated && wordPhraseTranslations.length == 1" cols="12">
            <v-btn rounded color="primary" dark @click="showOtherTranslations">
              Mostrar outras traduções
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <br />
      <div v-if="wordTapped.text || phraseSelected" style="height: 40%;">
        <v-row class="text-center">
          <v-col cols="12">
            <v-chip
              class="ma-2 text-center"
              color="teal"
              text-color="white"
              :input-value="true"
              filter
              @click="updateWordStatusToKnown"
            >
              Já sei essa palavra
            </v-chip>
          </v-col>
        </v-row>
        <br />
        <div class="text-center">
          <v-btn
            rounded
            color="primary"
            dark
            @click="$store.dispatch('lesson/setModalDialogCreateTranslation', true)"
          >
            Criar tradução
          </v-btn>
        </div>
      </div>
    </v-window>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import WordTranslation from '@/components/lesson/word-translation'
import wordStatusType from '@/commons/wordStatusType'
import axios from 'axios'

export default {
  components: {
    WordTranslation,
  },
  computed: {
    ...mapGetters({
      wordTapped: 'lesson/getWordTapped',
      wordPhraseTranslations: 'lesson/getWordPhraseTranslations',
      phraseSelected: 'lesson/getPhraseSelected',
      wordAlreadyTranslated: 'lesson/getWordAlreadyTranslated',
      modalDialogCreateTranslation: 'lesson/getModalDialogCreateTranslation',
    }),
  },
  methods: {
    async updateWordStatusToKnown() {
      // se é status é NEW não existe palara no armazenada ainda
      if (this.wordTapped.status === wordStatusType.NEW) {
        this.$store.dispatch('lesson/setWordTapped', {
          text: this.wordTapped.text,
          status: wordStatusType.KNOWN,
        })
        await axios.post(`${process.env.API_URL}/word`, {
          words: [this.wordTapped],
        })
        this.$eventBus.$emit('wordStatusUpdated', {
          word: this.wordTapped.text,
          newStatus: wordStatusType.KNOWN,
        })
        return
      }
      this.$store.dispatch('lesson/setWordTapped', {
        text: this.wordTapped.text,
        status: wordStatusType.KNOWN,
      })

      await axios.put(`${process.env.API_URL}/word`, {
        word: this.wordTapped,
      })
      this.$eventBus.$emit('wordStatusUpdated', {
        word: this.wordTapped.text,
        newStatus: wordStatusType.KNOWN,
      })
    },

    showOtherTranslations() {
      //chamar api de traducao.
      this.$store.dispatch('lesson/setWordPhraseTranslations', [
        ...this.wordPhraseTranslations,
        'Another Translation',
        'Mais uma Translation',
      ])
    },
  },
}
</script>
