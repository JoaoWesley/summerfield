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
                @click="saveWordToStudy"
                color="indigo"
                text-color="white"
                :input-value="true"
                label    
                style="min-width: 17%; justify-content: center"
                >
                {{wordTapped ? wordTapped.text : null}}
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
                v-model="wordTranslation"
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
        }
    },

    data: function () {
        return {
            wordTranslation: null
        }
    },

    methods: {
        async closeModal() {          
          this.$emit('closeCreateTranslationModal');
        },

        async saveWordToStudy() {
            
            const study = {
                wordPhrase: this.wordTapped.text,
                translation: this.wordTranslation
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