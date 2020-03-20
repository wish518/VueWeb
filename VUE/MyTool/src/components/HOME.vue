<template>
  <div id="HOME" style="min-height: 570px;">
    <div id="top">
      <b-carousel
        id="carousel-1"
        :interval="0"
        controls
        indicators
        background="#ababab"
        style="text-shadow: 1px 1px 2px #333;"
      >
        <b-carousel-slide :img-src="img1" ></b-carousel-slide>
        <b-carousel-slide :img-src="img2" ></b-carousel-slide>
      </b-carousel>
    </div>
      <Silde></Silde>
    <div id="content" :style="note">
      <router-view></router-view>
      <div class="clear" style="clear:both;"></div>
    </div>
  </div>
</template>

<script>
import Silde from "@/components/Common/Silde";
export default {
  name: "HOME",
  data() {
    return {
      msg: "HOME1",
      img1: require("../assets/下載.jpg"),
      img2: require("../assets/logo.png"),
      note: {
        height: "100%",
        width: "100%",
        backgroundImage: "url(" + require("../assets/Background/B6.jpg") + ")",
        backgroundSize: "contain",
        position:"relative",
        left: "0", // 这里是设置与左边的距离
        overflowX: "hidden",
        overflowY: "auto",
        minWidth: "320px"
        //backgroundRepeat: "repeat-y"
      }
    };
  },
  methods: {
    // Logout() {
    //   localStorage.removeItem("token");
    //   this.$router.push("/");
    // }
  },
  components: {
    Silde
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#HomeSilde {
  display: inline;
}
  #top {
    height: 360px ;
    width:  100% ;
    overflow:hidden;
  }
  #carousel-1 {
    height: 100vh ;
    width:  100vw ;
    overflow:hidden;
  }
  img:not(.md-image) {
    height: 360px !important;
    width: 6400px !important;
    min-width: 320px;
    min-height: 120px;
  }
@media screen and (max-height: 850px) {
  #top {
    height: 240px ;
  }
  img:not(.md-image) {
    height: 240px !important;
    width: 4800px !important;
  }
}
@media screen and (max-height: 700px) {
  #top {
    height: 220px ;
  }
  img:not(.md-image) {
    height: 220px !important;
    width: 4400px !important;
  }
}
@media screen and (max-height: 666px) {
  #top {
    height: 180px ;
  }
  img:not(.md-image) {
    height: 180px !important;
  }
}
@media screen and (max-height: 600px) {
  #top {
    height: 120px ;
  }
  img:not(.md-image) {
    height: 120px !important;
  }
}
#HOME {
  height: 100%;
  width: 100%;
    overflow:hidden;
}
</style>