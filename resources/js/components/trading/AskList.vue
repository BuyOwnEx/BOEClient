<template>
    <div class="asks_container d-flex flex-column justify-end" style="height: 210px !important; overflow: hidden">
        <div class="asks_content" v-if="ask_list!==null">
            <ask-list-item
                    v-for="(ask,index) in ask_list.slice().reverse()"
                    :item="ask"
                    :index="index"
                    :key="ask.price"
                    :ask_volume="ask_volume_depth"
                    :currency="currency"
                    :market="market"
            ></ask-list-item>
        </div>
        <!--<ask-depth
                :amount="ask_amount_depth"
                :volume="ask_volume_depth"></ask-depth>-->
    </div>
</template>

<script>
    import AskListItem from './AskListItem.vue';
    export default {
        name: "AskList",
        components: {
            'ask-list-item': AskListItem,
        },
        props: ['currency', 'market', 'ask_list', 'ask_volume_depth', 'ask_amount_depth'],
    }
</script>

<style scoped>

</style>