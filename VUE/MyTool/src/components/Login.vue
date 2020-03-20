<template>
  <div id="Login" :style="note">
    <div id="LoginBG" :style="BG">
      <!--<img src="./assets/logo.png">
                <nav>
                <router-link to="/HelloWorld">首頁</router-link>
                <router-link to="/TEST">連結二</router-link>
              <router-view/> 
              </nav>
      <SiteFooter></SiteFooter>-->
      <div :style="'height:'+this.EmptyDivheight" />
      <div id="ID" class="Login">
        使用者帳號:
        <input
          id="ID_T"
          class="InputLogin"
          type="text"
          maxlength="20"
          @keyup="VaildateE('ID',LoginData.ID)"
          @blur="VaildateE('ID',LoginData.ID)"
          v-model.trim="LoginData.ID"
          value="ID"
        />
      </div>
      <div id="PASSWORD" class="Login">
        密碼:
        <input
          type="password"
          class="InputLogin"
          maxlength="20"
          v-model.trim.lazy="LoginData.PASSWORD"
          @keyup="VaildateE('PASSWORD',LoginData.PASSWORD)"
          @blur="VaildateE('PASSWORD',LoginData.PASSWORD)"
        />
      </div>
      <div id="MSG" class="Login" v-html="MESSAGE"></div>
      <div class="Login">
        <div>
          <md-button class="md-raised md-primary" @click="Login">登入</md-button>
        </div>
        <md-button class="md-raised md-accent" @click="RegisteredJump">註冊</md-button>
      </div>
      <!--------------b-modal-------------------->
      <b-modal
        size="sm"
        title="使用者尚未驗證"
        header-bg-variant="secondary"
        header-text-variant="light"
        body-bg-variant="warning"
        content-class="shadow"
        v-model="modalShow"
        ok-only
        hide-footer
      >
        <div v-html="MESSAGE"></div>
        <div>
          或點選
          <a href="javascript:void(0)" @click="OpenResendPage">重新寄發驗證信</a>
        </div>
      </b-modal>

      <b-modal
        id="b-modal2"
        size="sm"
        title="重新寄發驗證信"
        header-bg-variant="secondary"
        header-text-variant="light"
        body-bg-variant="warning"
        content-class="shadow"
        v-model="IsResend"
        ok-only
        hide-footer
      >
        <div class="text-center" v-if="Readyiframe" :style="BG_b_modal2">
          <b-spinner
            id="DateReady"
            style="width: 3rem; height: 3rem; margin-top:50px;"
            label="Spinning"
          ></b-spinner>
        </div>
        <div :style="'display:'+DivResendMail">
          <iframe
            :src="this.JumpPath+'/DTW_Business/ResendMail/'+this.UID+'/'+this.Email"
            style="border:none; height:150px"
            scrolling="no"
            @load="iframeLoad"
          ></iframe>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { TextBox } from "../JS/TextBox";
export default {
  mixins: [TextBox],
  name: "Login",
  created() {
    document.title = "歡迎來到東方神秘世界";
  },
  mounted() {},
  data() {
    return {
      MESSAGE: "",
      modalShow: false,
      IsResend: false,
      Readyiframe: true,
      DivResendMail: "none",
      LoginData: {
        ID: "",
        PASSWORD: ""
      },
      UID: "",
      Email: "",
      Registered: this.JumpPath + "/DTW_Business/Login/Registered",
      EmptyDivheight: "33.7%",
      note: {
        height: "100%",
        width: "100%",
        background: "#704214",
        minWidth: "320px",
        minHeight: "570px",
        top: "0", // 这里是设置与顶部的距离
        left: "0", // 这里是设置与左边的距离
        overflowX: "hidden",
        overflowY: "auto"
      },
      BG: {
        backgroundImage: "url(" + require("../assets/Background/B18.jpg") + ")",
        backgroundSize: "100% 100%"
      },
      BG_b_modal2: {
        backgroundImage:
          "url(" + require("../assets/Background/Paper.jpg") + ")",
        backgroundSize: "320px 510px",
        height: "150px"
      }
    };
  },
  methods: {
    Login() {
      let vm = this;
      console.log("驗證使用者資料");
      $.ajax({
        type: this.type, //傳送方式
        url: this.CoreAPI_URL + "ChkLogin" + this.API, //傳送目的地
        contentType : 'application/json',
        dataType: "json", //資料格式
        data:  JSON.stringify(this.LoginData),
        success: function(data) {
          if (data.IS_Error === "N") {
            vm.MESSAGE = "";
            localStorage.setItem("token", "ImLogin");
            localStorage.setItem("ID", data.Data.Id);
            localStorage.setItem("UID", data.UID);
            localStorage.setItem("Token", data.Token);
            if (sessionStorage.getItem("IsLogin") != "Y") {
              alert(data.MSG);
              vm.$router.push("/HOME");
            } else
            {
              sessionStorage.removeItem("IsLogin");
              window.location =vm.JumpPath +"/DTW_Business";
            }
          } else if (data.Status === "01") {
            vm.UID = data.Data.Uid;
            vm.Email = data.Data.Email;
            vm.MESSAGE = data.MSG;
            if (window.innerHeight <= 850) vm.modalShow = true;
          } else {
            //document.getElementById("MSG").innerHTML = data.MSG;
            vm.MESSAGE = data.MSG;
            if (window.innerHeight <= 850) alert(data.MSG);
          }
        },
        error: function(key, value) {
          alert("發生錯誤 API讀取失敗 QQ");
        }
      });
    },
    VaildateE: function(e, value) {
      let vm = this;
      vm.LoginData[e] = this.TextValidateE(e, value);
    },
    RegisteredJump() {
      window.location.href = this.Registered;
    },
    OpenResendPage() {
      console.log("載入頁面中");
      this.modalShow = false;
      this.IsResend = true;
      this.Readyiframe = true;
      this.DivResendMail = "none";
    },
    iframeLoad() {
      console.log("載入頁面完成");
      this.Readyiframe = false;
      this.DivResendMail = "block";
    }
  }
  /*components: {
      Foot        // 宣告組件
    }*/
};
</script>

<style>
#Login {
  background-size: 100% 100%;
  margin: 0;
  padding: 0;
  border: 0;
}
#LoginBG {
  width: 100%;
  height: 100%;
  min-width: 320px;
  min-height: 570px;
}

.Login {
  margin-left: 30%;
}

.InputLogin {
  width: 35%;
  position: absolute;
  margin-left: 5px;
}

#ID {
  display: block;
  width: 100%;
  font-family: DFKai-sb;
  ime-mode: disabled;
  font-weight: bold;
}

#PASSWORD {
  width: 100%;
  padding-left: 43px;
  margin-top: 15px;
  display: block;
  font-family: DFKai-sb;
  ime-mode: disabled;
  font-weight: bold;
}

#MSG {
  margin-top: 8px;
  margin-bottom: 5px;
  display: block;
  width: 500px;
  font-size: 14px;
  font-family: DFKai-sb;
  font-weight: bold;
  color: red;
}

.md-raised {
  width: 63%;
}
.modal-body {
  padding: 0px !important;
}
.modal-sm {
  max-width: 300px;
  min-width: 300px;
  margin: 1.75rem auto !important;
}

@media screen and (min-width: 580px) {
  #LoginBG {
    width: 580px;
    left: 50%;
    position: absolute;
    margin-left: -290px;
  }
  .InputLogin {
    width: 176px;
  }
}

@media screen and (max-width: 580px) {
  .Login {
    margin-left: 23%;
  }
  .InputLogin {
    width: 36.5%;
  }
  .md-raised {
    width: 65%;
  }
}

@media screen and (max-width: 520px) {
  .InputLogin {
    width: 33%;
  }
  .md-raised {
    width: 62%;
  }
}

@media screen and (max-width: 450px) {
  .InputLogin {
    width: 26.5%;
  }
  .md-raised {
    width: 60%;
  }
}

@media screen and (max-width: 320px) {
  .Login {
    margin-left: 73.5938px;
  }
  .InputLogin {
    width: 80px;
  }
  .md-raised {
    width: 155px;
  }
}

@media screen and (max-height: 850px) {
  #PASSWORD {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .md-button {
    margin-top: 3px;
  }
  #MSG {
    display: none;
  }
}
</style>
