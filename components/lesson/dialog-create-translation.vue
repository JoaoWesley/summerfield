<template>
    <v-dialog
      v-model="modalDialogCreateTranslation"
      width="800px"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Criar tradução
        </v-card-title>
        <v-container>
            <v-chip
                class="ma-2"                
                color="indigo"
                text-color="white"
                :input-value="true"
                label    
                style="min-width: 17%; justify-content: center"
                >
                {{ wordPhrase }}
            </v-chip>

          <v-row>
            <v-col cols="12" md="12">
              <v-textarea
                solo
                name="input-7-4"
                label="Insira sua tradução aqui."
                auto-grow
                outlined
                rounded
                v-model="translation"
              ></v-textarea>
            </v-col>
          </v-row>

        </v-container>

        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            color="primary"
            @click="closeModal"
          >Cancel</v-btn>
          <v-btn
            text
            @click="saveWordToStudy"
          >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import axios from "axios";
import wordStatusType from "@/commons/wordStatusType"

export default {
    props: {
        modalDialogCreateTranslation: {
            type: Boolean,
            required: true
        },
        wordTapped: {
            type: Object,
            required: true
        },
        studyItems: {
          type: Array,
          required: true
        },
        phraseSelected: {
          type: String,
          required: true
        },
        sectionTokens: {
          type: Array,
          required: true
        }
    },

    created() {
      if(process.client) {
        this.$eventBus.$on('wordSavedForStudyEvent', (message) => {  
          this.translation = message.translation;
        });
      }
    },

    data: function () {
      return {
        translation: null
      }
    },
    computed: {
      wordPhrase: function () {
        if(this.wordTapped && this.wordTapped.text) {
          return this.wordTapped.text
        }

        return this.phraseSelected
      }
    },
    watch: {
      wordTapped: function () {        
        this.translation = null;
        const wordAlreadyTranslated = this.studyItems.filter((item) => this.wordPhrase === item.wordPhrase);      
        if(wordAlreadyTranslated.length > 0) {
          this.translation = wordAlreadyTranslated.pop().translation;
        }
      },

      phraseSelected: function () {
        const phraseAlreadyTranslated = this.studyItems.filter((item) => this.wordPhrase === item.wordPhrase);      
        if(phraseAlreadyTranslated.length > 0) {
          this.translation = phraseAlreadyTranslated.pop().translation;
        }
      },

    },

    methods: {
        async closeModal() {          
          this.$emit('closeCreateTranslationModal');
        },

        async saveWordToStudy() {            
           const study = this.buildStudyObject();
            const response = await axios.post(`${process.env.API_URL}/study`, study);
            await this.updateWordStatus();
            this.closeModal();
        },

        buildStudyObject() {
          if(this.phraseSelected) {
            return {
              wordPhrase: this.phraseSelected,
              translation:  this.translation
            }
          }

          return {
             wordPhrase: this.wordTapped.text,
             translation:  this.translation,
             wordContext:  this.getWordContext()
          }
        },

        getWordContext () {
          const startIndex = this.wordTapped.index - 5 >= 0 
            ? this.wordTapped.index - 5 
            : 0
          const endIndex = this.wordTapped.index + 5 > this.sectionTokens[this.sectionTokens.length -1].index
            ? this.sectionTokens[this.sectionTokens.length -1].index
            : this.wordTapped.index + 7
        
          const contextRange = this.sectionTokens.slice(startIndex, endIndex);          
          const contextRangeWords = contextRange.map( (token) => token.text);
          let wordContext = '';

          if(this.wordTapped.index - 5 > 0) {
            wordContext = '...';
          }

          contextRangeWords.forEach( (word, index) => {
            const nextWord = contextRangeWords[index + 1];
            if(!nextWord){
              return;
            }
            wordContext += word;
            if(nextWord.match(/[a-z]+/) || (nextWord.match(/[0-9]+/))) {
                wordContext += ' ';
            }
          })

          if(endIndex < this.sectionTokens[this.sectionTokens.length -1].index) {
            wordContext += '...';
          }

          return wordContext;
        },

        async updateWordStatus() {
          if(!this.wordTapped || !this.wordTapped.text) {
            return;
          }

          this.wordTapped.status = wordStatusType.LEARNING;
          const wordObject = {
             words: [
               {
                 "text": this.wordTapped.text,
                 "status": wordStatusType.LEARNING,
               }
             ]
          }
          const response = await axios.post(`${process.env.API_URL}/word`, wordObject);
          this.$eventBus.$emit('wordSavedForStudyEvent', {
            wordPhrase: this.wordPhrase,
            translation: this.translation
          });
        }
    }
}
</script>