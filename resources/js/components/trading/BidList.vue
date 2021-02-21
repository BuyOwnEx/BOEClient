<template>
    <div class="bids_container d-flex flex-column" style="height: 210px !important; overflow: hidden">
        <div class="bids_content" v-if="bid_list!==null">
            <bid-list-item
                    v-for="(bid,index) in bid_list"
                    :item="bid"
                    :index="index"
                    :key="bid.price"
                    :bid_volume="bid_volume_depth"
                    :currency="currency"
                    :market="market"
            ></bid-list-item>
        </div>
        <!--<bid-depth
                :amount="bid_amount_depth"
                :volume="bid_volume_depth"></bid-depth>-->
    </div>
</template>

<script>
    import BidListItem from './BidListItem.vue';
    export default {
        name: "BidList",
        components: {
            'bid-list-item': BidListItem,
        },
        props: ['currency', 'market', 'bid_list', 'bid_volume_depth', 'bid_amount_depth'],
    }
</script>

<style scoped>

</style>