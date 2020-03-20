<!-- siteFooter.vue -->

<template>  
  <div class="breadcrumb">
        <ul>
            <li
            v-for="(breadcrumb, idx) in breadcrumbList"
            :key="idx"
            @click="routeTo(idx)"
            :class="{'linked': !!breadcrumb.link}">

            {{ breadcrumb.name }}

            </li>
        </ul>
    </div>
</template>

<script>
export default {
  name: 'Foot',
  data () {
    return {
     breadcrumbList: []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>