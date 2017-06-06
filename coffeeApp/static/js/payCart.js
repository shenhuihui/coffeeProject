var vm = new Vue({
    el:"#app",
    data:{
        eNum:0,
        totalENum:localStorage.eNum,
        canUseENum:0,
        allCount:0.00,
        reduceCount:0.00,
        actualCount:0.00,
        encrypt_code:"",
        card_id:"",
        comments:JSON.parse(localStorage.cartArr),
        ticket:{},
        itemList:[],
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
                    'chooseCard',
                    'chooseWXPay'
                  ]
              });
              wx.error(function(res){
                  alert(res.errMsg);
              });
            }
          });
      },
     getTicket:function(){
       var self = this;
                reqwest({
                    url:localStorage.url+"mp/getWxCardApiSignature",
                    type:"json",
                    method:"get",
                    success:function (resp) {
                      if (resp.result == false) {
                        alert(resp.message);
                        return;
                      }
                      wx.chooseCard({
                        timestamp: resp.data.timestamp, // 卡券签名时间戳
                        nonceStr: resp.data.nonceStr, // 卡券签名随机串
                        signType: 'SHA1', // 签名方式，默认'SHA1'
                        cardSign: resp.data.signature, // 卡券签名
                        success: function (res) {
                          res.cardList = JSON.parse(res.cardList);
                          self.encrypt_code = res.cardList[0]['encrypt_code'];
                          self.card_id = res.cardList[0]['card_id'];
                          self.getWXCardInfo(self.card_id,self.encrypt_code);
                        }
                      });
                    },
                    error:function(){
                      alert("请求超时");
                    }
                  });
     },
      getWXCardInfo:function(pram1,pram2){
        var self = this;
        reqwest({
            url:localStorage.url + "getWXCardInfo",
            type:"json",
            method:"get",
            data:{cardId:pram1,encryptCode:pram2},
            success:function (resp) {
              if (resp.result == false) {
                alert(resp.message);
                return;
              }
              self.ticket = resp.data;
              // if (self.ticket.discount > 0) {
              // 	self.reduceCount = (self.allCount * (1-self.ticket.discount)).toFixed(2);
              // }
              // else {
              // 	self.reduceCount = self.ticket.reduceCost;
              // }

            },
            error:function(){
              alert("请求超时");
            }
        })
      },
      payOrder:function(coffeeOrderId){
        var self = this;
          if (localStorage.isTest == "false") {
            alert("现非测试人员不能下单");
            return;
          }
          reqwest({
              url:localStorage.url+"pay/getWXJsPayInfoTest",
              type:"json",
              method:"get",
              data:{orderId:coffeeOrderId},
              success:function (resp) {
                if (resp.result == false) {
                    alert(resp.message);
                    window.location=document.referrer;
                    return;
                }
                if (resp.data.alreadyPay == true) {
                    alert("支付成功");
                    window.location=document.referrer;
                    return;
                }
                  wx.chooseWXPay({
                    appId: resp.data.appId,
                    timestamp: resp.data.timeStamp,
                    nonceStr: resp.data.nonceStr,
                    package: resp.data.package,
                    signType: 'MD5',
                    paySign: resp.data.paySign,
                    success: function(res) {
                      var params = {'ids':self.itemList};
                      reqwest({
                          url:localStorage.url+"shoppingCarts/clearByIds",
                          type:"json",
                          method:"post",
                          contentType: "application/json",
                          data:JSON.stringify(params),
                          success:function (resp) {
                            if (resp.result == false) {
                              alert(resp.message);
                            }
                            var url = window.location.href;
                            var toUrl = url.substring(0,url.length-8)+"orderDetail.html?orderId="+coffeeOrderId;
                            window.location.href = toUrl;
                          },
                          error:function(){
                            alert("请求超时");
                          }
                      })
                    },
                    fail: function (res) {
                      alert(res.errMsg);
                      window.location=document.referrer;
                    }
                  });
              },
              error:function(){
                alert("请求超时");
              }
          })
        },
      payCart:function(){
        var self = this;
        var params = {};
        self.comments.forEach(function(good){
            self.itemList.push(good.id);
        });
        if (self.card_id.length > 0) {
            params = {'memberId':localStorage.memberId,'cardId':self.card_id,'encryptCode':self.encrypt_code,'shoppingCartsItemIds':self.itemList,'eNum':self.eNum};
        }
        else {
            params = {'memberId':localStorage.memberId,'shoppingCartsItemIds':self.itemList,'eNum':self.eNum};
        }
        console.log(params);
        reqwest({
            url:localStorage.url+"order",
            type:"json",
            method:"post",
            contentType: "application/json",
            data:JSON.stringify(params),
            success:function (resp) {
              if (resp.result == false) {
                alert(resp.message);
                return;
              }
              self.payOrder(resp.data.id);
            },
            error:function(){
              alert("请求超时");
            }
        })
      },
      getData:function () {
        var total = 0;
        this.comments.forEach(function(good){
          total += good.product.price * good.num;
        });
        this.allCount = total;
      }
    },
    computed:{
      canUseENum:function(){
        if (this.totalENum <= this.actualCount * 10) {
          return this.totalENum;
        }
        else {
          return this.actualCount * 10;
        }
      },
      reduceCount:function(){
        var count = 0;
        if (this.ticket.title) {
          if (this.ticket.discount > 0) {
            count = (this.allCount * (1-this.ticket.discount) + this.eNum * 0.1).toFixed(2);
          }
          else {
            count = (this.ticket.reduceCost + this.eNum * 0.1).toFixed(2);
          }
        }
        else {
          count = (this.eNum * 0.1).toFixed(2);
        }
        return count;
      },
      actualCount:function(){
        if (this.allCount >= this.reduceCount) {
          return (this.allCount - this.reduceCount).toFixed(2);
          }
          return 0.00;
      },
    },
    ready:function () {
        this.getData();
        this.wxconfig();
    }
  });
$(function(){
      var $iosDialog1 = $('#iosDialog1');
      $iosDialog1.on('click', '.weui-dialog__btn_default', function(){
            $iosDialog1.fadeOut(200);
      });
      $iosDialog1.on('click', '.weui-dialog__btn_primary', function(){
            var patrn = /^[0-9]*$/;
            var inputValue = $('#dialogInput').val();
            if (patrn.exec(inputValue) == null || inputValue == "" || parseInt(inputValue) > vm.actualCount*10) {
              alert("请输入有效数量");
            } else {
              vm.eNum = parseInt(inputValue);
              $iosDialog1.fadeOut(200);
            }
      });
      $('#showIOSDialog1').on('click', function(){
          $iosDialog1.fadeIn(200);
          vm.eNum = 0;
      });
  });
