<template>
  <v-card style="width: 30%; min-height: 87vh;" raised outlined>
    <v-window
      class="elevation-1 $window-controls-top"
      :vertical="false"
      :reverse="false"
      style="height: 100%;"
    >
      <v-alert v-if="!wordTapped.text && !phraseSelected" type="info" style="height: 100%;">
        1 - Clique em qualquer palavra para ver a tradução.
        <br />
        <br />2 - Clique em uma tradução para salvar a palavra para estudo.
        <br />
        <br />3 - Também é possível criar a sua própria tradução. no botão 'Criar tradução'.
        <br />
        <br />4 - Palavras em branco são palavras conhecidas.
        <br />
        <br />5 - Palavras em azul são palavras novas.
        <br />
        <br />6 - Palavras em amarelo são palavras sendo estudadas.
        <br />
        <br />7 - Dica: Clique com o lado direto do mouse sobre a lição para executar ações como: editar, excluir e revisar.
        <br />
        <br />
      </v-alert>

      <div v-if="wordTapped.text || phraseSelected" style="height: 60%;">
        <v-row style="height: 10%; margin-bottom: 20px;">
          <v-col cols="2">
            <v-btn icon @click="playWordPhraseTapped">
              <v-icon>mdi-play-circle</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="10" style="margin-top: 6px;">
            <span style="word-break: break-all;">{{
              wordTapped.text ? wordTapped.text : phraseSelected
            }}</span>
          </v-col>
        </v-row>

        <div style="min-height: 50%;">
          <WordTranslation
            v-for="(wordPhraseTranslation, index) in wordPhraseTranslations"
            :key="wordPhraseTranslation.text + index"
            :word-phrase-translation="wordPhraseTranslation"
          />
        </div>

        <v-row class="text-center">
          <v-col
            v-if="
              wordPhraseHasTranslation &&
              wordPhraseTranslations.length == 1 &&
              wordPhraseTranslations[0].isPopularTranslation
            "
            cols="12"
          >
            <v-btn rounded color="primary" dark @click="showOtherTranslations">
              Mostrar outras traduções
            </v-btn>
          </v-col>
        </v-row>

        <v-row v-if="wordTapped.text" class="text-center">
          <v-col cols="12">
            <v-btn rounded color="primary" dark @click="openCambridgeDictionaryPopUp">
              Cambridge dictionary
              <v-icon right>
                mdi-search-web
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row v-if="wordTapped.text" class="text-center">
          <v-col cols="12">
            <v-btn rounded color="primary" dark @click="openUrbanDictionaryPopUp">
              Urban dictionary
              <v-icon right>
                mdi-search-web
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <br />
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
              @click="updateWordTappedStatusToKnown"
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
import { mapGetters, mapActions } from 'vuex'
import WordTranslation from '@/components/lesson/word-translation'

export default {
  components: {
    WordTranslation,
  },
  computed: {
    ...mapGetters({
      wordTapped: 'lesson/getWordTapped',
      wordPhraseTranslations: 'lesson/getWordPhraseTranslations',
      phraseSelected: 'lesson/getPhraseSelected',
      wordPhraseHasTranslation: 'lesson/getWordPhraseHasTranslation',
      modalDialogCreateTranslation: 'lesson/getModalDialogCreateTranslation',
    }),
  },
  methods: {
    ...mapActions({
      updateWordTappedStatusToKnown: 'lesson/updateWordTappedStatusToKnown',
      showOtherTranslations: 'lesson/showOtherTranslations',
    }),

    playWordPhraseTapped() {
      let speech = new SpeechSynthesisUtterance(this.wordTapped.text || this.phraseSelected)
      speech.lang = 'en-US'
      window.speechSynthesis.speak(speech)
    },

    openCambridgeDictionaryPopUp() {
      window.open(
        `https://dictionary.cambridge.org/us/dictionary/english/${this.wordTapped.text}`,
        'myWindow',
        'width=800,height=600'
      )
    },

    openUrbanDictionaryPopUp() {
      window.open(
        `https://www.urbandictionary.com/define.php?term=${this.wordTapped.text}`,
        'myWindow',
        'width=800,height=600'
      )
    },
  },
}
</script>
