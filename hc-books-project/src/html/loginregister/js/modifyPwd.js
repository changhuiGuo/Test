//修改密码功能
;
var ModifyThePassword = {
	//获取手机信息验证是否存在
	// phoneExist: function() {
	// 	var $searchPhone = $("#searchPhone").val();
	// 	var dat = "";
	// 	$.ajax({
	// 		dataType: "text",
	// 		type: "post",
	// 		async: false,
	// 		timeout: 10000, //加载事件限制 10秒
	// 		url: Config.remoteAddress + "wechat/checkMobile",
	// 		data: {
	// 			"mobile": $searchPhone
	// 		},
	// 		success: function(data) {
	// 			dat = data;
	// 		}
	// 	});
	// },
	//验证手机号码
	// phoness: false,
	// regPhone: function($phone) {
	// 	var reg = /^1[34578]\d{9}$/;
	// 	if($phone == "") {
	// 		$(".errMsg").eq(0).html("请输入开户手机号").css("color", "#fc0000").addClass("errMsgShow");
	// 		this.phoness = false;
	// 	} else if(reg.test($phone)) {
	// 		if(ModifyThePassword.phoneExist()) {
	// 			$(".errMsg").eq(0).html("").removeClass("errMsgShow");
	// 			this.phoness = true;
	// 		} else {
	// 			this.phoness = false;
	// 		}
	// 	} else {
	// 		$(".errMsg").eq(0).html("手机号码格式错误").css("color", "#fc0000").addClass("errMsgShow");
	// 		this.phoness = false;
	// 	}
	// },
	//验证输入的旧密码
	pwdss: false,
	regPwd: function() {
		var reg = /^[0-9|A-Z|a-z]{6,16}$/;
		//判断输入的旧密码
		var searchPwdJiu = $("#searchPwdJiu").val();
		if(searchPwdJiu == "") {
			$(".errMsg").eq(0).html("密码不能为空").css("color", "#fc0000").addClass("errMsgShow");
			this.pwdss = false;
		} else if(reg.test(searchPwdJiu)) {
			$(".errMsg").eq(0).html("").removeClass("errMsgShow");
			this.pwdss = true;
		} else {
			$(".errMsg").eq(0).html("长度为6-16位字母数字").css("color", "#fc0000").addClass("errMsgShow");
			this.pwdss = false;
		}
	},

	//判断第一次输入的密码
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
	againPwd: function() {
		var reg = /^[0-9|A-Z|a-z]{6,16}$/;
		var repsword = $("#repsword").val();
		var searchPwd = $("#searchPwd").val();
		if(repsword == "") {
			$(".errMsg").eq(2).html("密码不能为空").css("color", "#fc0000").addClass("errMsgShow");
			this.pwdss = false;
		} else if(searchPwd != repsword) {
			$(".errMsg").eq(2).html("两次密码不一致，请重新输入").css("color", "#fc0000").addClass("errMsgShow");
			this.pwdss = false;
		} else if(reg.test(repsword)) {
			$(".errMsg").eq(2).html("").removeClass("errMsgShow");
			this.pwdss = true;
		} else {
			$(".errMsg").eq(2).html("长度为6-16位字母数字").css("color", "#fc0000").addClass("errMsgShow");
			this.pwdss = false;
		}
	},
	//获取修改密码的手机信息
	updatePassword: function() {
		var $searchPwdJiu = $("#searchPwdJiu").val(); 	//旧密码
		var $searchPwd = $("#searchPwd").val(); 		//第一次输入的密码
		var $repsword = $("#repsword").val(); 			//第二次输入的密码
		var token = $.fn.cookie("bookToken");
		$.ajax({
			dataType: "json",
			type: "post",
			url: Config.remoteAddress + "member/updatePwd",
			async: false,
			timeout: 10000,
			data: {
				oldPwd: $searchPwdJiu,
				newPwd: $searchPwd,
				surePwd: $repsword, 
				token: token
			},
			success: function(data) {
				if(data.result_code == "0000") {
					$.toast("修改成功");
					//修改密码也要清空缓存
					var yikelimobile = $.fn.cookie("yikelimobile");	
					var yikelinowDate = $.fn.cookie("yikelinowDate");
					var yikelimemberImg = $.fn.cookie("yikelimemberImg");
					var yikelimemberName = $.fn.cookie("yikelimemberName");
					var yikelitoken = $.fn.cookie("yikelitoken");
					var id = $.fn.cookie("id");
					var ips = $.fn.cookie("ips");
					$.fn.cookie("yikelimobile",yikelimobile, { expires: -11 ,path: '/'});	//设置cookie保存30天
				    $.fn.cookie('yikelinowDate',yikelinowDate, { expires: -11 ,path: '/'});
				    $.fn.cookie('yikelimemberImg',yikelimemberImg, { expires: -11 ,path: '/'});
				    $.fn.cookie('yikelimemberName',yikelimemberName, { expires: -11 ,path: '/'});
				    $.fn.cookie('yikelitoken',yikelitoken, { expires: -11 ,path: '/'});
				    $.fn.cookie('id',id, { expires: -11 ,path: '/'});
				    $.fn.cookie('ips',ips, { expires: -11 ,path: '/'});
					setTimeout(function() {
						window.location.href = Config.rootPath + "loginregister/login.html"; //登录页面
					}, 1000);
				} else if(data.result_code == "1111") {
					$.toast("系统异常");
				} else if(data.result_code == "1002") {
					$.toast("缺少必要的参数");
				} else if(data.result_code == "1014") {
					$.toast("两次密码输入不一致");
				} else if(data.result_code == "1015") {
					$.toast("新密码不能与老密码一致");
				} else if(data.result_code == "1016") {
					$.toast("原有密码错误");
				} else if(data.result_code == "1023") {
					$.toast("Token验证错误");
				} else {
					alert("没有成功,后台接口返回"+data.result_code);
				}
			}
		});
	},
	//绑定事件
	bindBtn: function() {
		// $("#fanhui-wanji").on('touchstart', function() { //返回
		// 	window.location.href = Config.rootPath + "mine/mine.html"; //登录页面
		// });
		// $("#searchPhone").blur(function() { 	//验证手机号
		// 	var $searchPhone = $("#searchPhone").val();
		// 	ModifyThePassword.regPhone($searchPhone);
		// });
		$("#searchPwdJiu").blur(function() { 	//验证旧密码格式
			var $searchPwdJiu = $("#searchPwdJiu").val();
			ModifyThePassword.regPwd($searchPwdJiu);
		});
		$("#searchPwd").blur(function() { 		//验证设置新密码输入格式
			var $searchPwd = $("#searchPwd").val();
			ModifyThePassword.onePwd($searchPwd);
		});
		$("#repsword").blur(function() { //验证再次输入密码格式
			var $repsword = $("#repsword").val();
			ModifyThePassword.againPwd($repsword);
		});
		$("#login").on('touchstart', function() { //确认按钮
			ModifyThePassword.updatePassword();
		});
	},
	//初始化
	init: function() {
		this.bindBtn();
	}
};
$(function() {
	ModifyThePassword.init();
})