<template>
  <v-row align="center">  
    <v-col cols="11" sm="12"  md="9" lg="9">
      <v-window
        v-model="window"
        class="elevation-1 $window-controls-top"
        :vertical="vertical"
        :show-arrows="showArrows"        
        :reverse="reverse"        
      >
        <v-window-item
          v-for="n in length"
          :key="n"          
        >   
        <v-row align="center">
          <v-col cols="1" sm="1"  md="1" lg="1"></v-col>
          <v-col cols="10" sm="10"  md="10" lg="10">
            <v-card flat >
              <v-card-text >
                <v-row class="mb-4" align="center">
                  <v-avatar color="grey" class="mr-4"></v-avatar>
                  <strong class="title">Title {{ n }}</strong>
                  <v-spacer></v-spacer>
                  <v-btn icon>
                    <v-icon>mdi-play-circle</v-icon>
                  </v-btn>
                </v-row>            
                <p class="title font-weight-light" style="color: black;">
                  Natural Language refers to a language that we, humans use for everyday communication such as English, Hindi, or Portuguese. In contrast to artificial languages such as programming languages, mathematical notations etc., natural languages keep evolving with every generation, thus are hard to pin down with explicit rules. Natural Language Processing covers any kind of computer manipulation of natural language. It could be as simple as counting word frequencies to compare different writing styles or it can involve comprehension of complete human utterances, at least to the extent of being able to respond with meaningful answers.
                </p>

                <p class="title font-weight-light" style="color: black;">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>               
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>  
        </v-window-item>
      </v-window>
    </v-col>
  </v-row>
</template>

<script>

export default {
    data: () => ({
      length: 3,
      window: 0,
      showArrows: true,
      vertical: false,
      reverse: false,
      autorun: false,
    }),

    created () {
      setInterval(() => {
        if (!this.autorun) return
        if (++this.window >= this.length) this.window = 0
      }, 1000)
    },
}
</script>
