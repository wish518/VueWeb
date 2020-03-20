<template>
  <div id="Slide" class="bg-info">
    <!-- <div class="side-bar col-md-2">
          <ul id="HomeSilde">
          <li>
            <router-link to="/HOME">Home</router-link>
          </li>
          <li>
            <router-link to="/HOME/TEST2">TEST</router-link>
          </li>
    </ul>-->
    <!--    <slot> default side bar content</slot> -->
    <!--  </div>
      <div class="content">
        <router-view></router-view>
    </div>-->
    <b-navbar toggleable="lg" type="light" variant="info">
      <!-- <b-navbar-brand  href="/HOME/TEST2">NavBar</b-navbar-brand> -->

      <router-link v-on:click.native="ClickRouter('HomeView')" to="/HOME">
        <div id="HomeView" class="tab">HOME</div>
      </router-link>

      <router-link v-on:click.native="ClickRouter('Work1')" to="/HOME/Work1">
        <div id="Work1" class="tab">Accounting</div>
      </router-link>

      <!-- <b-navbar-nav>
          <b-nav-item href="#">Link</b-nav-item>
          <b-nav-item href="#" disabled>Disabled</b-nav-item>
      </b-navbar-nav>-->

      <!-- Right aligned nav items  -->
      <b-navbar-nav class="ml-auto">
        <!-- <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form>-->

        <!-- <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
            <b-dropdown-item href="#">RU</b-dropdown-item>
            <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown>-->

        <b-nav-item-dropdown right :text="Name" id="User">
          <!--分隔相關菜單項組-->
          <b-dropdown-item @click.native="Logout" variant="danger">登出</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
    <!-- <slot></slot>
      <div class="content">c
        <router-view></router-view>
    </div>-->
  </div>
</template>

<script>
export default {
  name: "Slide",
  data() {
    return {
      Name: localStorage.getItem("UID_NAME")
    };
  },
  mounted() {
    let vm = this;
    console.log(this.Name);
    vm.ClickRouter(this.$route.name);
  },
  methods: {
    ClickRouter(e) {
      $(".tab").css("color", "white");
      $(".tab").css("font-size", "18px");
      $("#" + e).css("color", "red");
      $("#" + e).css("font-size", "24px");
    }
  }
};
</script>
<style>
#Slide {
  max-height: 50px;
  height: 50px;
  top: 100%;
}
.tab {
  color: white;
  padding-left: 50px;
  font-size: 18px;
  font-family: Comic Sans MS;
  position:relative;
}
.navbar {
  padding: 0px;
  padding-top: 8px;
}
#User {
  margin-right: 10px;
  font-weight: bold;
}
.navbar-nav .dropdown-menu {
  position: absolute !important;;
}
@media screen and (max-width: 420px) {
  .tab {
    font-size: 16px !important;
  }
  #User {
    font-size: 12px;
  }
}
@media screen and (max-width: 360px) {
  .tab {
    padding-left: 40px;
  }
}
@media screen and (max-width: 319px) {
  .tab {
    padding-top: 7px;
  }
  #User {
    display: none;
  }
  #Work1{
    top:8px;
    position: absolute;
  }
}
</style>