//用户下单
;var PayOrder = {
	getCoupon: function() { //获取商品信息、优惠券内容		
		var url = decodeURI(window.location.search); 
		var Request = new Object();
		if(url.indexOf("?") != -1) {
			var str = url.substr(1); 	
			strs = str.split("&"); 
			for(var i = 0; i < strs.length; i++) {
				Request[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		var wxOpenid = Request["wxOpenid"]; //微信openid
		if(wxOpenid != undefined) {
			var couponPickerId = window.sessionStorage["couponid"];	
			var payMoney = window.sessionStorage["payMoney"];	
			if(payMoney == 0){
				alert("抱歉！由于支付金额为0元，支付失败");
				window.location.href = Config.rootPath + "mainpage/index.html";
			}else{
				PayOrder.getPay(couponPickerId);
			}
			$(".paconMain").html("");
		} else {
			var url = decodeURI(location.search); 	//解码获取参数值
			var Requests = new Object();
			if(url.indexOf("?") != -1) {
				var str = url.substr(1); 			//截取？后面的所有字符串
				strs = str.split("&"); 				//按照&分割成字符串数组
				for(var i = 0; i < strs.length; i++) {
					Requests[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
				}
			}			
			var devNumber = Requests["devNumber"]; 			//Decmac值
			var goodsName = Requests["goodsName"]; 			//商品名称
			var tasteName = Requests["tasteName"]; 			//口味名称
			var price = Requests["price"]; 					//价格
			var weight = Requests["weight"];				 //重量
			var planId = Requests["planId"]; 				//营销ID
			var token = $.fn.cookie("yikelitoken");			
			var ips = window.sessionStorage["ip"]; 			//ip
			window.sessionStorage["wxOpenid"] = wxOpenid; 	//微信opendid			
			//商品信息
			var $poUlli = $(".poUlli"),
				html = [];
			html.push('<li class="liFirst"><span>商品名称</span><br /><p class="suqian">' + goodsName + '</p></li>');
			html.push('<li class="liSy"><span>数量</span><br /><p class="number">1</p></li>');
			html.push('<li class="liSy"><span>份量</span><br /><p class="weight ">杯</p></li>');
			html.push('<li class="liSy borr"><span>价格</span><br /><p class="price">￥' + Number(price).toFixed(1) + '</p></li>');
			$poUlli.append(html.join(""));
			if(token != undefined) { //有优惠的时候token没拿到，必须跳转登录页面
				$.ajax({
					dataType: "json",
					type: "post",
					async: false,
					timeout: 10000,
					url: Config.remoteAddress + "wechat/getMarketingplan",
					data: {
						price: price,
						planId: planId,
						ip: ips,
						token: token
					},
					success: function(data) {
						if(data.result_code == "0000") {
							var payMoney = (Number(data.result.payMoney)).toFixed(2); 	//折后价
							var discountMoney = (price - payMoney).toFixed(2);			//优惠价=实际价格-折后价
							console.log(discountMoney);
							window.sessionStorage["discountMoney"] = discountMoney; 
							window.sessionStorage["payMoney"] = payMoney; 							
							var htmlCoupon3 = [],
								htmlCoupon4 = [],
								$cdCoupon = $(".cdCoupon"),
								$zfBarTab = $(".zfBarTab");	
						
							htmlCoupon3.push('<div class="card-header no-border">');
							htmlCoupon3.push('<span>优惠折扣</span>');
							htmlCoupon3.push('<span class="bg-guzhang">-￥' + discountMoney + '</span>');
							htmlCoupon3.push('</div>');
							htmlCoupon3.push('<div class="card-header no-border yhzonge"><span>优惠总额:</span><span class="bg-guzhang">-￥' + discountMoney + '</span>');
							htmlCoupon3.push('</div></div>');
							$cdCoupon.append(htmlCoupon3.join(""));
							htmlCoupon4.push('<div id="wenxin">【温馨提示】订单支付成功后，不支持申请退款操作。</div>');
							htmlCoupon4.push('<div id="cope-with">应付金额：<span>￥' + payMoney + '</span></div><div id="immediately">立即支付</div>');
							$zfBarTab.append(htmlCoupon4.join(""));
						} else if(data.result_code == "1111") {
							alert("系统异常1");
						} else if(data.result_code == "1002") { //缺少必要的参数跳转登录页面
							alert("下单失败");
						} else if(data.result_code == "1022") {
							alert("操作频繁，请稍后操作!");
						} else if(data.result_code == "1023") { //token异常跳转登录页面（一进来就判断token有没有实现，所以这里就不用判断了）
							//alert("请先登录!");
							//window.location.href = Config.rootPath + "loginregister/login.html";
						}
					}
				});
			} else {
				window.location.href = Config.rootPath + "loginregister/login.html";
			}
		}
	},
	usableCouponList: function() { //下单时所有可用的代金券
		var devNumber = window.sessionStorage["devNumber"];
		var price = window.sessionStorage["price"];
		var planId = window.sessionStorage["planId"];
		var zkMoney = window.sessionStorage["zkMoney"];
		var total= "";
		if(planId == 0){
			total = price; 		//没优惠-原价
		}else {
			total = zkMoney; 	//有优惠-折后价
		}		
		var yikelitoken = $.fn.cookie("yikelitoken");
		var payMoney = window.sessionStorage["payMoney"];	//应付金额(原价或者折后价)		
		$.ajax({
			dataType: "json",
			type: "post",
			async: false,
			timeout: 10000,
			url: Config.remoteAddress + "wechat/usableCouponList",
			data: {
				total: total,
				devMac: devNumber,				
				token: yikelitoken
			},
			success: function(data) {
				if(data.result_code == "0000") {
					var htmlCouponList = [],
						$cdCoupon = $(".cdCoupon"),
						i = 0,
						len = data.result.length,
						parValuearray = [];
					htmlCouponList.push('<div class="card-header no-border"><span>优惠券</span>');
					if(len == 0 || discountType == "2") {
						htmlCouponList.push('<input type="text" id="couponPicker1" placeholder="暂无" readonly="readonly" />'); 
					} else {
						htmlCouponList.push('<a href="javascript:void(0)" class="create-popup qingxuanz cdYouhuijuan">请选择<i class="icon iconfont icon-xiala"></i></a>');
					}
//					htmlCouponList.push('</div><div class="cdCoupon-state">说明：大于应付金额的优惠券已被系统过滤</div>');
					$cdCoupon.append(htmlCouponList.join(""));
					//加载优惠券列表
					var $paconMain = $(".tcCon"),html = [];
					html.push('<div class="content-block zjmCbk tcCon-height">');
					html.push('<div class="cdtanchucheng">');
					html.push('<p>优惠卷列表</p>');
					html.push('<ul class="clearfix">');
					for (;i<len;i++) {
						var id = data.result[i].id;
						var parValue = data.result[i].parValue;
						var discountType = data.result[i].discountType;		//优惠类型(1_金额,2_折扣)（50就是5折）
						if(discountType == "1"){
							html.push('<li data-parValue="'+ parValue +'" data-id="'+ id+'">');
							html.push('<label class="label-checkbox item-content">');
							html.push('<div class="item-inner">');
							html.push('<input type="radio" name="my-radio">');
							html.push('<div class="item-media clearfix">');
							html.push('<div class="left">下单立减'+ parValue +'元<span class="tab-label">（大于商品价格无法使用）</span></div>');
							html.push('<div class="danxuankuan right"><i class="icon icon-form-checkbox icondanxuan"></i></div>');
							html.push('</div>');
							html.push('</div>');
							html.push('</label>');
							html.push('</li>');
						}	
					}
					html.push('</ul><div class="kongRem1"></div>');
					html.push('</div>');
					html.push('</div>');
					$paconMain.append(html.join(""));
					html.push('<p class="cdtanchucheng-close clearfix">');
					html.push('<a href="javascript:void(0)" class="button button-warning cdtanchucheng-guangbi">取消已选的优惠券</a>');
					html.push('<a href="javascript:void(0)" class="button button-warning cdtanchucheng-qued">确定</a>');
					html.push('</p>');
				} else if(data.result_code == "1111") {
					alert("系统异常2");
					window.location.href = Config.rootPath + "mainpage/index.html";
				} else if(data.result_code == "1002") { //缺少必要的参数跳转登录页面
					alert("请先登录!");
					window.location.href = Config.rootPath + "loginregister/login.html";
				} else if(data.result_code == "1022") {
					alert("操作频繁，请稍后操作!");
				} else if(data.result_code == "1023") { //token异常跳转登录页面（一进来就判断token有没有实现，所以这里就不用判断了）
					//alert("请先登录!");
					//window.location.href = Config.rootPath + "loginregister/login.html";
				}
			}
		});
	},
	getCouponCount: function(){		//优惠券列表页面今日已使用代金券数量
		var yikelitoken = $.fn.cookie("yikelitoken");
		$.ajax({
			dataType: 'json',
			type: 'post',
			timeout: 10000,
			url: Config.remoteAddress + "wechat/couponCount",
			data: {
				token: yikelitoken
			},
			success:function(data){
				if(data.result_code == "0000"){
					var todayUsed = data.result.todayUsed;			//今日已使用代金券数量
					window.sessionStorage["todayUsed"] = todayUsed;
				}else if(data.result_code == "1111"){
					alert("系统异常3");
				}else if(data.result_code == "1002"){	//缺少必要的参数跳转登录页面	
					alert("请先登录");
					window.location.href = Config.rootPath + "loginregister/login.html";
				}else if(data.result_code == "1022"){
					//alert("操作频繁，请稍后操作!");	
				}else if(data.result_code == "1023"){	//token异常跳转登录页面
					alert("请先登录");
					window.location.href = Config.rootPath + "loginregister/login.html";	
				}
			}
		});
	},
	outBlack: function() { //调后台拿wxOpenid
		var url = decodeURI(location.search); 
		var Request = new Object();
		if(url.indexOf("?") != -1) {
			var str = url.substr(1); 
			strs = str.split("&"); 
			for(var i = 0; i < strs.length; i++) {
				Request[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		var devNumber = Request["devNumber"]; 	//Decmac值
		var weight = Request["weight"]; 		//重量
		var zkMoney = Request["zkMoney"]; 		//折后价
		var planId = Request["planId"]; 		//优惠
		var zfprice = undefined;
		if(planId == 0){
			zfprice = Request["price"]; 		//没优惠-原价
		}else {
			zfprice = Request["zkMoney"]; 		//有优惠-折后价
		}
		var couponid = window.sessionStorage["couponid"];
		if(couponid == undefined){
			couponid = "";
		}
		var id = $.fn.cookie("id");
		var mobile = $.fn.cookie("yikelimobile");
		var token = $.fn.cookie("yikelitoken");
		var ips = $.fn.cookie("ips");
		window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx514de7190265c900&redirect_uri=http%3A%2F%2Ftest.yikel.com%2FwechatAuth%2FwxAuth&response_type=code&scope=snsapi_userinfo&state=1:" + id + ":" + devNumber + ":" + zfprice + ":" + mobile + ":0:1:1#wechat_redirect";
	},
	getPay: function(couponPickerId) { //下单的请求
		var url = decodeURI(location.search); 
		var Request = new Object();
		if(url.indexOf("?") != -1) {
			var str = url.substr(1); 
			strs = str.split("&"); 
			for(var i = 0; i < strs.length; i++) {
				Request[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		var devNumber = Request["devNumber"]; 			//Decmac值
		var weight = Request["weight"]; 				//重量
		var wxOpenid = Request["wxOpenid"]; 			//微信id
		var id = $.fn.cookie("id");						//登录ID
		var yikelimobile = $.fn.cookie("yikelimobile");	//用户手机号码
		var token = $.fn.cookie("yikelitoken");			//token令牌
		var ips = $.fn.cookie("ips");					//ip
		window.sessionStorage["wxOpenid"] = wxOpenid; 	//微信Id
		$.ajax({
			dataType: "json",
			type: "post",
			async: false,
			timeout: 10000,
			url: Config.remoteAddress + "wechat/addOrder",
			data: {
				devMac: devNumber,
				wight: weight,
				userMobile: yikelimobile,
				token: token,
				ip: ips,
				wxOpenId: wxOpenid,
				couponId: couponPickerId
			},
			success: function(data) {
				if(data.result_code == "0000") {
					var result = data.result.payObj; 	//支付信息内容
					orderNo = data.result.orderNo; 		//订单号
					window.sessionStorage["orderNo"] = orderNo;
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
								PayOrder.isPay();PayOrder.isPay();
							},
							cancel: function(res) {
								window.location.href = Config.rootPath + "mainpage/index.html";
							},
							fail: function(res) {
								alert("支付失败" + JSON.stringify(res));
							}
						});
					}, 1000);
					$(".button").attr("href", "javascript:PayOrder.getPay()");
				} else if(data.result_code == "1111") {
					alert("抱歉！由于支付金额为0元，支付失败");
					window.location.href = Config.rootPath + "mainpage/index.html";
				} else if(data.result_code == "1002") { //缺少必要的参数跳转登录页面
					alert("请先登录!");
					window.location.href = Config.rootPath + "loginregister/login.html";
				} else if(data.result_code == "1022") {
					//alert("操作频繁，请稍后操作!");
				} else if(data.result_code == "1023") { //token异常跳转登录页面
					alert("请先登录!");
					//window.location.href = Config.rootPath + "loginregister/login.html";
				} else if(data.result_code == "1043") { //代金券失效或不可用
					alert("代金券失效或不可用!");
					window.location.href = Config.rootPath + "mainpage/index.html";
				}
			}
		})
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
	bindBtn: function() { 
		$("header>a").on('touchstart', function() { //返回按钮
			window.location.href = Config.rootPath + "mainpage/index.html";
		});		
		$(".zfBarTab").on('touchstart', '#immediately', function() { //下单按钮
			var couponPickerId = window.sessionStorage["couponid"];	
			var payMoney = window.sessionStorage["payMoney"];		//金额等于零的时候给提示
			var id = $.fn.cookie("id");
			var wxOpenid = window.sessionStorage["wxOpenid"];
			if(id == undefined) {
				window.location.href = Config.rootPath + "loginregister/login.html";
				return;
			}
			if(wxOpenid != "undefined") {
				if(payMoney == 0){
					alert("抱歉！由于支付金额为0元，支付失败");
					window.location.href = Config.rootPath + "mainpage/index.html";
				}else{
					PayOrder.getPay(couponPickerId);
				}				
			} else {
				PayOrder.outBlack();
			}
		});
		//*******************************************************
		$(".cardyouhui").on('click','.create-popup', function () {		//请选择按钮
			var todayUsed = window.sessionStorage["todayUsed"];			//今日已使用优惠券的数量
			if(todayUsed >= 3){
				$.toast("抱歉！每天最多使用三张优惠券");
			}else{
				var display = $(".tcCon").css("display");
				if(display == "block"){
					$.closeModal('.tcCon');
					$(".cdtanchucheng-close").hide();
				}else if(display == "none"){
					$.popup('.tcCon');
					$(".cdtanchucheng-close").show();
				}
				$(".popup-overlay").remove();	//干掉popup弹出层
			}
		});
		$(".cdtanchucheng ul li").on('click', function () {					//li标签
			$(".cdCoupon-state").show();
			var couponid = $(this).attr('data-id');							//卡券id
			window.sessionStorage["couponid"] = couponid;		
			var dataparvalue = $(this).html().replace(/[^\d.]/ig,"");
			window.sessionStorage["dataparvalue"] = dataparvalue;			//卡券面额
			console.log(dataparvalue);
			var cc = $(".cdCoupon a").html('<div class="cdYouhuijuan">优惠卷:-￥' + Number(dataparvalue).toFixed(1) + '<i class="icon iconfont icon-xiala"></i></div>');
//			'<div class="left">下单立减'+ parValue +'元<span class="tab-label">（大于商品价格无法使用）</span></div>'

		});
		$(".cdtanchucheng-guangbi").on('click', function () {	//点击关闭的时候换成请选择
			$(".cdCoupon-state").hide();
			//$(".cdCoupon a").hide();
			$.closeModal('.tcCon');
			$(".cdCoupon a").html('请选择<i class="icon iconfont icon-xiala"></i>');
			$(".cdtanchucheng-close").hide();
			var dataparvalue = window.sessionStorage["dataparvalue"];			//代金券面额
			var discountMoney = window.sessionStorage["discountMoney"];			//优惠金额
			var payMoney = window.sessionStorage["payMoney"]; 					//应付金额(后台已经计算了折扣)									
			//**************分割线----优惠总额*****************
			var yfjine = (Number(discountMoney) + Number(dataparvalue));		//优惠总额=优惠金额+代金券券
			$(".cardyouhui .yhzonge span").eq(1).html("-￥" + discountMoney)
			//**************分割线----应付金额*****************
			$("#cope-with span").html("￥" + payMoney);
		});
		$(".cdtanchucheng-qued").on('click', function () {		//点击确定按钮事件
			$.closeModal('.tcCon');		
			$(".cdtanchucheng-close").hide();
			var dataparvalue = window.sessionStorage["dataparvalue"];			//代金券面额
			var discountMoney = window.sessionStorage["discountMoney"];			//优惠金额
			var payMoney = window.sessionStorage["payMoney"]; 					//应付金额(后台已经计算了折扣)									
			//**************分割线----优惠总额*****************
			var yfjine = (Number(discountMoney) + Number(dataparvalue));		//优惠总额=优惠金额+代金券券
			$(".cardyouhui .yhzonge span").eq(1).html("-￥" + yfjine)
			//**************分割线----应付金额*****************
			payMoney = ((Number(payMoney) - Number(dataparvalue))).toFixed(2);	//应付金额=应付金额-代金券金额
			if(payMoney <= 0){
				payMoney = 0;
			}
			$("#cope-with span").html("￥" + payMoney);
		});
	},
	init: function() {
		this.getCouponCount();
		this.usableCouponList();
		this.getCoupon();		
		this.bindBtn();
	}
};
$(function() {
	var token = $.fn.cookie("yikelitoken");
	if(token == null){		
		alert("请先登录");
		window.location.href = Config.rootPath + "loginregister/login.html";
	}else{
		PayOrder.init();
	}	
});