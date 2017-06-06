  var vm  = new Vue({
   el:"#app",
   data:{
     comments:[],
   },
   methods:{
      add0:function(m){return m<10?'0'+m:m },
           format:function(shijianchuo)
           {
             var time = new Date(shijianchuo);
             var y = time.getFullYear();
             var m = time.getMonth()+1;
             var d = time.getDate();
             var h = time.getHours();
             var mm = time.getMinutes();
             var s = time.getSeconds();
             return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
           },
           getActivity:function(){
             var self = this;
             reqwest({
               url:localStorage.url+"activityList",
               type:"json",
               method:"get",
               /*data:{createDate:localStorage.createDate},*/
               success:function(resp){
                 self.comments = resp.data;
                 if(self.comments){
                   self.comments = resp.data;
                   for (var i = 0; i < self.comments.length; i++) {
                       self.comments[i].createDate = self.format(self.comments[i].createDate);
                   }
                 }
               },
               error:function(){
                 alert("请求超时");
               }
             })

           },

           activityDetail:function(activity){
             var resquesturl = "/activityDetail/";
             resquesturl += activity.id;
                  if (activity.id == 2) {
                    var currentDate = Date.parse(new Date());
                    if (currentDate > activity.endTime || currentDate < activity.startTime) {
                      alert("不在活动时间内");
                      return;
                    }
                    if (localStorage.isRegist == "false") {
                      alert("您尚未注册会员");
                      return;
                    }
                    resquesturl += "?parm="+activity.wxCardId;
                  }
                  else {
                    resquesturl += "?parm="+activity.createDate.substring(0,10);
                  }
                   console.log(resquesturl);
                  window.location.href = resquesturl;
           },
   },
   ready:function(){
             this.getActivity();
          }
  });
