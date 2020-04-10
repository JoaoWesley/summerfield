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
            <v-card flat >
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

                  <span class="title font-weight-light" style="color: black;" v-for="(token, index) in section.tokens"  v-bind:key="token.text + index" v-bind:style="[!checkIfTokenIsPunctuation(token) ? { 'margin-right': '4px'} : {'margin-left': '-4px', 'margin-right': '4px'}]" 
                    v-bind:class="{'new-word': (token.status === 'NEW' && token.type === 'WORD'), 'learning-word':(token.status === 'LEARNING' && token.type === 'WORD')}"
                  >
                     {{token.text}}                     
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
          style="min-height:35vw;"
        >
        <v-btn icon>
          <v-icon>mdi-play</v-icon>
        </v-btn>
        
        Language      
        
        
        <div style="min-height:15vw;">
          <v-row class="text-center">
            <v-col cols="12">
              <v-chip          
                class="ma-2"
                @click="something()"
                color="indigo"
                text-color="white"
                :input-value="true"
                label    
                style="width: 80%"
              >
                Linguagem
              </v-chip>
            </v-col>
          </v-row>
          
          <v-row class="text-center">
            <v-col cols="12">
              <v-chip
                class="ma-2"
                @click="something()"
                color="indigo"
                text-color="white"
                :input-value="true"
                label
                style="width: 80%"
              >
                Linguagem2
          
              </v-chip>
            </v-col>
          </v-row>

          <v-row class="text-center">
            <v-col cols="12">
              <v-chip
                class="ma-2"
                @click="something()"
                color="indigo"
                text-color="white"
                :input-value="true"
                label
                style="width: 80%"
              >
                Linguagem3
              </v-chip>
            </v-col>
          </v-row>
         
        </div>

        <br />
        <v-row class="text-center">
          <v-col cols="12">
            <v-chip
              class="ma-2 text-center"
              @click="getLesson($event)"
              color="teal"
              text-color="white"
              :input-value="true"
              filter 
            >
              Já sei essa palavra           
            </v-chip>
          </v-col>
        </v-row>        

        <div class="text-center">
            <v-btn rounded color="primary" dark>Criar tradução</v-btn>
        </div>

        </v-window>
      </v-col>
    </v-row>

  </v-row>
</template>

<script>
import axios from "axios";

export default {
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

    async getLesson (event) {
      event.preventDefault()
      const response = await axios.get(`${process.env.API_URL}/lesson/5e8a2be2cc036d5a274cf5ee`);
      this.lesson = response.data;      
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