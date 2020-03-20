<template>
  <div id="app">
    <router-view v-if="ReloadAction"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      ReloadAction: true
    };
  },
  methods: {
    reload() {
      this.ReloadAction = false;
      this.$nextTick(function() {
        this.ReloadAction = true;
      });
    }
  }
};
</script>

<style>
html,
body,
#app {
  /* margin-top: -10px; */
  height: 100%;
  width: 100%;
  margin:0;
  padding:0;
  border:0;
}
.selector-for-some-widget {
  box-sizing: content-box;
}
</style>

