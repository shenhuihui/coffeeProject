    var vm  = new Vue({
     el:"#app",
     data:{
       comments:[],
       coffeevalue:0,
       milkValue:0,
       sugarValue:0,
       toastShow:false,
       configContent:{},
     },
     methods:{
       wxconfig:function(){
         reqwest({
             url:localStorage.url+"getConfigInfo",
             type:"json",
             method:"get",
             data:{url:window.location.href},
             success:function (resp) {
               wx.config({
                 debug: false,
                 appId: resp.data.appId,
                 timestamp: resp.data.timestamp,
                 nonceStr: resp.data.nonceStr,
                 signature: resp.data.signature,
                 jsApiList: [
                     'scanQRCode'
                   ]
               });
               wx.error(function(res){
                   alert(res.errMsg);
               });
             }
           });
       },
       getProductConfig:function(){
         var self = this;
         reqwest({
             url:localStorage.url + "getProductConfig",
             type:"json",
             method:"get",
             data:{productId:localStorage.configId},
             success:function (resp) {
               if (resp.result == false) {
                 alert(resp.message);
                 return;
               }
               self.configContent = resp.data;
               self.coffeevalue = self.configContent.coffee;
               self.milkValue = self.configContent.milk;
               self.sugarValue = self.configContent.sugar;
             },
             error:function(){
               alert("请求超时");
             }
         })
       },
       getConfigList:function(){
         var self = this;
         reqwest({
             url:localStorage.url + "getCustomConfigListByRecommend",
             type:"json",
             method:"get",
             success:function (resp) {
               if (resp.result == false) {
                 alert(resp.message);
                 return;
               }
               self.comments = resp.data;
               for (var i = 0; i < self.comments.length; i++) {
                   Vue.set(self.comments[i],"isChecked",false);
               }
               Vue.set(self.comments[0],"isChecked",true);
             },
             error:function(){
               alert("请求超时");
             }
         })
       },
       addProductOrNot:function (goodObj){
           this.comments.forEach(function(good){
             good.isChecked = false;
           });
           goodObj.isChecked = true;
           this.coffeevalue = goodObj.coffee;
           this.milkValue = goodObj.milk;
           this.sugarValue = goodObj.sugar;
       },
       scanCode:function(){
         var self = this;
        //  self.makeCoffee("10296");
        //  return;
         wx.scanQRCode({
           needResult: 1,
           scanType: ["qrCode","barCode"],
           success: function (res) {
               self.makeCoffee(res.resultStr);
           },
           fail: function (res) {
             alert(res.errMsg);
           }
         });
       },
       makeCoffee:function(pram){
         var self = this;
         if (localStorage.isFromCom == "true") {
           var dict = {'cooperativePartnerId': 1,'customConfig': {'coffee': self.coffeevalue,'milk': self.milkValue,'sugar': self.sugarValue},'memberId': localStorage.memberId,'password': "mk123456",'productId': localStorage.productID,'vmc': pram}
           console.log(dict);
           console.log(JSON.stringify(dict));
          //  return;
           reqwest({
               url:localStorage.url+"makeCoffeesByCooperativePartnerProductId",
               type:"json",
               contentType: "application/json",
               method:"post",
               data:JSON.stringify(dict),
               success:function (resp) {
                 if (resp.result == true) {
                   alert("领取成功");
                 }
                 else {
                     alert("领取失败");
                 }
               },
               error:function(){
                 alert("请求超时");
               }
           })
         }
         else {
           var dict = {'id': localStorage.theConversionCodeId,'customConfig': {'coffee': self.coffeevalue,'milk': self.milkValue,'sugar': self.sugarValue},'vmc': pram}
           console.log(dict);
           console.log(JSON.stringify(dict));
          //  return;
           reqwest({
               url:localStorage.url+"makeCoffeesByCustomConfig",
               type:"json",
               contentType: "application/json",
               method:"post",
               data:JSON.stringify(dict),
               success:function (resp) {
                 if (resp.result == true) {
                     localStorage.makingCoffee = "true";
                     self.toastShow = true;
                     localStorage.intervalflag = setInterval(function () {
                       self.getconversionCodes();
                     }, 5000);
                 }
                 else {
                     alert("领取失败");
                 }
               },
               error:function(){
                 alert("请求超时");
               }
           })
         }
       },
       getconversionCodes:function(){
         var self = this;
         reqwest({
           url:localStorage.url+"getProductConversionCodeByMemberIdAndConversionState",
           type:"json",
           method:"get",
           data:{memberId:localStorage.memberId,conversionState:1},
           success:function(resp){
             var theData = resp.data;
             theData.forEach(function(good){
               if (localStorage.makingCoffee == "true" && good.id == localStorage.theConversionCodeId) {
                   alert("领取成功");
                   localStorage.makingCoffee = "false";
                   self.toastShow = false;
                   clearInterval(localStorage.intervalflag);
               }
             });
           }
         });
         reqwest({
           url:localStorage.url+"getProductConversionCodeByMemberIdAndConversionState",
           type:"json",
           method:"get",
           data:{memberId:localStorage.memberId,conversionState:3},
           success:function(resp){
             var theData = resp.data;
             theData.forEach(function(good){
               if (localStorage.makingCoffee == "true" && good.id == localStorage.theConversionCodeId) {
                   alert("领取失败");
                   localStorage.makingCoffee = "false";
                   self.toastShow = false;
                   clearInterval(localStorage.intervalflag);
               }
             });
           }
           });
       },
     },
     ready:function(){
       this.getProductConfig();
       this.getConfigList();
       this.wxconfig();
       if (localStorage.makingCoffee == "true") {
         var self = this;
         self.toastShow = true;
         localStorage.intervalflag = setInterval(function () {
           self.getconversionCodes();
         }, 5000);
       }
     }
   });
   $(function(){
       var $sliderTrack = $('#sliderTrack'),
           $sliderHandler = $('#sliderHandler'),
           $sliderValue = $('#sliderValue');

       var totalLen = $('#sliderInner').width(),
           startLeft = 0,
           startX = 0;

       $sliderHandler
           .on('touchstart', function (e) {
               startLeft = parseInt($sliderHandler.css('left')) * totalLen / 100;
               startX = e.changedTouches[0].clientX;
           })
           .on('touchmove', function(e){
               var dist = startLeft + e.changedTouches[0].clientX - startX,
                   percent;
               dist = dist < 0 ? 0 : dist > totalLen ? totalLen : dist;
               percent =  parseInt(dist / totalLen * 5);
               $sliderTrack.css('width', percent * 20 + '%');
               $sliderHandler.css('left', percent * 20 + '%');
               $sliderValue.text(percent);
               vm.coffeevalue = percent;
               e.preventDefault();
           })
       ;
       var $sliderTrack2 = $('#sliderTrack2'),
           $sliderHandler2 = $('#sliderHandler2'),
           $sliderValue2 = $('#sliderValue2');

       $sliderHandler2
           .on('touchstart', function (e) {
               startLeft = parseInt($sliderHandler2.css('left')) * totalLen / 100;
               startX = e.changedTouches[0].clientX;
           })
           .on('touchmove', function(e){
               var dist = startLeft + e.changedTouches[0].clientX - startX,
                   percent;
               dist = dist < 0 ? 0 : dist > totalLen ? totalLen : dist;
               percent =  parseInt(dist / totalLen * 5);
               $sliderTrack2.css('width', percent * 20 + '%');
               $sliderHandler2.css('left', percent * 20 + '%');
               $sliderValue2.text(percent);
               vm.milkValue = percent;
               e.preventDefault();
           })
       ;
       var $sliderTrack3 = $('#sliderTrack3'),
           $sliderHandler3 = $('#sliderHandler3'),
           $sliderValue3 = $('#sliderValue3');

       $sliderHandler3
           .on('touchstart', function (e) {
               startLeft = parseInt($sliderHandler3.css('left')) * totalLen / 100;
               startX = e.changedTouches[0].clientX;
           })
           .on('touchmove', function(e){
               var dist = startLeft + e.changedTouches[0].clientX - startX,
                   percent;
               dist = dist < 0 ? 0 : dist > totalLen ? totalLen : dist;
               percent =  parseInt(dist / totalLen * 5);
               $sliderTrack3.css('width', percent * 20 + '%');
               $sliderHandler3.css('left', percent * 20 + '%');
               $sliderValue3.text(percent);
               vm.sugarValue = percent;
               e.preventDefault();
           })
       ;
   });
