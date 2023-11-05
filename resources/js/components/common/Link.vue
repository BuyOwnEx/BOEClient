<template>
    <router-link :to="path" v-if="this.$spa">
        <slot></slot>
    </router-link>
    <a :href="path" v-else>
        <slot></slot>
    </a>
</template>

<script>
export default {
    name: "Link",
    props: ['path']
}
</script>

<style scoped>

</style>
