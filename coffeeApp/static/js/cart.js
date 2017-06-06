			var vm = new Vue({
					el:"#app",
					data:{
							isSelectAll:true,
							allCount:0.00,
							allNum:0,
							comments:[
							],
							hasData:false,
							loadingTest:"加载中...",
							confirmDelete:false,
							readyToDelIndex:-1,
					},
					methods:{
						cleanCart:function(){
							this.confirmDelete = true;
						},
						cancelDel:function(){
							this.confirmDelete = false;
						},
						doDel:function(){
							localStorage.updateCartNum = true;
							if (this.readyToDelIndex == -1) {
								var resquesturl = localStorage.url+"shoppingCart/";
								resquesturl+=localStorage.memberId;
								reqwest({
										url:resquesturl,
										type:"json",
										method:"post",
										success:function (resp) {
											if (resp.result == false) {
												alert(resp.message);
												return;
											}
										},
										error:function(){
											alert("请求超时");
										}
								})
								this.loadingTest = "暂无数据 去逛逛";
								this.hasData = false;
								this.confirmDelete=false;
								return;
							}
							var comment = this.comments[this.readyToDelIndex];
							this.comments.splice(this.readyToDelIndex, 1);
							if (this.comments.length == 0) {
									this.loadingTest = "暂无数据 去逛逛";
									this.hasData = false;
							}
							var resquesturl = localStorage.url+"addShoppingCart/";
							resquesturl+=localStorage.memberId;
							resquesturl+="/";
							resquesturl+=comment.product.id;
							reqwest({
									url:resquesturl,
									type:"json",
									method:"post",
									data:{num:-1},
									success:function (resp) {
										if (resp.result == false) {
											alert(resp.message);
											return;
										}
									},
									error:function(){
										alert("请求超时");
									}
							})
							this.confirmDelete=false;
						},
						productMinus:function(comment){
								if (comment.num == 1) {
										this.confirmDelete = true;
										this.readyToDelIndex = this.comments.indexOf(comment);
								}
								else {
									localStorage.updateCartNum = true;
									comment.num--;
									var resquesturl = localStorage.url+"addShoppingCart/";
									resquesturl+=localStorage.memberId;
									resquesturl+="/";
									resquesturl+=comment.product.id;
									reqwest({
											url:resquesturl,
											type:"json",
											method:"post",
											data:{num:-1},
											success:function (resp) {
												if (resp.result == false) {
													alert(resp.message);
													return;
												}
											},
											error:function(){
												alert("请求超时");
											}
									})
								}
						},
						productAdd:function(comment){
							localStorage.updateCartNum = true;
								comment.num++;
								var resquesturl = localStorage.url+"addShoppingCart/";
								resquesturl+=localStorage.memberId;
								resquesturl+="/";
								resquesturl+=comment.product.id;
								reqwest({
										url:resquesturl,
										type:"json",
										method:"post",
										data:{num:1},
										success:function (resp) {
											if (resp.result == false) {
												alert(resp.message);
												return;
											}
										},
										error:function(){
											alert("请求超时");
										}
								})
						},
						payCart:function(){
							var arr = [];
							this.comments.forEach(function(good){
								if(good.isChecked){
									arr.push(good);
								}
							});
							if (arr.length == 0) {
								alert("请至少勾选一个商品");
							}
							else {
								localStorage.cartArr = JSON.stringify(arr);
								window.location.href = "/payCart";
							}
						},
						addProductOrNot:function (goodObj){
								goodObj.isChecked = !goodObj.isChecked;
								this.isCheckAll();
						},
						isCheckAll:function(){
							var flag = true;
							this.comments.forEach(function(good){
								if(!good.isChecked){
									flag = false;
								}
							});
							if(!flag){
								this.isSelectAll = false;
							} else {
								this.isSelectAll = true;
							}
						},
						selectAllOrNot:function(){
		if (this.isSelectAll == false) {
			this.isSelectAll = true;
			this.comments.forEach((good)=>{
				good.isChecked = true;
			});
		}
		else {
			this.isSelectAll = false;
			this.comments.forEach((good)=>{
				good.isChecked = false;
			})
		}
	},
						getData:function () {
									var self = this;
									var resquesturl = localStorage.url+"shoppingCart/";
									resquesturl+=localStorage.memberId;
									reqwest({
											url:resquesturl,
											type:"json",
											method:"get",
										//  data:{tag:"life"}
											success:function (resp) {
													self.comments = resp.data;
													self.hasData = true;
													if (self.comments && self.comments != "") {
														for (var i = 0; i < self.comments.length; i++) {
																Vue.set(self.comments[i],"isChecked",true)
																self.allNum += self.comments[i].num;
																self.allCount += self.comments[i].product.price * self.comments[i].num;
														}
													} else{
														 self.loadingTest = "暂无数据 去逛逛";
														 self.hasData = false;
													}
											},
											error:function(){
												alert("请求超时");
											}
									})
							}
					},
					computed:{
		allCount:function(){
			if (!this.comments) {
					return 0;
			}
			var total = 0;
			this.comments.forEach(function(good){
				if(good.isChecked){
					total += good.product.price * good.num;
				}
			});
			return total;
		},
		allNum:function(){
			if (!this.comments) {
					return 0;
			}
			var total = 0;
			this.comments.forEach(function(good){
				if(good.isChecked){
					total += good.num;
				}
			});
			return total;
		},
	},
					ready:function () {
							this.getData();
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
