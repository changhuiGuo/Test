//还书订单详情
;var BOrderDetails = {
	orderDetail:function(){	//借还订单
		let token = $.fn.cookie('bookToken');
		let orderId = window.sessionStorage['orderId'];
		$.ajax({
			dataType: "json",
			type:"post",
			url: Config.remoteAddress + "order/orderDetail",
			async:true,
			timeout: 10000,
			data:{
				token:token,
				orderId:orderId
			},
			success:function(data){
				if(data.result_code === "0000"){
					let originalPrice = data.result.originalPrice;				//原价
					let tradeTime = data.result.tradeTime;						//借书时间
					let commercialOrderno = data.result.commercialOrderno;		//单号
					window.sessionStorage['commercialOrderno'] = commercialOrderno;
					window.sessionStorage['orderNo'] = commercialOrderno;
					let yetStatus = data.result.yetStatus;						//还书状态  5未还 10已还
					let payStatus = data.result.payStatus;						//支付状态  5未支付 10已支付
					let payMoney = data.result.payMoney;						//总费用
					window.sessionStorage['yetStatus'] = yetStatus;
					window.sessionStorage['payStatus'] = payStatus;
					let devName = data.result.devName;							//设备名称
					let productImg = data.result.productImg;					//图片
					let tradeTotal = data.result.tradeTotal;					//借书金额
					let productName = data.result.productName;					//商品名称
					let totalDay = data.result.totalDay;						//租赁天数
					let yetTime = data.result.yetTime;							//还书时间
					let returnDevName = data.result.returnDevName;				//还书设备
					let znDay = data.result.znDay;								//滞纳天数
					let znMoney = data.result.znMoney;							//滞纳费用
					window.sessionStorage['payMoney'] = payMoney;
					console.log("还书状态"+yetStatus); 
					console.log("支付状态"+payStatus); 
					let html = [],$rodMain = $(".rodMain");
					//没有借书原价    <img src="${productImg == undefined ? '../../images/u224.png' : productImg}" />
					html.push(`
						<div class="row txborder">
							<div class="col-33">
								<div class="rodMain-img">
									<img src="${productImg}" />
								</div>
							</div>
							<div class="col-66">
								<p>书&nbsp;&nbsp;&nbsp;&nbsp;名：<span>${productName}</span></p>
								<p>借书单价：<span class="rodMain-pd">${originalPrice}元/天</span></p>
								
							</div>
						</div>
						<div class="row txborder">
							<h4><span class="bboMain-span"></span>订单详情</h4>
							<div class="rodMain-detail">
								<p>订单编号：${commercialOrderno}</p>
								<p>借书时间：${tradeTime}</p>
								<p>借书设备：${devName}</p>
								<p class="p-img">书册状态：${yetStatus == 10 ? '<img src="../../images/Theorderdetails_icon_backed.png" alt="" />':'<img src="../../images/Theorderdetails_icon_Stayback.png" alt="" />'}</p>
								<p class="p-img">支付状态：${payStatus == 10  ? '已支付': payMoney==0 ? '免租金':'待支付'}</p>
							</div>
						</div>
						<div class="row txborder">
							<h4><span class="bboMain-span"></span>费用结算</h4>
							<div class="rodMain-detail">
								<p>租赁天数：${totalDay}天</p>
								<p>租赁费用：${tradeTotal}元</p>
								<p>滞纳天数：${znDay}天</p>
								<p>滞纳费用：0元</p>
							</div>
							<div class="rodMain-cost">
								<div class="changename">需支付总费用：<span class="bgcol-red">￥${payMoney}</span></div>
							</div>
						</div>
						<div class="dispear"><a href="#" class="button button-big changedisp">还&nbsp;&nbsp;&nbsp;&nbsp;书</a></div>
					`);
				
					$rodMain.append(html.join(''));
					if (payStatus==5 && yetStatus==10 && payMoney==0){  //未支付已还书,需支付金额为0,则不显示 还书
						$(".dispear").html(""); 
					}else if(payStatus==5 && yetStatus==10 && payMoney!=0) //未支付已还书,需支付金额不为0,则显示 支付
						{
							$(".changedisp").html("支&nbsp;&nbsp;&nbsp;&nbsp;付");
						}else if(payStatus==10 && yetStatus==10 && payMoney!=0) //已支付已还书,支付金额不为0,则不显示
						{
							$(".dispear").html(""); 
							$(".changename").html(`结算费用：<span>￥${payMoney}</span>`); 
						}else if(payStatus==5 && yetStatus==5)					// 未支付未还书,则显示 还书
						{
							$(".changedisp").html("还&nbsp;&nbsp;&nbsp;&nbsp;书");
						}
				}else if(data.result_code === "1002"){
					$.toast('参数为空，或参数错误');
				}
			},
			error: function(xhrFields,status){
				if(status == 'timeout'){
					alert("请求超时！");
				}
			}
		});
	},
	returnBooks:function(orderNo){		//还书
		let token = $.fn.cookie('bookToken');
		let nameplate = window.sessionStorage['nameplate'];
		console.log(nameplate);
		if(nameplate=='undefined'){
			$.alert("请到终端扫码还书",function(){});
		}else{
			$.ajax({
				dataType: "json",
				type:"post",
				url: Config.remoteAddress + "wechat/returnBooks",
				async:true,
				timeout: 10000,
				data:{
					token:token,
					orderNo:orderNo,
					nameplate:nameplate
				},
				success:function(data){
					if(data.result_code == "0000"){
						var orderNum = window.sessionStorage['commercialOrderno'];
						var totalPrice = window.sessionStorage['payMoney'];
			
						setInterval(function() {
                            $.ajax({
                                dataType: "json",
                                async: true,
                                timeout: 10000, //加载事件限制 10秒
                                type: "post",
                                url: Config.remoteAddress + "wechat/isReturn",
                                data: {
                                    outTradeNo: orderNo
                                },
                                success: function(ress) {
                                    console.log(ress);
                                    if(ress.result_code == "0000") {
                                        window.sessionStorage['result'] = ress.result;
                                        if(ress.result == "2"){
                                        	$.toast("还书成功！"); 
                                        	window.location.href =Config.rootPath + "returntheorder/returnOrder.html";
                                        }else if(ress.result == "1"){
                                            
                                        }
                                    } else if(ress.result_code == "1111") {} else if(ress.result_code == "1002") {
                                        $.toast("缺少必要的参数！");
                                    } else {
                                        alert("")
                                    }
                                },
                                error: function(xhrFields, status) {
                                    if(status == 'timeout') {
                                        $.toast("请求超时！");
                                    }
                                }
                            });
                        }, 2000);
						/*else{
							var payurl="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx514de7190265c900&redirect_uri=http%3A%2F%2Fsmartbox1.yikel.cn%2Fapi%2Fwechat%2FwxAuth&response_type=code&scope=snsapi_userinfo&state=2:"+orderNum+":"+totalPrice+"#wechat_redirect";
							// alert(payurl);
							window.location.href = payurl;
						}*/
						
					}else if(data.result_code === "1111"){
						$.toast("系统异常");
					}else if(data.result_code === "1002"){
						$.toast("缺少必要的参数");
					}
				},
				error: function(xhrFields,status){
					if(status == 'timeout'){
						alert("请求超时！");
					}
				}
			});
		}
	},
	bindBtn:function(){
		$(".rodMain").on('touchstart','.button',function(){	//还书
			var totalPrice = window.sessionStorage['payMoney'];
			if (totalPrice==0){
					var orderNo = window.sessionStorage['commercialOrderno'];
					BOrderDetails.returnBooks(orderNo);
				}else
					{
						var url = decodeURI(location.search); 	//解码获取参数值
						var Request = new Object();
						if(url.indexOf("?") != -1) {
							var str = url.substr(1); 			//截取？后面的所有字符串substr(1); 			//截取？后面的所有字符串
							strs = str.split("&"); 				//按照&分割成字符串数组
							for(var i = 0; i < strs.length; i++) {
								Request[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
							}
						}
						var wxOpenid = Request["wxOpenid"]; 			//微信openid
						let orderNo = window.sessionStorage['commercialOrderno'];
						let payStatus = window.sessionStorage['payStatus'];
						let yetStatus = window.sessionStorage['yetStatus'];
						if(yetStatus==10 && payStatus==5)
							{
								var payurl=Config.WxPayUrl + "2:"+orderNo+":"+totalPrice+"#wechat_redirect";
								window.location.href = payurl;
							}else
							{
								window.location.href = "preReturn.html"; 
							}
						
					}
				
			 
		});
	},
	init:function(){
		this.orderDetail();
		this.bindBtn();
	}
};

$(function(){
	BOrderDetails.init();
});