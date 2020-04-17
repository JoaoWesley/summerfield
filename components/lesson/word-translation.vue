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
            {{ wordOrPhraseTranlation }}
            </v-chip>
        </v-col>
    </v-row>
</template>

<script>
import axios from "axios";
import wordStatusType from "@/commons/wordStatusType"

export default {
    
    props: {
        wordOrPhraseTranlation: {
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
        sectionTokens : {
          type: Array,
          required: true
        }        
    },
    methods: {
        async saveWordToStudy() {            
            const study = this.buildStudyObject();           
            const response = await axios.post(`${process.env.API_URL}/study`, study);
            await this.updateWordStatus();
        },

        buildStudyObject() {
          if(this.phraseSelected) {
            return {
              wordPhrase : this.phraseSelected,
              translation:  this.wordOrPhraseTranlation
            }
          }          

          return {
             wordPhrase : this.wordTapped.text,
             translation:  this.wordOrPhraseTranlation,
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
           this.$eventBus.$emit('wordSavedForStudyEvent');
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