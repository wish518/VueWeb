<!-- HomeView.vue -->

<template>
  <div id="HomeView">
    <div id="DivDatepicker">
      <div id="DivDatepicker_ST" class="DivDatepicker">
        <md-datepicker v-model="DATE_ST" md-immediately />
      </div>
      <h5 style="white-space:pre;">～</h5>
      <h6>至</h6>
      <div id="DivDatepicker_END" class="DivDatepicker">
        <md-datepicker v-model="DATE_END" md-immediately />
      </div>
    </div>
    <div id="AccoutingTable">
      <b-table
        responsive
        sticky-header
        bordered
        hover
        :busy="IsBusy"
        :fields="fields"
        :items="Items"
        :tbody-tr-class="rowClass"
        head-variant="dark"
      />
    </div>
    <div id="NoDataIcon">
      <b-iconstack font-scale="4">
        <b-icon icon="book" scale="0.75"></b-icon>
        <b-icon icon="circle-slash"></b-icon>
      </b-iconstack>
      <p class="h1">無記帳資料</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  mounted() {
    $(".md-input").attr("readOnly", "true");
    this.GetRecord(true);
  },
  updated() {
    let vm = this;
    if (vm.IsDateBusy) {
      console.log("1");
      if (vm.Items != null && vm.Items.length > 0) {
        $("#NoDataIcon").css("display", "none");
        vm.Items.forEach(function(item) {
          $(".AccoutingIndex" + item.IndexPK).css(
            "background-color",
            item.DefaultColor
          );
        });
      } else $("#NoDataIcon").css("display", "block");
      vm.IsDateBusy=false;
    }
  },
  data() {
    return {
      IsBusy: true,
      IsDateBusy: true,
      DATE_ST: null,
      DATE_END: null,
      GetRecordM: {
        DATE_ST: null,
        DATE_END: null,
        UID: localStorage.getItem("UID")
      },
      fields: [
        {
          key: "AccoutingDate",
          label: "記帳時間",
          sortable: true,
          formatter: value => {
            return new Date(value).toLocaleDateString().slice(0, 10);
          }
        },
        { key: "AdditionalName", label: "收/支項目" },
        { key: "AMOUNT", label: "金額", sortable: true, class: "text-right" }
      ],
      Items: []
    };
  },
  watch: {
    DATE_ST: function(value, old) {
      let vm = this;
      if (
        value === null ||
        vm.DATE_END === null ||
        (old == null && value === old) ||
        (old != null && value.toDateString() === old.toDateString()) ||
        vm.IsBusy
      ) {
      } else vm.GetRecord(false);
    },
    DATE_END: function(value, old) {
      let vm = this;
      if (
        value === null ||
        vm.DATE_ST === null ||
        (old == null && value === old) ||
        (old != null && value.toDateString() === old.toDateString()) ||
        vm.IsBusy
      ) {
      } else vm.GetRecord(false);
    }
  },
  methods: {
    GetRecord(IsRoad) {
      console.log("取得記帳紀錄");
      let vm = this;
      vm.IsBusy = true;
      if ((this.type = "POST")) {
        if (!IsRoad) {
          vm.GetRecordM.DATE_ST = vm.DATE_ST.toLocaleDateString().slice(0, 10);
          vm.GetRecordM.DATE_END = vm.DATE_END.toLocaleDateString().slice(
            0,
            10
          );
        }
        this.axios
          .post(this.GameAPI_URL + "WORK/GetRecord", vm.GetRecordM)
          .then(async function(res) {
            if ((await res.data.IS_Error) === "Y") {
              alert(res.data.MSG);
              return;
            }
            vm.Items = res.data.AccoutingRecord;
            if (IsRoad) {
              var SeverDatetime = new Date(res.data.SeverDatetime);
              vm.DATE_END = new Date(res.data.SeverDatetime);
              vm.DATE_ST = new Date(
                SeverDatetime.setMonth(SeverDatetime.getMonth() - 1)
              );
            }
            vm.IsDateBusy = true;

            vm.IsBusy = false;
          })
          .catch(function(error) {
            alert("取得記帳資料錯誤");
          });
        /*
        this.$post(this.GameAPI_URL + "WORK/GetRecord", vm.GetRecordM, function(
            data
          ) {
            if (data.IS_Error === "Y") {
              alert(data.MSG);
              return;
            }

            vm.Items = data.AccoutingRecord;
            if (IsRoad) {
              var SeverDatetime = new Date(data.SeverDatetime);
              vm.DATE_END = new Date(data.SeverDatetime);
              vm.DATE_ST = new Date(
                SeverDatetime.setMonth(SeverDatetime.getMonth() - 1)
              );
              vm.IsDateBusy = false;
            }
          })
          .fail(function() {
            alert("取得記帳資料錯誤");
          });*/
      }
      $.ajaxSettings.async = true;
      //vm.IsBusy = false;
    },
    rowClass(item, type) {
      return "AccoutingIndex" + item.IndexPK;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#HomeView {
  height: 100%;
  width: 100%;
}
#AccoutingTable {
  width: 80%;
  margin-left: 10%;
}
h5 {
  margin: 1%;
  display: inline-block;
}
h6 {
  display: none;
}
#DivDatepicker_ST {
  display: inline-block;
  width: 150px;
  margin-left: 10%;
  margin-top: 50px;
}
#DivDatepicker_END {
  display: inline-block;
  width: 150px;
  margin-left: 10px;
  margin-top: 50px;
}
#NoDataIcon {
  margin-left: 50%;
  display: none;
}
.b-iconstack {
  margin-left: -78.5px;
}
.h1 {
  margin-top: 95.125px;
  margin-left: -96.5px;
}
@media screen and (max-width: 500px) {
  h5 {
    display: none;
  }
  h6 {
    height: 15px;
    position: absolute;
    display: inline-block;
    margin: 25px 0px 0px 23%;
    padding-top: 0px;
    font-weight: bold;
  }
  #DivDatepicker_ST {
    display: block;
    margin-left: 30%;
  }
  #DivDatepicker_END {
    display: inline-block;
    margin-left: 30%;
    margin-top: 0px;
  }
}
@media screen and (max-width: 320px) {
  h6 {
    margin-left: 69.6875px;
  }
}
@media screen and (max-height: 870px) {
  .b-table-sticky-header {
    max-height: 220px;
  }
}
@media screen and (max-height: 810px) {
  .b-table-sticky-header {
    max-height: 190px;
  }
  #DivDatepicker_ST {
    margin-top: 0px;
  }
  #DivDatepicker_END {
    margin-top: 0px;
  }
}
@media screen and (max-height: 760px) {
  .b-iconstack {
    font-size: 300% !important;
    margin-left: -44.7px;
  }
  .h1 {
    margin-top: 45px;
    margin-left: -98px;
  }
}
</style>