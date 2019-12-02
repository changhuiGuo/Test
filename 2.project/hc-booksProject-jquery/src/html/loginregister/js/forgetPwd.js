//重置密码功能
;
var MyForgetPwd = {
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
	
	//判断第一次输入的密码
	pwdss: false,
	onePwd: function() {
		var reg = /^[0-9|A-Z|a-z]{6,16}$/;
		var searchPwd = $("#searchPwd").val();
		if(searchPwd == "") {
			$(".errMsg").eq(1).html("密码不能为空").css("color", "#fc0000").addClass("errMsgShow");
			this.pwdss = false;
		} else if(reg.test(searchPwd)) {
			$(".errMsg").eq(1).html("").removeClass("errMsgShow");
			this.pwdss = true;
		} else {
			$(".errMsg").eq(1).html("长度为6-16位字母数字").css("color", "#fc0000").addClass("errMsgShow");
			this.pwdss = false;
		}
	},
	//判断再次输入的密码
	pwdss2:false,
	againPwd: function() {
		var reg = /^[0-9|A-Z|a-z]{6,16}$/;
		var searchPwd = $("#searchPwd").val();	//第一次的密码
		var repsword = $("#repsword").val();	//第二次的密码		
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
	//验证输入的图形验证码
	txsecurityCodess: false,
	txregSCode: function($inputCode) {		//要修改的地方		
		if($inputCode == "") {
			$(".errMsg").eq(3).html("请输入验证码").css("color","#fc0000").addClass("errMsgShow");
			$(".rtCwts span").html("请输入图形验证码！");
			this.txsecurityCodess = false;
		} else {
			$(".errMsg").eq(3).html("").removeClass("errMsgShow");
			this.txsecurityCodess = true;
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
				setTimeout(MyForgetPwd.setTime($val), 1000);
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
					"type": 1 	//忘记密码验证码
				},
				success: function(result) {
					if(result.result_code == "0000") { //success
						flag = 1;
						setTimeout(MyForgetPwd.setTime($yzmBtn), 1000);
					} else {
						alert(result.result_hint);
						return;
					}
				}
			});
		}
	},
	//获取忘记密码的手机信息
	registered: function() {
		var $searchPhone = $("#searchPhone").val();
		var $searchPwd = $("#searchPwd").val(); 	//第一次输入的密码
		//var $repsword = $("#repsword").val(); 		//第二次输入的密码
		var $searchYzm = $("#searchYzm").val();
		$.ajax({
			dataType: "json",
			type: "post",
			url: Config.remoteAddress + "login/forgetPwd",
			async: false,
			timeout: 10000,
			data: {
				mobile: $searchPhone,
				newPassword: $searchPwd,
				code: $searchYzm
			},
			success: function(data) {
				if(data.result_code == "0000") {
					$.toast("重置密码成功");
					setTimeout(function(){
						window.location.href = Config.rootPath + "loginregister/login.html"; //登录
					},1500);
					
				}else{
					$.toast(data.result_hint);
				}
			}
		});
	},
	//绑定事件
	bindBtn: function() {
		$("#searchPhone").blur(function() {	//验证手机号码格式
			var $searchPhone = $("#searchPhone").val();
			MyForgetPwd.regPhone($searchPhone);
		});
		$("#searchPwd").blur(function() { 	//验证设置新密码输入格式
			var $searchPwd = $("#searchPwd").val();
			MyForgetPwd.onePwd($searchPwd);
		});
		$("#repsword").blur(function() { 	//验证再次输入密码格式
			MyForgetPwd.againPwd();
		});
		$("#inputCode").on('input propertychange', function() { 	//验证图形验证码是否正确
			var $inputCode = $("#inputCode").val();
			MyForgetPwd.txregSCode($inputCode);
		});
		$("#setFsyzm").on('touchstart', function() { //验证码按钮
			if(!MyForgetPwd.phoness){
				var $searchPhone = $("#searchPhone").val();
				MyForgetPwd.regPhone($searchPhone);
			}else if(!MyForgetPwd.pwdss){
				var $searchPwd = $("#searchPwd").val();
				MyForgetPwd.onePwd($searchPwd);
			}else if(!MyForgetPwd.pwdss2){
				MyForgetPwd.againPwd();
			}if(MyForgetPwd.phoness && MyForgetPwd.pwdss && MyForgetPwd.pwdss2){
				var $setFsyzm = $("#setFsyzm");
				MyForgetPwd.regSetYzm($("#setFsyzm"));
			}
		});
		$("#searchYzm").on('input propertychange',function() {	//验证码输入框
			var $searchYzm = $("#searchYzm").val();
			MyForgetPwd.regSCode($searchYzm);
		});
		$("#tijiao").on('touchstart', function() { //确认按钮
			if(MyForgetPwd.phoness && MyForgetPwd.pwdss && MyForgetPwd.pwdss2 && MyForgetPwd.securityCodess) {
				MyForgetPwd.registered();
			} else {
				var $searchPhone = $("#searchPhone").val();
				MyForgetPwd.regPhone($searchPhone);
				var $searchPwd = $("#searchPwd").val();
				MyForgetPwd.onePwd($searchPwd);
				MyForgetPwd.againPwd();
				var $searchYzm = $("#searchYzm").val();
				MyForgetPwd.regSCode($searchYzm);
			}
		});

	},
	//初始化
	init: function(){
		this.bindBtn();
	}
};

$(function(){
	MyForgetPwd.init();
})