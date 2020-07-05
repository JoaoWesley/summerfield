<template>
    <v-card  >     
        <v-container style="background-color: #E5E5E5">
            <div v-if="item">
                <v-row align="center" justify="center">
                    <v-btn icon>
                        <v-icon>mdi-play-circle</v-icon>
                    </v-btn>
                </v-row>

                <v-row align="center" justify="center">
                    <v-col class="align-center justify-space-between" cols="8">                       
                        <v-text-field :label="item.wordContext" v-model="item.wordPhrase" readonly height="80" style="font: 50px"  ></v-text-field>                       
                    </v-col>
                </v-row>

                <v-row align="center" justify="center">
                    <v-btn text color="primary" @click="showAnswer = true">
                        Mostrar resposta
                    </v-btn>
                </v-row>

                <v-row align="center" justify="center">
                    <v-col class="align-center justify-space-between" cols="8" >                       
                        <v-text-field label="Tradução" v-if="showAnswer" v-model="item.translation" value="exemplo de tradução" height="80" readonly></v-text-field>
                    </v-col>
                </v-row>


                <v-row align="center" justify="center" v-if="showAnswer"> 
                    <v-col class="align-center " cols="2" >
                        <v-btn color="primary darken-1" @click="evaluateItem(5)">
                            FÁCIL
                        </v-btn>
                    </v-col>

                    <v-col class="align-center justify-space-between" cols="2">
                        <v-btn color="primary darken-1"  @click="evaluateItem(3)">
                            BOM
                        </v-btn>
                    </v-col>
                    <v-col class="align-center justify-space-between" cols="2">
                        <v-btn color="primary darken-1"  @click="evaluateItem(0)">
                            DIFÍCIL
                        </v-btn>
                    </v-col>
                </v-row>
            </div>    
                <v-row align="center" justify="center" > 
                    <v-col class="align-center justify-space-between" cols="8" >        
                        <v-alert type="success" height="80" prominent transition="scale-transition" v-show="!item">
                            Todos items foram revisado!
                        </v-alert>
                    </v-col>
                </v-row>
        </v-container>
    </v-card>
</template>

<script>
import * as apiService from '../../services/apiService'

export default {
    async asyncData({ query }) {
        if (process.server) {
            let studyItems = null
            if(!query.lessonId) {                
                studyItems = await apiService.getStudyItemsToReview()
            } else {                
                studyItems = await apiService.getStudyItemsToReviewByLessonId(query.lessonId)
            }   
            return {
                studyItems,
                item: studyItems.shift()
            }
        }
    },
    data: () => ({
        showAnswer: false        
    }),
    methods: {
        async evaluateItem(quality) {
            if(this.item.evaluation) {
                this.item.evaluation.quality = quality
            } else {
                this.item.evaluation = { quality }
            }
            await apiService.evaluateStudyItem(this.item)
            this.item = this.studyItems.shift()          
        }
    }
}
</script>

<style scoped>

</style>