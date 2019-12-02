//注册功能
;
var Register = {
	//验证手机号码
	phoness: false,
	regPhone: function($phone) {
		var reg = /^1[34578]\d{9}$/;
		if($phone == "") {
			$(".errMsg").eq(0).html("请输入开户手机号").css("color","#fc0000").addClass("errMsgShow");
			this.phoness = false;
		} else if(reg.test($phone)) {
			$(".errMsg").eq(0).html("").removeClass("errMsgShow");
			this.phoness = true;
		} else {
			$(".errMsg").eq(0).html("手机号码格式错误").css("color","#fc0000").addClass("errMsgShow");
			this.phoness = false;
		}
	},
	//验证输入的密码
	pwdss: false,
	regPwd: function($pwd) {
		var reg = /^[0-9|A-Z|a-z]{6,16}$/;
		if($pwd == "") {
			$(".errMsg").eq(1).html("密码不能为空").css("color","#fc0000").addClass("errMsgShow");
			this.pwdss = false;
		} else if(reg.test($pwd)) {
			$(".errMsg").eq(1).html("").removeClass("errMsgShow");
			this.pwdss = true;
		} else {
			$(".errMsg").eq(1).html("长度为6-16位字母数字").css("color","#fc0000").addClass("errMsgShow");
			this.pwdss = false;
		}
	},
	//验证输入的密码
	pwdss2: false,
	againPwd: function() {
		var reg = /^[0-9|A-Z|a-z]{6,16}$/;
		var searchPwd = $("#searchPwd").val();	//第一次的密码
		var repsword = $("#searchPwd2").val();	//第二次的密码
		if(repsword == "") {
			$(".errMsg").eq(2).html("密码不能为空").css("color", "#fc0000").addClass("errMsgShow");
			this.pwdss2 = false;
		} else if(searchPwd != repsword) {
			$(".errMsg").eq(2).html("两次密码不一致，请重新输入").css("color", "#fc0000").addClass("errMsgShow");
			this.pwdss2 = false;
		} else if(reg.test(repsword)) {
			$(".errMsg").eq(2).html("").removeClass("errMsgShow");
			this.pwdss2 = true;
		} else {
			$(".errMsg").eq(2).html("长度为6-16位字母数字").css("color", "#fc0000").addClass("errMsgShow");
			this.pwdss2 = false;
		}
	},
	//验证码	
	securityCodess: false,
	countdown: 120, //验证码的时间
	regSCode: function($sCode) {
		var reg = /^[0-9]{6}$/;
		if($sCode == "") {
			$(".errMsg").eq(3).html("请输入验证码").css("color","#fc0000").addClass("errMsgShow");
			this.securityCodess = false;
		} else if(reg.test($sCode)) {
			$(".errMsg").eq(3).html("").removeClass("errMsgShow");
			this.securityCodess = true;
		} else {
			$(".errMsg").eq(3).html("验证码为6位数字").css("color","#fc0000").addClass("errMsgShow");
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
				setTimeout(Register.setTime($val), 1000);
			}, 1000);
		}
	},
	regSetYzm: function($yzmBtn) {
		var flag = 0;
		if(this.phoness && this.pwdss) {
			var $searchPhone = $("#searchPhone").val();
			$.ajax({
				dataType: "json",
				type: "post",
				async: false,
				timeout: 10000, //加载事件限制 10秒
				url: Config.remoteAddress + "login/sendMobileCode",
				data: {
					"mobile": $searchPhone,
					"type": 1 	//注册验证码
				},
				success: function(result) {
					if(result.result_code == "0000") { //success
						flag = 1;
						setTimeout(Register.setTime($yzmBtn), 1000);
					} else {
						// alert(result.result_hint);
						alert("调用短信验证码接口异常");
						return;
					}
				}
			});
		}else{alert("请填写完全")};
	},
	//获取注册的手机信息
	registered: function(wxOpenid) {
		var $searchPhone = $("#searchPhone").val();
		var $searchPwd = $("#searchPwd").val();
		var $searchPwd2 = $("#searchPwd2").val();
		var $searchYzm = $("#searchYzm").val();
		$.ajax({
			dataType: "json",
			type: "post",
			url: Config.remoteAddress + "login/register",
			async: false,
			timeout: 10000,
			data: {
				mobile: $searchPhone,
				password: $searchPwd,
				surePwd: $searchPwd2,
				code: $searchYzm,
				source: 1,
				openId: wxOpenid
			},
			success: function(data) {
				if(data.result_code == "0000") {
					$.toast("注册成功");
					setTimeout(function(){
						window.location.href = Config.rootPath + "loginregister/login.html"; //首页
					},1000);
				} else if(data.result_code == "1111") {
					$.toast("系统异常");
				} else if(data.result_code == "1002") {
					$.toast("请填写完全");
				} else if(data.result_code == "1103") {
					$.toast("密码不一致,请重新输入");
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
	outBlack: function() { //授权调后台拿wxOpenid
		 window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6914fdfd5fce8e7e&redirect_uri=http%3A%2F%2Ftest.yikel.com%2Fapi%2Fwechat%2FuserWxAuth&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect";
	},
	//绑定事件
	bindRes: function() {
		$("#searchPhone").on('input propertychange',function() {
			var $searchPhone = $("#searchPhone").val();
			Register.regPhone($searchPhone);
		});
		$("#searchPwd").on('input propertychange',function() {
			var $searchPwd = $("#searchPwd").val();
			Register.regPwd($searchPwd);
		});
		$("#searchPwd2").on('input propertychange',function() {
			Register.againPwd();
		});
		$(".zcSecurityCode").on('touchstart', function() { //验证码按钮
			if(!Register.phoness){
				var $searchPhone = $("#searchPhone").val();
				Register.regPhone($searchPhone);
			}else if(!Register.pwdss){
				var $searchPwd = $("#searchPwd").val();
				Register.regPwd($searchPwd);
			}else if(!Register.pwdss2){
				Register.againPwd();
			}else if(Register.phoness && Register.pwdss && Register.pwdss2){
				var $zcSecurityCode = $(".zcSecurityCode");
				Register.regSetYzm($(".zcSecurityCode"));
			}else{
				alert("请填写完全");
			}
		});
		$("#searchYzm").on('input propertychange',function() {
			var $searchYzm = $("#searchYzm").val();
			Register.regSCode($searchYzm);
		});
		
		$(".zcRes").on('touchstart', function() { //注册按钮
			if(Register.phoness && Register.pwdss && Register.pwdss2 && Register.securityCodess) {
				var wxOpenid = window.sessionStorage["wxOpenid"];
				
				Register.registered(wxOpenid);
			} else {
				var $searchPhone = $("#searchPhone").val();
				Register.regPhone($searchPhone);
				var $searchPwd = $("#searchPwd").val();
				Register.regPwd($searchPwd);
				Register.againPwd();
				var $searchYzm = $("#searchYzm").val();
				Register.regSCode($searchYzm);
			}
		});
		$("#fanhui").on('touchstart', function() { //返回
			window.location.href = Config.rootPath + "loginregister/login.html"; //登录页面
		});
	},
	//初始化
	init: function() {
		this.bindRes();
	}
};
$(function() {
	//Register.init();
	var url = decodeURI(location.search); 	//解码获取参数值
	var Request = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1); 			//截取？后面的所有字符串
		strs = str.split("&"); 				//按照&分割成字符串数组
		for(var i = 0; i < strs.length; i++) {
			Request[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	var wxOpenid = Request["wxOpenid"]; 			//微信openid
	window.sessionStorage["wxOpenid"] = wxOpenid;
	if(wxOpenid != undefined) {
		Register.init();
	}else{
		Register.outBlack();
	}
})