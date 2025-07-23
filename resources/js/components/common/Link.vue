<template>
    <router-link :to="path">
        <slot></slot>
    </router-link>
</template>

<script>
export default {
    name: "Link",
    props: ['path']
}
</script>

<style scoped>

</style>
