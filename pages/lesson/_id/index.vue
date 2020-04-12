<template>
  <v-row align="center">  
    <v-col cols="11" sm="12"  md="9" lg="9">
      <v-window
       v-model="window"
        class="elevation-1 $window-controls-top"
        :vertical="vertical"
        :show-arrows="showArrows"
        :reverse="reverse"
        style="min-height:35vw;"
      >
        <v-window-item
          v-for="(section, index) in lesson.sections"
          :key="index"
        >   
          <v-row align="center">
            <v-col cols="1" sm="1"  md="1" lg="1"></v-col>
            <v-col cols="10" sm="10"  md="10" lg="10">
              <v-card flat style="min-height:35vw;">
                <v-card-text >
                  <v-row class="mb-4" align="center">
                    <v-avatar color="grey" class="mr-4"></v-avatar>
                    <strong class="title">{{lesson.title}}</strong>
                    <v-spacer></v-spacer>
                    <!-- <v-btn icon>
                      <v-icon>mdi-play-circle</v-icon>
                    </v-btn> -->
                  </v-row>
                  <p>

                    <span 
                      class="title font-weight-light"
                      style="color: black;"
                      @click="translateWord(token)" 
                      v-for="(token, index) in section.tokens"  
                      v-bind:key="token.text + index" 
                      v-bind:style="[!checkIfTokenIsPunctuation(token) 
                        ? { 'margin-right': '4px'} 
                        : {'margin-left': '-4px', 'margin-right': '4px'}]" 
                      v-bind:class="{
                        'new-word': (token.status === 'NEW' && token.type === 'WORD'), 
                        'learning-word':(token.status === 'LEARNING' && token.type === 'WORD')
                        }"
                    >
                      {{ token.text }}
                    </span>

                  </p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-col>

    <v-row >  
      <v-col cols="12" sm="12"  md="12" lg="12">
        <v-window
          v-model="window"
          class="elevation-1 $window-controls-top"
          :vertical="vertical"
          :reverse="reverse"
          style="min-height:36.65vw;"
        >
          <v-btn icon>
            <v-icon>mdi-play</v-icon>
          </v-btn>

          Language

          <div style="min-height:15vw;">
            <WordTranslation 
              :wordTranslation="wordTranslation" 
              :wordTapped="wordTapped" 
              v-for="(wordTranslation, index) in wordTranslations" 
                :key="wordTranslation + index" 
              v-on:wordSavedForStudyEvent="SnackBarWordSaved = true"
              />
          </div>

          <br />
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

          <div class="text-center">
              <v-btn rounded color="primary" dark @click="modalDialogCreateTranslation = true">Criar tradução</v-btn>
          </div>

        </v-window>
      </v-col>
    </v-row>

   <SnackbarWordSavedStudy 
    v-bind:SnackBarWordSaved="SnackBarWordSaved"
    v-on:hideSnackbarWordSavedStudy="SnackBarWordSaved = false"    
    />

  <DialogCreatetranslation 
    :modalDialogCreateTranslation="modalDialogCreateTranslation"
    :wordTapped="wordTapped"
  />
  </v-row>

</template>

<script>
import axios from "axios";
import wordStatusType from "@/commons/wordStatusType"
import WordTranslation from "@/components/lesson/word-translation"
import SnackbarWordSavedStudy from "@/components/lesson/snackbar-word-saved-study"
import DialogCreatetranslation from "@/components/lesson/dialog-create-translation"

export default {
  components: {
    WordTranslation,
    SnackbarWordSavedStudy,
    DialogCreatetranslation
  },

  async asyncData({req, res}){
  if (process.server) {
    const lesson =  (await axios.get(`${process.env.API_URL}/lesson/5e8a848bcc036d5a274cf5f1`, {headers: req.headers})).data
    let sections = []    

    const getSections = (sections, tokens) => {
      if(tokens.length === 0) return
      sections.push({tokens: tokens.splice(0, 107)})
      return getSections(sections, tokens)
    }

    getSections(sections, lesson.tokens)
    
    lesson.sections = sections      

    return {
      lesson
    }
  }
	},

  data: () => ({
    length: 3,
    window: 0,
    showArrows: true,
    vertical: false,
    reverse: false,
    autorun: false,
    wordTranslations: [],
    wordTapped: {},
    SnackBarWordSaved: false,
    modalDialogCreateTranslation: false,
    var1: 'variabel1',
    var2: null
  }),

  created () {
  },
  methods:{
    checkIfTokenIsPunctuation(token) {
      if(!token) {
        return false
      }

      return !token.text.match(/[a-z]+/) && !(token.text.match(/[0-9]+/))
    },

    async translateWord(token) {      
      this.var2 = 'variable2';
      this.wordTapped = token;
      //chmar api que vai retornar traducão da palavra
      this.wordTranslations = ['Linguagem', 'Lingua', 'Idioma'];
    },

    async updateWordStatusToKnown() {
      this.wordTapped.status = wordStatusType.KNOWN
        const wordObject = {
            words: [
               {
                 "text": this.wordTapped.text,
                 "status": wordStatusType.KNOWN,
               }
            ]
        }
        const response = await axios.post(`${process.env.API_URL}/word`, wordObject);
    }
  },
  watch : { 
    modalDialogCreateTranslation: function () {
      console.log('asasas')  
    }    
  }
}
</script>

<style scoped>
  .new-word{
    background: rgb(175, 227, 241);
    /* background:  rgb(255, 140, 0) Orange alternative*/
  }
  .learning-word {
    background: rgb(255, 229, 120);
  }
  span {
    cursor:pointer;
    display: inline-block !important;
    margin-bottom: 10px !important;
    border-radius: 5px;
  }
  span:hover {
    opacity: 0.8;
  }

</style>