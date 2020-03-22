<template >    
    <v-container fluid  class="grey lighten-5"  >
        <v-row 
            class="mb-6"
            no-gutters
            >

            <v-col cols="11" sm="12"  md="9" lg="9">
                <v-row 
                    class="mb-6"
                    no-gutters   >   
                    <v-col    sm="3"  md="3" lg="3" v-for="lesson in lessons" :key="lesson.title">
                        <v-card
                            class="pa-2"
                            outlined
                            tile
                            style="margin-right: 4px; margin-bottom: 4px;"
                            elevation=3
                            href="haskjahsj"
                            shaped
                            height="350"
                            
                        >
                            <v-img
                                height="200"
                                width="200"
                                :src="lesson.img"                                    
                            ></v-img>
                            <v-card-title> {{ lesson.title }} </v-card-title>                            
                            <v-card-text > {{lesson.text.length < 30 ? lesson.text : lesson.text.substr(0, 27) + '...'}} </v-card-text>
                            
                            
                        </v-card>
                    </v-col>
                </v-row>     
            </v-col>
            
        </v-row>
    </v-container>  
</template>

<script>

export default {
    data: () => ({
        lessons: [
            {title: 'Tyrion', description: 'Tyrion and cersein in kingslanding', text:'The queen was not disposed to wait on Varys.', img: 'https://images.freeimages.com/images/large-previews/8d3/learn-1241297.jpg'},
            {title: 'Title2', description: 'Some description2', text:'Part of the text2', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1909&q=80'},
            {title: 'Title3', description: 'Some description3', text:'Part of the text3', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'},
            {title: 'Title4', description: 'Some description4', text:'Part of the text4', img: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'},
            {title: 'Title5', description: 'Some description4', text:'Part of the text4', img: 'https://images.freeimages.com/images/large-previews/8d3/learn-1241297.jpg'},
        ]    
    })
}
</script>
