/**
 *3.8女神节
 */
;
var Goddess = {
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
			$(".rtCwts span").html("该号码已经被注册！<a class='cccc' href='javascript:void(0)'>立即登录</a>");
			$(".cccc").on('touchstart', function() { //立即登录
				window.location.href = Config.rootPath + "loginregister/login.html"; //登录页面
			});
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
			if(Goddess.phoneExist()) {
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
	//验证输入的图形验证码是否输入
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
				setTimeout(Goddess.setTime($val), 1000);
			}, 1000);
		}
	},
	regSetYzm: function($yzmBtn) {
		var flag = 0;
		if(this.phoness) {
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
						setTimeout(Goddess.setTime($yzmBtn), 1000);
					} else {
						alert(result.result_hint);
						return;
					}
				}
			});
		}
	},
	register38: function(yikeleRecommendCode, wxOpenid){		//微信用户进入公众号在38节页面用手机号码注册成为会员
		if(yikeleRecommendCode == "undefined" || yikeleRecommendCode == undefined){
			yikeleRecommendCode = 0;
		}
		var $searchPhone = $("#searchPhone").val();	//手机号码
		var $searchYzm = $("#searchYzm").val();		//短信验证码
		$.ajax({
			dataType:'json',
			type:'post',
			async: false,
			timeout: 10000,
			url: Config.remoteAddress + "wechat/register38",
			data:{
				mobile:$searchPhone,
				password:"888888",
				vcode:$searchYzm,
				recommendCode:yikeleRecommendCode,
				openid:wxOpenid
			},
			success: function(data){
				if(data.result_code == "0000"){
					console.log("成功！");
					$.toast("领取成功！");
					setTimeout(function() {
						window.location.href = Config.rootPath + "loginregister/receiveSuccess.html";	//领取成功页面
					}, 1500);
				}else if(data.result_code == "1111"){
					//alert("系统异常");
				}else if(data.result_code == "1002"){	//缺少必要的参数跳转登录页面
					alert("请先登录");
					window.location.href = Config.rootPath + "loginregister/login.html";	//登录页面
				}else if(data.result_code == "1022") {
					$.toast("操作频繁，请稍后再试");
				}else if(data.result_code == "2012"){	
					$.toast("验证码错误或已失效");
				}
			},
			error: function(xhrFields,status){
				if(status == 'timeout'){
					alert("请求超时！");
				}
			}
		});	
	},
	
	//绑定事件
	bindRes: function() {
		$("#searchPhone").on('input propertychange', function() { 	//手机号码输入框
			var $searchPhone = $("#searchPhone").val();
			Goddess.regPhone($searchPhone);
		});
		$("#inputCode").on('input propertychange', function() { 	//验证图形验证码是否输入
			var $inputCode = $("#inputCode").val();
			Goddess.txregSCode($inputCode);
		});
		$(".zcSecurityCode").on('touchstart', function() { 			//短信验证码按钮
			if(!Goddess.phoness){
				var $searchPhone = $("#searchPhone").val();
				Goddess.regPhone($searchPhone);
			}else if(!Goddess.txsecurityCodess){
				var $inputCode = $("#inputCode").val();
				Goddess.txregSCode($inputCode);
			}if(Goddess.phoness && Goddess.txsecurityCodess){
				
				//var $zcSecurityCode = $(".zcSecurityCode");
				Goddess.regSetYzm($(".zcSecurityCode"));
			}
		});
		$("#checkCode").on('touchstart',function(){		//图形验证码按钮
			$("#inputCode").val("");
		});
		$("#searchYzm").on('input propertychange', function() { 	//短信验证码输入框
			var $searchYzm = $("#searchYzm").val();
			Goddess.regSCode($searchYzm);
		});
		var yikeleRecommendCode = Request["yikeleRecommendCode"]; 	//邀请码	
		var wxOpenid = window.sessionStorage["wxOpenid"];
		$("#dgReg").on('touchstart', function() { 					//注册按钮
			if(!Goddess.phoness){
				var $searchPhone = $("#searchPhone").val();
				Goddess.regPhone($searchPhone);
			}else if(!Goddess.txsecurityCodess){
				var $inputCode = $("#inputCode").val();
				Goddess.txregSCode($inputCode);
			}else if(!Goddess.securityCodess){
				var $searchYzm = $("#searchYzm").val();
				Goddess.regSCode($searchYzm);
			}else if(Goddess.phoness && Goddess.txsecurityCodess && Goddess.securityCodess) {
				var wxOpenid = window.sessionStorage["yikeliwxOpenid"];
				if(wxOpenid == null){
					wxOpenid = "";
				}
				Goddess.register38(yikeleRecommendCode, wxOpenid);
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
		//state 第一个参数代表1：一颗栗、2：代表小盒子、3、微信公众号授权、4.女神节登录
		//第二个参数1：代表测试环境、2：代表正式环境
		window.location.href = Config.WxPayUrl + "4:1:"+ yikeleRecommendCode +"#wechat_redirect";
	},
	//初始化
	init: function() {
		this.bindRes();
	}
};
$(function() {
	//Goddess.init();
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
	window.sessionStorage["wxOpenid"] = wxOpenid;
	if(wxOpenid != undefined) {	
		Goddess.init();
	}else{
		Goddess.outBlack();
	}
})