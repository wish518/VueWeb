<!-- Work1.vue -->

<template>
  <div id="Work1">
    <div class="text-center">
      <b-spinner
        v-if="DateReady"
        style="width: 3rem; height: 3rem;margin-top:100px"
        label="Spinning"
      ></b-spinner>
    </div>
    <div id="DATE" class="Point" v-if="DateReady != true" style="white-space:pre;" v-text="SDATE"></div>

    <!-- TAG1 -->

    <div id="TAG" class="Tag Point" v-if="DateReady != true">
      <div id="AccoutingDateWord">
        <div style="display:inline-block">記帳日期：</div>
        <div id="AccoutingDate">
          <b-form-datepicker
            v-model="SetRecordM.AccoutingDate"
            class="mb-2"
            placeholder="選擇日期"
            selected-variant="danger"
            today-variant="success"
            labelHelp
            today-button
            label-today-button="選擇本日日期"
            @context="onContext"
          ></b-form-datepicker>
        </div>
      </div>
      <div id="Word">選擇主要記帳項目：</div>
      <md-chip
        class="Level1"
        :id="'Index'+item.IndexPK"
        :style="'background-color:'+item.DefaultColor"
        v-for="(item,index) in LEVEL1"
        :key="index"
        @click="Level1Click($event,item.IndexPK)"
        md-clickable
      >{{ item.AdditionalName }}</md-chip>
    </div>

    <!-- TAG2 -->
    <div id="TAG2" class="Tag Point">
      <!-- Level2 -->
      <div class="Level2Board">
        選擇次要消費項目(非必填)：
        <div id="ChildIndexPK" @blur="Level2blur">
          <md-chips v-model="AdditionalName" :md-limit="1" md-placeholder="增加記帳項目..."></md-chips>
        </div>
        <div class="text-center">
          <md-chip
            class="Level2"
            :id="'Index'+index"
            v-for="(item,index) in ShowLEVEL2"
            :key="item.AdditionalName"
            @click="Level2Click(item,index)"
            md-clickable
          >{{ item.AdditionalName }}</md-chip>
        </div>
      </div>
      <!-- Amount -->
      <div class="Level2Board" style="margin-top:10px">
        <div style="color:red; margin-top:8px;font-size:14px">填寫金額：</div>
        <div id="Amount" class="text-center">
          <md-chip
            class="Amount"
            :id="'Amount'+index"
            v-for="(item,index) in ComAmunt"
            :key="index"
            @click="AmountClick(item.AMOUNT)"
            md-clickable
          >{{ item.AMOUNT }}</md-chip>
        </div>
        <div style="margin-top:10px">
          <div id="SetAmountDiv">
            <div id="plus" class="AmountColorSet" :style="CssPlus" @click="AmountColorSet('red')"></div>
            <div
              id="Subtract"
              class="AmountColorSet"
              :style="CssSubtract"
              @click="AmountColorSet('green')"
            ></div>
            <md-field id="FinalAmountDiv" style="margin-top:-20px">
              <label>金額{{AmountSet}}</label>
              <span class="md-prefix">$</span>
              <md-input
                id="FinalAmount"
                v-model="AccoutingAmount"
                @blur="CALC_AMT()"
                @focus="FinalAmountFocus()"
                @keyup="VaildateE($event,AccoutingAmount)"
                @keypress="FinalAmountkeypress($event)"
              ></md-input>
            </md-field>
            <div id="ErrAmtWord" class="text-left">{{ErrAmtWord}}</div>
          </div>
          <b-button id="SetRecord" @click="SetRecord()">紀錄</b-button>
        </div>
      </div>

      <b-button @click="Previous('Level1')" variant="info" style="margin-top:20px">&lsaquo; 上一步</b-button>
    </div>
  </div>
</template>

<script>
import { TextBox } from "../JS/TextBox";
export default {
  mixins: [TextBox],
  name: "Work1",
  inject: ["reload"],
  updated() {
    let vm = this;
    if (vm.IsLevel2Click) {
      $("#ChildIndexPK .md-chip").css(
        "background-color",
        $("#Index" + vm.SetRecordM.IndexPK).css("background-color")
      );
      vm.IsLevel2Click = false;
    }
  },
  mounted() {
    let vm = this;
    $.ajax({
      type: this.type, //傳送方式
      url: this.GameAPI_URL + "WORK/GetAdditionalData" + this.API, //傳送目的地
      dataType: "json", //資料格式
      data: { UID: this.SetRecordM.UID },
      success: function(json_data) {
        if (json_data.IS_Error != "Y") {
          vm.LEVEL1 = json_data.LEVEL1;
          vm.LEVEL2 = json_data.LEVEL2;
          vm.AMOUNT = json_data.AMOUNT;
          vm.DATE = new Date(json_data.SeverDatetime);
          console.log("取得資料成功");
        } else {
          console.log(json_data.MSG);
          alert("取得資料有誤");
        }
      },
      error: function(key, value) {
        alert("取得資料有誤");
      }
    });
    setInterval(function() {
      vm.DATE.setSeconds(vm.DATE.getSeconds() + 1); //new Date();
      vm.DateReady = false;
      vm.SDATE =
        vm.DATE.toLocaleString() + "  " + vm.DayNames[vm.DATE.getDay()];
    }, 1000);

    this.$nextTick(() => {
      $("#ChildIndexPK .md-input").bind("blur", this.Level2blur);
    });
  },
  data() {
    return {
      DayNames: [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ],
      DATE: new Date(),
      SDATE: "",
      DateReady: true,
      IsLevel2Click: false,
      SetRecordM: {
        UID: localStorage.getItem("UID"),
        AccoutingDate: new Date(),
        IndexPK: 0,
        AMOUNT: 0,
        AdditionalName: ""
      },
      LEVEL1: [],
      LEVEL2: [],
      ShowLEVEL2: [],
      TempAdditionalName: [],
      AdditionalName: [],
      AMOUNT: [],
      AccoutingAmount: "",
      ShowAmount: [],
      ErrAmtWord: "金額格式錯誤",
      PointWidth: -250,
      AmountSet: "",
      CssPlus: {
        display: "inline-block",
        backgroundImage: "url(" + require("../assets/png/plus.png") + ")",
        backgroundSize: "contain",
        width: "35px",
        height: "35px",
        position: "relative",
        top: "10px"
      },
      CssSubtract: {
        display: "inline-block",
        backgroundImage: "url(" + require("../assets/png/subtract.png") + ")",
        backgroundSize: "contain",
        width: "35px",
        height: "35px",
        position: "relative",
        top: "10px"
      }
    };
  },
  computed: {
    ComAmunt: {
      get: function() {
        return this.ShowAmount.sort((a, b) => {
          return a.AMOUNT - b.AMOUNT;
        });
      },
      set: function(IndexPK) {
        this.ShowAmount = this.AMOUNT.filter(function(item) {
          return item.IndexPK === IndexPK;
        });
        this.ShowLEVEL2 = this.LEVEL2.filter(function(item) {
          return item.IndexPK === IndexPK;
        });
      }
    }
  },
  methods: {
    SetRecord() {
      if (this.AccoutingAmount === "" || this.AccoutingAmount < 0) {
        this.ErrAmtWord = "請填入金額";
        //$("#SetRecord").attr("disabled", true);
        $("#ErrAmtWord").css("visibility", "visible");
        return;
      }
      this.SetRecordM.AMOUNT = this.AccoutingAmount;
      if (
        $("#FinalAmountDiv .md-input").css("-webkit-text-fill-color") != "red"
      )
        this.SetRecordM.AMOUNT = this.AccoutingAmount * -1;
      this.SetRecordM.AdditionalName = this.AdditionalName[0] || "";
      let vm = this;
      if (process.env.NODE_ENV === "sw") {
      } else {
        $.post(
          this.GameAPI_URL + "/Work/SetRecord",
          { SetRecord: vm.SetRecordM },
          function(json_data) {
            if (json_data.IS_Error != "Y") {
              alert("記帳成功");
              vm.reload();
            } else {
              alert(json_data.MSG);
            }
          }
        ).fail(function() {
          alert("記帳發生錯誤");
        });
      }
    },
    onContext(ctx) {
      this.SetRecordM.AccoutingDate = ctx.selectedYMD;
    },

    Level1Click(e, value) {
      let vm = this;
      vm.ComAmunt = value;
      vm.SetRecordM.IndexPK = value;
      //換主類別時 清除次類別
      var md_chip = $("#ChildIndexPK .md-chip");
      if (md_chip.length > 0)
        if (
          md_chip.css("background-color") !=
          $("#Index" + vm.SetRecordM.IndexPK).css("background-color")
        ) {
          vm.AdditionalName = [];
          vm.AccoutingAmount = null;
          $("#FinalAmount").css("background-color", "whitesmoke");
          $("#FinalAmount").css("border", "1px solid");
        }
      var h = 50;
      if (window.innerWidth <= 320) h = 0;

      $("#TAG2").css("left", h+100+"%");

      $("#TAG").animate({ left: h-90+"%" }, function() {
        $("#TAG").css("display", "none");
        $("#TAG").attr('style',$("#TAG").attr("style").replace("left: "+h-100+"%;",''));
      });
      $("#TAG2").css("display", "block");
      $("#TAG2").animate({ left: h+"%" }, function() {  
         $("#TAG2").attr('style',$("#TAG2").attr("style").replace("left: "+h+"%;",''))
        });
    },

    Previous(Action) {
      var h = 50;
      if (window.innerWidth <= 320) h = 0;

      if (Action === "Level1") {
        $("#TAG").css("left", h-90+"%");

        $("#TAG2").animate({ left: h+100+"%" }, function() {
          $("#TAG2").css("display", "none");
          $("#TAG2").attr('style',$("#TAG2").attr("style").replace("left: "+h+100+"%;",''));
        });
        $("#TAG").css("display", "block");
        $("#TAG").animate({ left: h+"%"}, function() { 
           $("#TAG").attr('style',$("#TAG").attr("style").replace("left: "+h+"%;",''))
           });
      }
    },

    Level2Delete() {
      let vm = this;
      $("#ChildIndexPK .md-input").val("");
      //.md-input 會不見 刪除時才會出現 需要重新bind
      this.$nextTick(() => {
        $("#ChildIndexPK .md-input").bind("blur", this.Level2blur);
      });
    },
    Level2blur() {
      var value = $("#ChildIndexPK .md-input")[0].value;
      if (value != "") {
        let vm = this;
        vm.IsLevel2Click = true;
        vm.AdditionalName.push(value);
        this.$nextTick(() => {
          $("#ChildIndexPK .md-button").bind("click", this.Level2Delete);
        });
      }
    },
    Level2Click(item, index) {
      let vm = this;
      vm.IsLevel2Click = true;
      vm.AdditionalName = [];
      vm.AdditionalName.push(item.AdditionalName);
      vm.AmountColorSet(item.DefaultAmountColor);
      this.$nextTick(() => {
        $("#ChildIndexPK .md-button").bind("click", this.Level2Delete);
      });
    },
    AmountColorSet(color) {
      if (color == "red") {
        $("#FinalAmountDiv .md-input").css("-webkit-text-fill-color", color);
        this.AmountSet = "(收入)";
      } else {
        $("#FinalAmountDiv .md-input").css("-webkit-text-fill-color", color);
        this.AmountSet = "(支出)";
      }
    },
    FinalAmountFocus() {
      $("#FinalAmount").css("background-color", "transparent");
      $("#FinalAmount").css("border", "0px");
    },
    FinalAmountkeypress(e) {
      let vm = this;
      if (e.keyCode == 13) vm.CALC_AMT();
    },
    AmountClick(value) {
      this.AccoutingAmount = value;
      let vm = this;
      vm.FinalAmountFocus();
      //$("#SetRecord").attr("disabled", false);
      vm.VaildateE();
    },
    VaildateE: function(e, valuevalue) {
      if (/[^0-9^+^'\-'^*^/]/g.test(this.AccoutingAmount)) {
        this.AccoutingAmount = this.AccoutingAmount.replace(
          /[^0-9^+^'\-'^*^/]/g,
          ""
        );
      }
      if (this.AccoutingAmount === "") {
        //$("#SetRecord").attr("disabled", true);
        $("#SetRecord").css("background-color", "#6c757d");
      } else {
        //$("#SetRecord").attr("disabled", false);
        $("#SetRecord").css("background-color", "#007bff");
      }
    },
    CALC_AMT() {
      if (this.AccoutingAmount != undefined) {
        try {
          this.AccoutingAmount = Math.round(eval(this.AccoutingAmount));
          if (
            this.AccoutingAmount != null &&
            this.AccoutingAmount >= 0 &&
            this.AccoutingAmount <= 9999999999
          ) {
            //$("#SetRecord").attr("disabled", false);
            $("#ErrAmtWord").css("visibility", "hidden");
            return;
          }
          if (this.AccoutingAmount != null && this.AccoutingAmount >= 0) {
            //$("#SetRecord").attr("disabled", true);
            $("#ErrAmtWord").css("visibility", "visible");
            this.ErrAmtWord = "金額不得超過9999999999";
            return;
          }
          //$("#SetRecord").attr("disabled", true);
          $("#FinalAmount").css("background-color", "whitesmoke");
          $("#FinalAmount").css("border", "1px solid");
          this.AccoutingAmount = null;
        } catch (e) {
          //$("#SetRecord").attr("disabled", true);
          $("#ErrAmtWord").css("visibility", "visible");
          this.ErrAmtWord = "金額格式錯誤";
        }
      } else {
        $("#FinalAmount").css("background-color", "whitesmoke");
        $("#FinalAmount").css("border", "1px solid");
      }
    }
  }
};
</script>

<style scoped>
.Point {
  width: 500px;
  margin-left: -250px;
  position: absolute;
  text-align: center;
  left: 50%;
}
#DATE {
  height: 80px;
  /* text-align: center; */
  font-family: DFKai-sb;
  font-size: 20px;
  padding-top: 50px;
  font-weight: bold;
}

#Word {
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 24px;
  font-family: DFKai-sb;
  color: red;
}
#AccoutingDateWord {
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 24px;
  font-family: DFKai-sb;
  color: red;
  text-align: left;
  margin-left: 50px;
}
#AccoutingDate {
  display: inline-block;
  width: 225px;
}
.Tag {
  margin-top: 100px;
  font-weight: bold;
}

#TAG2 {
  display: none;
  position: absolute;
}
#ChildIndexPK {
  padding-top: 0px;
  display: inline-block;
  width: 250px;
}
#ChildIndexPK .md-chips.md-field {
  min-height: 30px;
  padding-top: 0px;
}
.Level1,
.Level2,
.Amount {
  margin-left: 20px;
  margin-top: 3px;
  margin-bottom: 5px;
  font-size: 12px;
  text-align: center;
  font-weight: bold;
}
#Level2 .md-input {
  border-bottom: 1px !important;
}
.Level2Board {
  padding-left: 10px;
  text-align: left;
  border: 2px solid;
}
.md-field {
  margin-bottom: 10px;
}
.Level2.md-field:after,
.Level2.md-field:before {
  content: none;
}
.AmountColorSet:hover {
  cursor: pointer;
}
#SetAmountDiv {
  display: inline-block;
  width: 300px;
  margin-left: 70px;
}

#FinalAmountDiv {
  width: 180px;
  margin-left: 100px;
  position: absolute;
  margin-top: -45px !important;
}

#FinalAmount {
  position: relative;
  background-color: whitesmoke;
  border: 1px solid;
  top: 0px;
}

#ErrAmtWord {
  margin-top: -10px;
  font-size: 14px;
  color: red;
  font-family: DFKai-sb;
  visibility: hidden;
}

#SetRecord {
  display: inline-block;
  margin-top: -28px;
  height: 32px;
  line-height: 0px;
}
@media screen and (max-width: 560px) {
  .Point {
    width: 360px;
    margin-left: -180px;
  }
  #AccoutingDateWord {
    margin-left: 0px;
    font-size: 18px;
  }
  .Level1,
  .Level2,
  .Amount {
    margin-left: 10px;
  }
  #SetAmountDiv {
    margin-left: 40px;
    width: 210px;
  }
  #FinalAmountDiv,
  #FinalAmount {
    width: 100px;
  }
  #FinalAmountDiv {
    margin-left: 90px;
  }
}
@media screen and (max-width: 420px) {
  .Point {
    width: 320px;
    margin-left: -160px;
  }
  .Level1,
  .Level2,
  .Amount {
    margin-left: 5px;
  }
  #AccoutingDateWord {
    font-size: 16px;
  }
  #SetAmountDiv {
    margin-left: 25px;
    width: 190px;
  }
  #FinalAmountDiv,
  #FinalAmount {
    width: 90px;
  }
}
@media screen and (max-width: 360px) {
  .Point {
    width: 280px;
    margin-left: -140px;
  }
  #AccoutingDateWord {
    margin-left: 25px;
    font-size: 18px;
  }
  .Level2Board {
    width: 280px;
    padding-top: 5px;
    padding-left: 5px;
    text-align: left;
    border: 1px solid;
  }
  #FinalAmountDiv,
  #FinalAmount {
    width: 80px;
  }
  #SetAmountDiv {
    margin-left: 10px;
    width: 150px;
  }
  #SetRecord {
    margin-top: -28px;
    margin-left: 30px;
    height: 32px;
    line-height: 0px;
  }
}

@media screen and (max-height: 870px) {
  #DATE {
    padding-top: 20px;
    height: 50px;
  }
  .Tag {
    margin-top: 80px;
  }
}
@media screen and (max-height: 750px) {
  #DATE {
    padding-top: 10px;
    height: 50px;
  }
  .Tag {
    margin-top: 50px;
  }
}
@media screen and (max-width: 320px) {
  .Point {
    left: 0% ;
    margin-left: 10px;
  }
  #DATE {
    display: none;
  }
  .Tag {
    margin-top: 10px;
  }
}
@media screen and (max-height: 630px) {
  #DATE {
    display: none;
  }
  .Tag {
    margin-top: 10px;
  }
}
</style>
