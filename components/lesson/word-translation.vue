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
            {{ wordTranslation }}
            </v-chip>
        </v-col>
    </v-row>
</template>

<script>
import axios from "axios";
import wordStatusType from "@/commons/wordStatusType"

export default {
    
    props: {
        wordTranslation: {
            type: String,
            required: true
        },
        wordTapped: {
            type: Object,
            required: true
        }
    },
    methods: {
        async saveWordToStudy() {
            const study = {
                wordPhrase: this.wordTranslation,
                translation: this.wordTapped.text
            }
            const response = await axios.post(`${process.env.API_URL}/study`, study);
            await this.updateWordStatus();
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