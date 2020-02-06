//分享
$(function() {
	var strSignUrl = Config.remoteAddress + "yikeliweb/html/mine/Invitation.html"; //页面地址路径
	$.ajax({
		dataType: "json",
		type: "post",
		url: Config.tongyiWxAddress, //获取微信签名等信息接口路径
		async: false,
		data: {
			strSignUrl: strSignUrl
		},
		success: function(data) {
			var result = data.result;
			wx.config({
				// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				debug: false,
				appId: result.appId,
				timestamp: result.timestamp,
				nonceStr: result.randomStr,
				signature: result.strSign,
				jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'onMenuShareWeibo']
			});
		},
		error: function(xhrFields, status) {
			if(status == 'timeout') {
				$.toast("请求超时");
			}
		}
	});
	wx.error(function(res) {
		alert("出错了：" + res.errMsg); //这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
	});
	var yikeleRecommendCode = $.fn.cookie("recommendCode");
	var shareTitle = "【X-板栗，超越人工美味】";
	var shareDesc = "注册即可成为会员，可获得108元优惠券！点击免费注册";
	var webUrl = "http://test.yikel.com/yikeliweb/html/loginregister/couponReg.html?yikeleRecommendCode=" + yikeleRecommendCode;
	var shareImgUrl = "http://test.yikel.com/yikeliweb/images/uyikeliLogo.png";
	wx.ready(function() {
		//分享给朋友
		wx.onMenuShareAppMessage({
			title: shareTitle, 		// 分享标题
			desc: shareDesc, 		// 分享描述
			link: webUrl, 			// 分享链接
			imgUrl: shareImgUrl, 	// 分享图标
			type: '', 				// 分享类型,music、video或link，不填默认为link
			dataUrl: '', 			// 如果type是music或video，则要提供数据链接，默认为空
			trigger: function(res) {
				// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回  
			},
			success: function(res) {
				//成功的回调
				//alert('分享给朋友成功');
				$(".tanchuc").hide();
			},
			cancel: function(res) {
				//失败的回调
				//alert('你没有分享给朋友');
			},
			fail: function(res) {
				alert(JSON.stringify(res));
			}
		});
		//分享给朋友圈
		wx.onMenuShareTimeline({
			title: shareTitle,
			link: webUrl,
			imgUrl: shareImgUrl,
			success: function() {
				// 用户确认分享后执行的回调函数  
				//alert('分享到朋友圈成功');
				$(".tanchuc").hide();

			},
			cancel: function() {
				// 用户取消分享后执行的回调函数  
				//alert('你没有分享到朋友圈');
			}
		});
		//分享到QQ
		wx.onMenuShareQQ({
			title: shareTitle,
			desc: shareDesc,
			link: webUrl,
			imgUrl: shareImgUrl,
			success: function() {
				// 用户确认分享后执行的回调函数
				//alert('分享到QQ');
				$(".tanchuc").hide();
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
				//alert('你没有分享到QQ');
			}
		});
		//分享到QQ空间
		wx.onMenuShareQZone({
			title: shareTitle,
			desc: shareDesc,
			link: webUrl,
			imgUrl: shareImgUrl,
			success: function() {
				// 用户确认分享后执行的回调函数
				//alert('分享到QQ空间');
				$(".tanchuc").hide();
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
				//alert('你没有分享到QQ空间');
			}
		});
		//分享到腾讯微博
		wx.onMenuShareWeibo({
			title: shareTitle,
			desc: shareDesc,
			link: webUrl,
			imgUrl: shareImgUrl,
			success: function() {
				// 用户确认分享后执行的回调函数
				//alert('分享到腾讯微博');
				$(".tanchuc").hide();
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
				//alert('你没有分享到腾讯微博');
			}
		});
	});
});