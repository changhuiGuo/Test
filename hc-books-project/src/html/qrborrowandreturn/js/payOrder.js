;var PayOrder = {
	getPay: function() { 	//下单的请求
		var url = decodeURI(location.search); 
		var Request = new Object();
		if(url.indexOf("?") != -1) {
			var str = url.substr(1); 
			strs = str.split("&"); 
			for(var i = 0; i < strs.length; i++) {
				Request[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		var wxOpenid = Request["wxOpenid"]; 	//微信id
		var state = Request["state"]; 			//state
		var arr = new Array();
		arr = state.split(":");
		var type = arr[0];
		//alert(wxOpenid);
		//alert((wxOpenid==null || wxOpenid== undefined || wxOpenid=="null"));
		if(wxOpenid==null || wxOpenid== undefined || wxOpenid=="null")
			{
				var payurl=Config.WxPayUrl + arr[0]+":"+arr[1]+":"+arr[2]+"#wechat_redirect";
				window.location.href = payurl;
			}else
				{
				//alert(Config.remoteAddress);
				$.ajax({
					dataType: "json",
					type: "post",
					async: false,
					timeout: 10000,
					url: Config.remoteAddress + "wechat/addOrder",
					data: {
						openId: wxOpenid,
						state: state,
						type: type
					},
					success: function(data) {
						if(data.result_code == "0000") {
							var result = data.result.payObj; 	//支付信息内容
							//orderNo = data.result.orderNo; 		//订单号
							//window.sessionStorage["orderNo"] = orderNo;
							wx.config({
								debug: false,
								appId: result.appId,
								timestamp: result.timeStamp,
								nonceStr: result.nonceStr,
								signature: result.paySign,
								jsApiList: ['chooseWXPay']
							});
							setTimeout(function() {
								wx.chooseWXPay({
									'timestamp': result.timeStamp,
									'nonceStr': result.nonceStr,
									'package': result.package,
									'signType': 'MD5',
									'paySign': result.paySign,
									success: function(res) {
										// PayOrder.isPay();
										if(type == 1){
											
											window.location.href = Config.rootPath + "returntheorder/returnOrder.html";
											window.sessionStorage["takeBook"] = "1";	//支付成功押金,开锁取书
										}else if(type == 2){
											window.location.href = Config.rootPath + "returntheorder/payState.html?payState=1";
										}else if(type == 3){
											window.location.href = Config.rootPath + "returntheorder/returnSucess.html";
										}
										
									},
									cancel: function(res) {
										window.location.href = Config.rootPath + "returntheorder/payState.html?payState=0";
									},
									fail: function(res) {
										alert("支付失败" + JSON.stringify(res));
									}
								});
							}, 1000);
						} else if(data.result_code == "1111") {
							$.toast('系统异常');
						} else if(data.result_code == "1002") { //缺少必要的参数
							$.toast('缺少必要的参数');
						} 
					}
				})
				}
	},	
	isPay: function() {
		var orderNo = window.sessionStorage["orderNo"];
		setInterval(function() {
			$.ajax({
				dataType: "json",
				async: true,
				timeout: 10000, //加载事件限制 10秒
				type: "post",
				url: Config.remoteAddress + "wechat/isPay",
				data: {
					outTradeNo: orderNo
				},
				success: function(ress) {
					if(ress.result_code == "0000") {
						window.location.href = Config.rootPath + "order/order.html";
					} else if(ress.result_code == "1111") {} else if(ress.result_code == "1002") {
						$.toast("缺少必要的参数！");
					}
				},
				error: function(xhrFields, status) {
					if(status == 'timeout') {
						$.toast("请求超时！");
					}
				}
			});
		}, 1000);
	},
	init: function() {	
		// this.isPay();
		this.getPay();
	}
}
$(function(){
	PayOrder.init();
});
