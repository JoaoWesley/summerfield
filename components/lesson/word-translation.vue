<template>
     <v-row class="text-center">
        <v-col cols="12">
            <v-chip          
                class="ma-2"
                @click="saveWordToStudy"
                color="indigo"
                text-color="white"
                :input-value="true"
                label    
                style="width: 80%"
                >
            {{ wordPhraseTranslation }}
            </v-chip>
        </v-col>
    </v-row>
</template>

<script>
import axios from "axios";
import wordStatusType from "@/commons/wordStatusType"

export default {    
    props: {
        wordPhraseTranslation: {
            type: String,
            required: true
        },
        wordTapped: {
            type: Object,
            required: true
        },
        phraseSelected: {
          type: String,
          required: true
        },
        sectionTokens: {
          type: Array,
          required: true
        },
        wordAlreadyTranslated: {
          require: true,
        }
    },
    methods: {
      async saveWordToStudy() {        
        const study = this.$studyService.buildStudyObject(
          this.phraseSelected, 
          this.wordPhraseTranslation,
          this.wordTapped,
          this.sectionTokens
        );

        if(this.wordAlreadyTranslated) {
            this.updateTranslation(study);
        }

        const response = await axios.post(`${process.env.API_URL}/study`, study);
        this.$eventBus.$emit('wordSavedForStudyEvent', {
          wordPhrase: this.wordTapped.text,
          translation: this.wordPhraseTranslation
        });

        if (this.wordTapped.status === wordStatusType.LEARNING || this.wordTapped.status === wordStatusType.KNOWN) {
          await this.updateWordStatus();
          return;
        }

        await this.saveWord();

      },

      async saveWord(word) {
        this.wordTapped.status = wordStatusType.LEARNING
        const response = await axios.post(`${process.env.API_URL}/word`, { words: [ this.wordTapped ] });
      },

      async updateTranslation(study) {
        const response = await axios.put(`${process.env.API_URL}/study`, study);
        this.$eventBus.$emit('wordSavedForStudyEvent', {
          wordPhrase: this.wordTapped.text,
          translation: this.wordPhraseTranslation
        });          
      },

      async updateWordStatus() {
        if(!this.wordTapped || !this.wordTapped.text)  {
          return;
        }        

        this.wordTapped.status = wordStatusType.LEARNING;       
        const response = await axios.put(`${process.env.API_URL}/word`, { word: this.wordTapped });
        this.$eventBus.$emit('wordStatusUpdated', {
          word: this.wordTapped.text,
          newStatus: wordStatusType.LEARNING
        });
      }
  }  
}
</script>

<style scoped>
  .new-word{
    background: rgb(175, 227, 241);    
  }
  .learning-word {
    background: rgb(255, 229, 120);
  }
  span {
    cursor:pointer;
    display: inline-block !important;    
  }
  span:hover {
    opacity: 0.8;
  }

</style>