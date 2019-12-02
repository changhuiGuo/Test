
//登陆功能
;
var Login = {
	//密码登录-验证手机号码是否存在
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
		if(dat == "0") { 		//0 已经注册
			$(".errMsg").eq(0).html("").removeClass("errMsgShow");
			return true;
		} else if(dat == "1") { //1 没有注册
			$(".errMsg").eq(0).html("该号码未注册，请注册").css("color","#fc0000").addClass("errMsgShow");
			return false;
		}
	},
	//密码登录-验证手机号码
	phoness: false,
	logPhone: function($phone) {
		let reg = /^1[34578]\d{9}$/;
		if($phone == "") {
			$(".errMsg").eq(0).html("请输入手机号码").css("color","#fc0000").addClass("errMsgShow");
			this.phoness = false;
		} else if(reg.test($phone)) {
			this.phoness = true;
		} else {
			$(".errMsg").eq(0).html("手机号码格式错误").css("color","#fc0000").addClass("errMsgShow")
			this.phoness = false;
		}
	},
	//密码登录-验证输入的密码
	pwdss: false,
	logPwd: function($pwd) {
		let reg = /^[0-9|A-Z|a-z]{6,16}$/;
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
	logined: function() { //密码登录-获取数据发送请求
		let $mobile = $("#searchPhone").val();
		let $password = $("#searchPwd").val();
		$.ajax({
			dataType: "json",
			type: 'post',
			async: false,
			timeout: 10000,
			url: Config.remoteAddress + "login/checkLogin",
			data: {
				mobile: $mobile,
				password: $password,
				source: 1 
			},
			success: function(data) {
				if(data.result_code == "0000") {
					let token = data.result.token; 					//token
					$.fn.cookie("bookToken",token, { expires: 30 ,path: '/'});
					window.sessionStorage["bookToken"] = token;
					window.location.href = Config.rootPath + "mainpage/index.html"; //这是首页
				} else if(data.result_code == "1111") {
					$.toast("系统异常");
				} else if(data.result_code == "1101") {
					$.toast("登录失败，账户或密码错误");
				}
			}
		});
	},
	getHoursMinutes: function(msd) {	//计算分钟
	    let time = parseFloat(msd) / 1000;
	    if (time != null && time != "") {
	        if (time > 60) {
	            time = parseInt(time / 60.0);
	        }
	    }
	    return time;
	},
	outBlack: function() { //调后台拿wxOpenid
		window.location.href = Config.WxPayUrl+"3:1:0#wechat_redirect";
	},
	getHoursMinutes: function(msd) {	//计算分钟
	    let time = parseFloat(msd) / 1000;
	    if (time != null && time != "") {
	        if (time > 60) {
	            time = parseInt(time / 60.0);
	        }
	    }
	    return time;
	},
	bindBtn: function() {
		//======================密码登录========================
		$("#searchPhone").blur(function() { 				//手机输入框
			let $searchPhone = $("#searchPhone").val();
			Login.logPhone($searchPhone);
		});
		$("#searchPwd").on('input propertychange',function() { //密码输入框
			let $searchPwd = $("#searchPwd").val();
			Login.logPwd($searchPwd);
		});
		$("#login").on('touchstart', function() { //密码登录按钮
			if(Login.phoness && Login.pwdss) {
				Login.logined();
			} else {
				let $searchPhone = $("#searchPhone").val();
				Login.logPhone($searchPhone);
				let $searchPwd = $("#searchPwd").val();
				Login.logPwd($searchPwd);
			}	
		});
		$("#register").on('touchstart', function() { 	//免费注册按钮
			//Login.outBlack();	//走回调拿微信opendid
			window.location.href = Config.rootPath + "loginregister/register.html";
		});	
		$(".lwjmm").on('touchstart', function() { 		//忘记密码按钮
			window.location.href = Config.rootPath + "loginregister/forgetPwd.html";
		});	
	},
	//初始化
	inits: function() {
		this.bindBtn();
		
	}
};
$(function() {
	Login.inits();
})