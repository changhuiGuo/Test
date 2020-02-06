//注册功能
;
var CouponReg = {
	//获取手机信息验证是否存在
	phoneExist: function() {
		var $searchPhone = $("#searchPhone").val();
		var dat = "";
		$.ajax({
			dataType: "text",
			type: "post",
			async: false,
			timeout: 10000, //加载事件限制 10秒
			url: Config.remoteAddress + "wechat/checkMobile",
			data: {
				"mobile": $searchPhone
			},
			success: function(data) {
				dat = data;
			}
		});
		if(dat == "0") { //0 已经注册
			$(".rtCwts").css("display", "block");
			$(".rtCwts span").html("该号码已经被注册！");
			return false;
		} else if(dat == "1") { //1 没有注册
			$(".rtCwts").css("display", "none");
			return true;
		}
	},
	//验证手机号码
	phoness: false,
	regPhone: function($phone) {
		var reg = /^1[34578]\d{9}$/;
		if($phone == "") {
			$(".rtCwts").css("display", "block");
			$(".rtCwts span").html("请输入手机号！");
			this.phoness = false;
		} else if(reg.test($phone)) {
			console.log(CouponReg.phoneExist());
			if(CouponReg.phoneExist()) {
				$(".rtCwts").css("display", "none");
				this.phoness = true;
			} else {
				this.phoness = false;
			}
		} else {
			$(".rtCwts").css("display", "block");
			$(".rtCwts span").html("手机号码格式错误！");
			this.phoness = false;
		}
	},
	//验证输入的密码
	pwdss: false,
	regPwd: function($pwd) {
		var reg = /^[0-9|A-Z|a-z]{6,16}$/;
		if($pwd == "") {
			$(".rtCwts").css("display", "block");
			$(".rtCwts span").html("密码不能为空！");
			this.pwdss = false;
		} else if(reg.test($pwd)) {
			$(".rtCwts").css("display", "none");
			this.pwdss = true;
		} else {
			$(".rtCwts").css("display", "block");
			$(".rtCwts span").html("密码长度为6-16位字母数字！");
			this.pwdss = false;
		}
	},
	//验证输入的图形验证码
	txsecurityCodess: false,
	txregSCode: function($inputCode) {		//要修改的地方
		//var $inputCode1 = $inputCode.toLowerCase(); //输入框的验证码
		//var $checkCode1 = ($("#checkCode").html()).toLowerCase(); //右边点击的验证码		
		if($inputCode == "") {
			$(".rtCwts").css("display", "block");
			$(".rtCwts span").html("请输入图形验证码！");
			this.txsecurityCodess = false;
		} else {
			$(".rtCwts").css("display", "none");
			this.txsecurityCodess = true;
		}
//		else if($checkCode1 == $inputCode1) {
//			$(".rtCwts").css("display", "none");
//			this.txsecurityCodess = true;
//		} else {
//			$(".rtCwts").css("display", "block");
//			$(".rtCwts span").html("图形验证码输入错误！");
//			this.txsecurityCodess = false;
//		}
	},
	//验证码	
	securityCodess: false,
	countdown: 120, //验证码的时间
	regSCode: function($sCode) {
		var reg = /^[0-9]{6}$/;
		if($sCode == "") {
			$(".rtCwts").css("display", "block");
			$(".rtCwts span").html("请输入验证码！");
			this.securityCodess = false;
		} else if(reg.test($sCode)) {
			$(".rtCwts").css("display", "none");
			this.securityCodess = true;
		} else {
			$(".rtCwts").css("display", "block");
			$(".rtCwts span").html("验证码为6位数字！");
			this.securityCodess = false;
		}
	},
	setTime: function($val) {
		if(this.countdown == 0) {
			$val.html("获取验证码");
			this.countdown = 120;
		} else {
			$val.html(this.countdown + "s");
			this.countdown--;
			setTimeout(function() {
				setTimeout(CouponReg.setTime($val), 1000);
			}, 1000);
		}
	},
	regSetYzm: function($yzmBtn) {
		var flag = 0;
		if(this.phoness && this.pwdss) {
			var $searchPhone = $("#searchPhone").val();
			var $inputCode = $("#inputCode").val();		//图形验证码
			$.ajax({
				dataType: "json",
				type: "post",
				async: false,
				timeout: 10000, //加载事件限制 10秒
				url: Config.remoteAddress + "wechat/sendMobileCode",
				data: {
					"mobile": $searchPhone,
					"type": 8, //注册验证码
					"validateCode" :  $inputCode
				},
				success: function(result) {
					if(result.result_code == "0000") { //success
						flag = 1;
						setTimeout(CouponReg.setTime($yzmBtn), 1000);
					} else {
						alert(result.result_hint);
						return;
					}
				}
			});
		}
	},
	//获取注册的手机信息
	registered: function(yikeleRecommendCode, wxOpenid) {
		if(yikeleRecommendCode == "undefined" || yikeleRecommendCode == undefined){
			yikeleRecommendCode = 0;
		}
		var $searchPhone = $("#searchPhone").val();
		var $searchPwd = $("#searchPwd").val();
		var $searchYzm = $("#searchYzm").val();
		var $regHint = $("#regHint");
		$.ajax({
			dataType: "json",
			type: "post",
			url: Config.remoteAddress + "wechat/register",
			async: true,
			timeout: 10000,
			data: {
				mobile: $searchPhone,
				password: $searchPwd,
				vcode: $searchYzm,
				recommendCode: yikeleRecommendCode,
				openid: wxOpenid
			},
			success: function(data) {
				if(data.result_code == "0000") {
					$.toast("注册成功");
					setTimeout(function() {
						sessionStorage.setItem('yikeleRecommendCode', yikeleRecommendCode);
						window.location.href = Config.rootPath + "loginregister/login.html"; //首页
					}, 1000);
				} else if(data.result_code == "1111") {
					$.toast("系统异常2");
				} else if(data.result_code == "1002") {
					$.toast("请填写完全");
				} else if(data.result_code == "1022") {
					$.toast("操作频繁，请稍后再试");
				} else if(data.result_code == "1024") {
					$.toast("该手机号码已注册");
				} else if(data.result_code == "2012") {
					$.toast("验证码错误或已失效");
				}
			}
		});
	},
	getCouponSettingByScene: function(scene) { //获取各种场景中代金券的设置
		var yikelitoken = $.fn.cookie("yikelitoken");
		$.ajax({
			dataType: "json",
			type: "post",
			url: Config.remoteAddress + "wechat/getCouponSettingByScene",
			async: true,
			timeout: 10000,
			data: {
				scene: scene
			},
			success: function(data) {
				if(data.result_code == "0000") {
					var $sitopyhq = $(".sitop-yhq"),
						html = [],
						i = 0,
						len = data.result.length;
					var total = 0; 				//所有代金券的总金额 = total + 每一种面额的总金额
					var everyTypeTotal = 0; 	//每一种面额的总金额
					var zongshuTotal = 0; 		//代金券的总数量= 每一种面额的总数量 * 有几种面额

					if(scene == 1) {
						html.push('<div class="sitop-yhq-one">');
						for(var k = 0; k < len; k++) {
							var parValue = data.result[k].parValue; 	//代金券面额
							var couponNum = data.result[k].couponNum; 	//代金券数量
							zongshuTotal = zongshuTotal + couponNum;
							everyTypeTotal = parValue * couponNum;
							total = Number(total + everyTypeTotal);
						}
//						html.push('<p>' + total.toFixed(2) + '元优惠券(' + zongshuTotal + '张)，注册即可获得</p><p>');
						html.push('<p>' + total + '元优惠券(' + zongshuTotal + '张)，注册即可获得</p><p>');
						var total1 = 0;
						var str = '';
						for(; i < len; i++) {
							var parValue = data.result[i].parValue; 	//代金券面额
							var couponNum = data.result[i].couponNum; 	//代金券数量
							for(var j = 0; j < couponNum; j++) {
								str += parValue + "元+";
								everyTypeTotal = parValue * couponNum; 	//每一种面额的总金额 = 代金券面额 * 代金券数量
							}
							total1 = Number(total1 + everyTypeTotal);
						}
						var numberTotal1 = str.substring(0, str.length - 1)
						html.push(numberTotal1);
						if(total1 == 0) {
							html.push('<div class="bg-guzhang">暂无可用优惠卷</div>')
						} else {
//							html.push('=' + total1.toFixed(2) + '元</p></div>');
							html.push('=' + total1 + '元</p></div>');
						}
					} else if(scene == 2) {
						html.push('<div class="sitop-yhq-two">');
						for(var k = 0; k < len; k++) {
							var parValue = data.result[k].parValue; 	//代金券面额
							var couponNum = data.result[k].couponNum; 	//代金券数量
							zongshuTotal = zongshuTotal + couponNum;
							everyTypeTotal = parValue * couponNum;
							total = Number(total + everyTypeTotal);
						}
//						html.push('<p>' + total.toFixed(2) + '元优惠券(' + zongshuTotal + '张)，邀请好友注册即可获得</p><p>');
						html.push('<p>' + total + '元优惠券(' + zongshuTotal + '张)，邀请好友注册即可获得</p><p>');
						var total2 = 0;
						var str = '';
						for(; i < len; i++) {
							var parValue = data.result[i].parValue; 	//代金券面额
							var couponNum = data.result[i].couponNum; 	//代金券数量
							for(var j = 0; j < couponNum; j++) {
								str += parValue + "元+";
								everyTypeTotal = parValue * couponNum; 	//每一种面额的总金额 = 代金券面额 * 代金券数量
							}
							total2 = Number(total2 + everyTypeTotal);
						}
						var numberTotal2 = str.substring(0, str.length - 1)
						html.push(numberTotal2);
						if(total2 == 0) {
							html.push('<div class="bg-guzhang">暂无可用优惠卷</div>')
						} else {
//							html.push('=' + total2.toFixed(2) + '元</p></div>');
							html.push('=' + total2 + '元</p></div>');
						}
					}
					$sitopyhq.append(html.join(""));
				} else if(data.result_code == "1111") {
					$.toast("系统异常");
				} else if(data.result_code == "1002") {
					$.toast("请填写完全");
				} else if(data.result_code == "1022") {
					$.toast("操作频繁，请稍后再试");
				} else if(data.result_code == "1024") {
					$.toast("该手机号码已注册");
				} else if(data.result_code == "2012") {
					$.toast("验证码错误或已失效");
				}
			}
		});
	},
	//绑定事件
	bindRes: function() {
		$("#searchPhone").on('input propertychange', function() { 	//手机号码输入框
			var $searchPhone = $("#searchPhone").val();
			CouponReg.regPhone($searchPhone);
		});
		$("#searchPwd").on('input propertychange', function() { 	//密码输入框		
			//if(CouponReg.phoness){
				var $searchPwd = $("#searchPwd").val();
				CouponReg.regPwd($searchPwd);
			//}
		});
		$("#inputCode").on('input propertychange', function() { 	//验证图形验证码是否正确
			//if(CouponReg.phoness && CouponReg.pwdss) {
				var $inputCode = $("#inputCode").val();
				CouponReg.txregSCode($inputCode);
			//}
		});
		$(".zcSecurityCode").on('touchstart', function() { 			//验证码按钮
			if(!CouponReg.phoness){
				var $searchPhone = $("#searchPhone").val();
				CouponReg.regPhone($searchPhone);
			}else if(!CouponReg.pwdss){
				var $searchPwd = $("#searchPwd").val();
				CouponReg.regPwd($searchPwd);
			}else if(!CouponReg.txsecurityCodess){
				var $inputCode = $("#inputCode").val();
				CouponReg.txregSCode($inputCode);
			}if(CouponReg.phoness && CouponReg.txsecurityCodess && CouponReg.pwdss){
				var $zcSecurityCode = $(".zcSecurityCode");
				CouponReg.regSetYzm($(".zcSecurityCode"));
			}
			//if(CouponReg.phoness && CouponReg.txsecurityCodess && CouponReg.pwdss) {
				//var $zcSecurityCode = $(".zcSecurityCode");
				//CouponReg.regSetYzm($(".zcSecurityCode"));
			//} else {
				
			//}
		});
		$("#checkCode").on('touchstart',function(){		//图形验证码按钮
			$("#inputCode").val("");
		});
		$("#searchYzm").on('input propertychange', function() { 	//验证码输入框
			var $searchYzm = $("#searchYzm").val();
			CouponReg.regSCode($searchYzm);
		});
		var url = window.decodeURI(location.search); //获取url中"?"符后的字串,包括？号
		var Request = new Object();
		if(url.indexOf("?") != -1) {
			var str = url.substr("1");
			var strs = str.split("&");
			for(var i = 0; i < strs.length; i++) {
				Request[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		var yikeleRecommendCode = Request["yikeleRecommendCode"]; //邀请码	
		var wxOpenid = window.sessionStorage["wxOpenid"];
		$(".zcRes").on('touchstart', function() { //注册按钮
			if(!CouponReg.phoness){
				var $searchPhone = $("#searchPhone").val();
				CouponReg.regPhone($searchPhone);
			}else if(!CouponReg.pwdss){
				var $searchPwd = $("#searchPwd").val();
				CouponReg.regPwd($searchPwd);
			}else if(!CouponReg.txsecurityCodess){
				var $inputCode = $("#inputCode").val();
				CouponReg.txregSCode($inputCode);
			}else if(!CouponReg.securityCodess){
				var $searchYzm = $("#searchYzm").val();
				CouponReg.regSCode($searchYzm);
			}else if(CouponReg.phoness && CouponReg.pwdss && CouponReg.txsecurityCodess && CouponReg.securityCodess) {
				var wxOpenid = window.sessionStorage["yikeliwxOpenid"];
				CouponReg.registered(yikeleRecommendCode, wxOpenid);
			}
		});
		$("#fanhui").on('touchstart', function() { //返回
			window.location.href = Config.rootPath + "loginregister/login.html"; //登录页面
		});
		$(".signIn").on('touchstart', function() { //立即登录
			window.location.href = Config.rootPath + "loginregister/login.html"; //登录页面
		});
	},
	outBlack: function() { //调后台拿wxOpenid
		var yikeleRecommendCode = window.sessionStorage["yikeleRecommendCode"];
		if(yikeleRecommendCode == "undefined" || yikeleRecommendCode == undefined){
			yikeleRecommendCode = 0;
		}
		window.location.href = Config.WxPayUrl + "3:1:"+ yikeleRecommendCode +"#wechat_redirect";
	},
	//初始化
	init: function() {
		this.bindRes();
		this.getCouponSettingByScene(1);
		setTimeout(function() {
			CouponReg.getCouponSettingByScene(2);
		}, 200);
	}
};
$(function() {
	//CouponReg.init();
	var url = decodeURI(location.search); 	//解码获取参数值
	var Request = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1); 			//截取？后面的所有字符串
		strs = str.split("&"); 				//按照&分割成字符串数组
		for(var i = 0; i < strs.length; i++) {
			Request[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	var yikeleRecommendCode = Request["yikeleRecommendCode"]; //邀请人id
	window.sessionStorage["yikeleRecommendCode"] = yikeleRecommendCode;
	var wxOpenid = Request["wxOpenid"]; 			//微信openid
	window.sessionStorage["yikeliwxOpenid"] = wxOpenid;
	var yikelimemberName = Request["nicName"]; 		//微信用户名
	var yikelimemberImg = Request["headImgurl"]; 	//微信头像
	$.fn.cookie("yikelimemberName",yikelimemberName, { expires: 1 ,path: '/'});	//设置cookie保存1天
	$.fn.cookie("yikelimemberImg",yikelimemberImg, { expires: 1 ,path: '/'});	
	window.sessionStorage["wxOpenid"] = wxOpenid;
	if(wxOpenid != undefined) {
		CouponReg.init();
	}else{
		CouponReg.outBlack();
	}
})