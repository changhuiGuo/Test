var map = new BMap.Map("container"); //创建地图实例  
;
var a = '0';
var devID = "";
var dedID = "";
var markers;
var crruntId;
var pointId = "";
var pointDevName = "";

var Index = {
	maps: function() {
		var point = new BMap.Point(113.763434, 23.043024); //创建点坐标		
		map.centerAndZoom(point, 11); 		//地图初始化
		map.enableScrollWheelZoom(true); 	//缩放地图	
		//返回用户当前的位置
		var geolocation = new BMap.Geolocation();
		var lngs = ""; //取出经纬度
		var lats = ""; //取出经纬度
		geolocation.getCurrentPosition(function(r) {
			if(this.getStatus() == BMAP_STATUS_SUCCESS) {
				var mk = new BMap.Marker(r.point);
				mk.enableDragging();
				map.addOverlay(mk);
				map.panTo(r.point);
				lngs = (r.point.lng).toFixed(6);
				lats = (r.point.lat).toFixed(6);
				console.log(lngs);
				console.log(lats);
				var storages = window.sessionStorage;
				storages["lngs"] = lngs;
				storages["lats"] = lats;
				Index.findAll(lngs, lats);
				Index.dingwei(lngs, lats);
			} else {
				alert('failed' + this.getStatus());
			}
		}, {
			enableHighAccuracy: true
		});
	},
	dingwei: function(lngs, lats) {
		map.centerAndZoom(new BMap.Point(lngs, lats), 11);
			// 添加带有定位的导航控件
		var navigationControl = new BMap.NavigationControl({
			// 靠左上角位置
			anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
			// LARGE类型
			type: BMAP_NAVIGATION_CONTROL_LARGE,
			// 启用显示定位
			enableGeolocation: true
		});
		map.addControl(navigationControl);
			// 添加定位控件
		var geolocationControl = new BMap.GeolocationControl();
		geolocationControl.addEventListener("locationSuccess", function(e) {
			// 定位成功事件
			var address = '';
			address += e.addressComponent.province;
			address += e.addressComponent.city;
			address += e.addressComponent.district;
			address += e.addressComponent.street;
			address += e.addressComponent.streetNumber;

		});
		geolocationControl.addEventListener("locationError", function(e) {
			// 定位失败事件
			alert(e.message);
		});
		map.addControl(geolocationControl);
	},
	findAll: function(lngs, lats) { //根据坐标获取附近的图标信息
		let token = $.fn.cookie('bookToken');
		var ips = returnCitySN.cip; 	  //ip
		window.sessionStorage["ip"] = ips;
		var arrLngLat = [];
		$.ajax({
			dataType: "json",
			type: "post",
			async: false,
			timeout: 10000,
			url: Config.remoteAddress + "v1/findAll",
			data: {token:token},
			success: function(data) {
				console.log(data);
				if(data.result_code == "0000") {
					var $tcCon = $(".tcCon"); //弹出层
					var i = 0,
						len = data.result.length,
						html = [],
						arrId = [];
					var liwozuij = [];
					window.sessionStorage["devTotel"] = len;
					for(; i < len; i++) {
						var lngs = data.result[i].longitude;
						var lats = data.result[i].latitude;
						var netStatus = data.result[i].netStatus;		//网络状态 0_在线 1_离线'
						var saleStatus = data.result[i].saleStatus;		//销售状态 0_正常 1_停售 2_缺货
						var status = data.result[i].status;				//状态 1_未注册、2_线下、3_线上、4_故障、5_报废、6_停机'
						
						arrLngLat.push(lngs, lats);
						var id = data.result[i].id;
						arrId.push(id, 0);
						var distance = data.result[i].distance ;				//距离KM
						// 当距离没有值时显示 不详,小于1000m时显示 小于1km,大于1km时只显示km值(保留一位小数)
						if (!distance) {
							distance = " 不祥 ";
						}else if (distance<"1000"){
							distance = "小于1";
						}else {
							distance = (distance/1000).toFixed(1);
						};	
						liwozuij.push(distance);
						liwozuij.sort();
						window.sessionStorage["liwozuij"] = liwozuij[0]; 	//最近的距离
						var address = data.result[i].address; 				//地址
						if (!address) address = " 未知 ";
						var province = data.result[i].province; 			//省份，注：省份为未知时不取市、地址
						var city = data.result[i].city; 					//城市
						var devName = data.result[i].devName; 				//设备名称
						var nameplate = data.result[i].nameplate; 			//设备铭牌

						//allPoints.html调用定位点需要获取id值
						if (devName == pointDevName){
							pointId = id;
						}
						
						html.push('<div class="content-block zjmLngLat" id="'+ id +'" style="display:none" data-longitude="" data-latitude=""><div id="tc-quxiao"><a href="javascript:void(0)"><i class="iconfont icon-quxiao"></i></a></div><div class="list-block left">');
						html.push('<ul class="zjmUl" data-longitude="'+ lngs +'" data-latitude="'+ lats +'">');
						html.push('<li class="item-content"><div class="item-inner">');
						html.push('<div class="item-title iditI">');
						html.push('<span><i class="iconfont icon-dianpuzhuangtai bg-zhengchang"></i>&nbsp;' + devName + '</span></div>');
						html.push('<div class="item-after">');
						html.push('</div></li>');
						if(liwozuij == distance) {
							html.push('<li class="item-dizhi item-bianji">' + address + '（离我最近:' + distance + 'KM）</li>');
						} else {
							html.push('<li class="item-dizhi item-bianji">' + address + '（距离:' + distance + 'KM）</li>');
						}
						html.push('</ul></div>');
						html.push('<div class="place-an-order right"><div class="promptly zjmPlaceOrder" data-nameplate="'+ nameplate +'" data-saleStatus="' + saleStatus + '" data-devName="'+ devName +'"><a href="javascript:void(0)" class="xiadan"><img src="../../images/Home_icon_shugui.png" alt="" /></a></div></div></div>');

						// 添加maker 到地图上
						var myIcon = new BMap.Icon("../../images/Home_icon1.png", new BMap.Size(40, 36)); //没有优惠-鲜
						//循环加载地图上的小图标
						var point = new BMap.Point(data.result[i].longitude, data.result[i].latitude);
						markers = new BMap.Marker(point, {
							icon: myIcon
						}); // 创建标注
						markers.setID = data.result[i].id; 			// 设置marker 属性id
						markers.setPlanID = data.result[i].planId; 	// 标记图标类型
						markers.checked = false; // 标记图标类型
						map.addOverlay(markers); // 将标注添加到地图中
						Index.inMap(markers, data.result[i].id);
					}
					$tcCon.append(html.join("")); //追加到父元素
				} else if(data.result_code == "1111") {
					$.toast("系统异常");
				} else if(data.result_code == "-1000") {
					alert("请重新登录");
					window.location.href = Config.rootPath + "loginregister/login.html";
				}
			},
			error: function(xhrFields, status) {
				if(status == 'timeout') {
					$.toast("请求超时，请检查您的网络");
				}
			}
		});
	},
	addSingleMakter: function(obj) {
		var id = obj.setID;
		var oPlanId = obj.setPlanID;
		var oPoint = obj.point;
		var oMyIcon;
		if(id === crruntId) {
			if(oPlanId == 0) {
				oMyIcon = new BMap.Icon("../../images/Home_icon1.png", new BMap.Size(107, 152));
			} else {
				oMyIcon = new BMap.Icon("../../images/Home_icon1.png", new BMap.Size(107, 152));
			}
		} else {
			if(oPlanId == 0) {
				oMyIcon = new BMap.Icon("../../images/Home_icon1.png", new BMap.Size(80, 80)); //没有优惠-鲜
			} else {
				oMyIcon = new BMap.Icon("../../images/Home_icon1.png", new BMap.Size(80, 80)); //优惠-惠
			}
		}
		var point = new BMap.Point(oPoint.lng, oPoint.lat);
		oMarker = new BMap.Marker(point, {
			icon: oMyIcon
		}); // 创建标注
		oMarker.setID = id; 			// 设置marker 属性id
		oMarker.setPlanID = oPlanId; 	// 标记图标类型
		if(id === crruntId) {
			oMarker.checked = true;	 	// 标记图标类型
		} else {
			oMarker.checked = false; 	// 标记图标类型
		}
		map.addOverlay(oMarker); 		// 将标注添加到地图中
	},

	clearMakter: function(id) {
		var allOverlay = map.getOverlays();
		for(var i = 0; i < allOverlay.length - 1; i++) {
			if(allOverlay[i].setID == id) {
				map.removeOverlay(allOverlay[i]);
				return false;
			}
		}
	},

	inMap: function(marker, $id) { //弹出层
		map.addEventListener("click", function(e) {
			Index.isTrue = false;	//还原全部点击按钮是否出现
			if(e.overlay !== null && e.overlay.checked == false) {
				crruntId = e.overlay.setID;
				var $tcCon = $(".tcCon");
				$.popup($tcCon);
				$(".popup-overlay").css({
					"width": 0,
					"height": 0
				});
				$("#" + crruntId).show();
				$("#" + crruntId).siblings().hide();
//				map.getOverlays().forEach(element => {
//					if(element.setID) {
//						Index.clearMakter(element.setID);
//						Index.addSingleMakter(element);
//					}
//				});
			} else if(e.overlay !== null && e.overlay.checked == true) {
				console.log('跳转，第二次点');
				var lngs = window.sessionStorage["lngs"]; 			 //我的地址
				var lats = window.sessionStorage["lats"];
				var len = $(".tcCon .zjmLngLat").length;
				for(var i=0;i<len;i++){
					var display = $(".tcCon .zjmLngLat").eq(i).css("display");
					if(display == "block"){
						var didianLngs = $(".tcCon .zjmLngLat").eq(i).attr("data-longitude"); //设备地址
						var didianLats = $(".tcCon .zjmLngLat").eq(i).attr("data-latitude"); //设备地址
					}
				}
				window.location.href = "http://api.map.baidu.com/direction?origin=latlng:" + lats + "," + lngs + "|name:我的位置&destination=" + didianLats + "," + didianLngs + "&mode=driving&region=东莞&output=html&src=弘驰智能";
			} else {
				$.closeModal($(".tcCon"));
				$(".tcCon").removeClass("modal-in");
				$(".tcCon").addClass("modal-out"); //点击地图隐藏下单弹出层
				Index.removeBlueIcon();
			}
			//全部按钮的弹出层
			var searchDivdispaly = $(".searchDiv").css("display");
			if(searchDivdispaly == "block"){
				//console.log(1);
				$(".searchDiv").hide();
			}else if(searchDivdispaly == "none"){
				//console.log(2);
				//$(".searchDiv").show();
			}
		});
	},
	removeBlueIcon() {
		var allOverlay = map.getOverlays();
		for(var i = 0; i < allOverlay.length - 1; i++) {
			if(allOverlay[i].checked == true) {
				crruntId = null;
				Index.clearMakter(allOverlay[i].setID);
				Index.addSingleMakter(allOverlay[i]);
				return false;
			}
		}
	},
	searchDevName: function() { //搜索店名
		$(".seachdUl").html("");
		var ips = $.fn.cookie("ips");
		if(ips == null) {
			ips = window.sessionStorage["ip"];	 	//ip
		}
		var lngs = window.sessionStorage["lngs"]; 	//经度
		var lats = window.sessionStorage["lats"]; 	//纬度
		var devName = $("#search").val();
		$.ajax({
			dataType: "json",
			type: "post",
			async: false,
			timeout: 10000,
			url: Config.remoteAddress + "v1/findAll",
			data: {
				longitude: lngs,
				latitude: lats,
				ip: ips,
				devName: devName
			},
			success: function(data) {
				if(data.result_code == "0000") {
					var $seachdUl = $(".seachdUl"),
						i = 0,
						len = data.result.length,
						html = [];
					for(; i < len; i++) {
						var id = data.result[i].id; 						//设备id
						var address = data.result[i].address; 				//地址
						if (!address) address = " 未知 ";
						var province = data.result[i].province; 			//省份，注：省份为未知时不取市、地址
						var city = data.result[i].city; 					//城市
						var devName = data.result[i].devName; 				//设备名称
						var nameplate = data.result[i].nameplate; 			//设备铭牌
						var lngs = data.result[i].longitude;
						var lats = data.result[i].latitude;
						var netStatus = data.result[i].netStatus;		//网络状态 0_在线 1_离线'
						var saleStatus = data.result[i].saleStatus;		//销售状态 0_正常 1_停售 2_缺货
						var status = data.result[i].status;				//状态 1_未注册、2_线下、3_线上、4_故障、5_报废、6_停机'
						var distance = data.result[i].distance ;		//距离KM
	
						// 当距离没有值时显示 不详,小于1000m时显示 小于1km,大于1km时只显示km值(保留一位小数)
						if (!distance) {
							distance = " 不详 ";
						}else if (distance<"1000"){
							distance = "小于1";
						}else {
							distance = (distance/1000).toFixed(1);
						};	
						// alert(data.result[i].devName)
						html.push('<li><div class="shdlSpan shdlSpan-input"  data-nameplate="' + nameplate + '" data-saleStatus="' + saleStatus + '" data-id="' + id + '" data-devName="' + devName + '" data-detailAddress="' + address + '" data-id="' + id + '" data-lngs="' + lngs + '" data-lats="' + lats + '">');
						html.push('<span class="devNamecss">' + devName + '</span><span class="shdlsTwo">(距离' + distance + 'KM)</span>');
						html.push('</div></li>');
					}
					$seachdUl.append(html.join(""));
					if($("input").val() == "") {
						$(".searchDiv").hide();
						$(".sblbSrmar").css("height", "2.2rem"); //离开的时候把高设为2.2rem
					} else {
						$(".sblbSrmar").css("height", "10rem"); //进入的时候把高设为7.5rem
						$(".searchDiv").show();
					}
				} else if(data.result_code == "1111") {
					//alert("系统异常");
					$.toast("系统异常");
				} else if(data.result_code == "1022") {
					//$.toast("点击频繁，请稍后操作！");
				}
			}
		});
	},
	becomeOld: function() { //首次登陆后，新用户变成老用户
		var yikelitoken = $.fn.cookie("yikelitoken");
		$.ajax({
			dataType: "json",
			type: "post",
			async: false,
			timeout: 10000,
			url: Config.remoteAddress + "wechat/becomeOld",
			data: {
				token: yikelitoken
			},
			success: function(data) {
				if(data.result_code == "0000") {
					//console.log("成功");
					$.fn.cookie("yikeliIsOld",1,{expires: 1 ,path:'/'});
				} else if(data.result_code == "1111") {
					$.toast("系统异常");
				} else if(data.result_code == "1002") {
					alert("请先登录");
					window.location.href = Config.rootPath + "loginregister/login.html";
				}else if(data.result_code == "1023") {
					alert("请先登录");
					window.location.href = Config.rootPath + "loginregister/login.html";	
				}
			}
		});
	},
	isTrue: true,//全部店铺按钮是否出现
	bindIcon: function() {
		$(".sblbSrmar>a").on('click', function() { 			//全部店铺按钮
			window.location.href = Config.rootPath + 'nearbybookcase/allPoints.html';
		});
		$(".seachdUl").on('click', '.shdlSpan-btn', function() { 	//全部按钮弹出层
			// var len = $(".tcCon .zjmLngLat").length;
			// var id = ""; 
			// for(var i = 0;i<len;i++){
			// 	id = $(".tcCon").find(".zjmLngLat").eq(i).attr("id");
			// }
			// var dataId = $(this).attr("data-id");		//全部店铺li标签里面的id
			// var $tcCon = $(".tcCon");
			// if(id = dataId){
			// 	$.popup($tcCon);
			// 	$(".popup-overlay").css({
			// 		"width": 0,
			// 		"height": 0
			// 	});
			// }
			// $("#" + dataId).show();
			// $("#" + dataId).siblings().hide();
			
			// var lngs = $(this).attr("data-lngs");
			// var lats = $(this).attr("data-lats");
			// var point = new BMap.Point(lngs, lats);
			// map.centerAndZoom(point, 11); 		//地图初始化
		});		
		$('input').on('input propertychange', function() { 	//搜索框
			Index.searchDevName();
		});
		$('#quxiao').on('touchstart', function() { //取消按钮
			console.log('111');
			$("#search").val("");
			$(".searchDiv").hide();
		});
		$(".seachdUl").on('click', '.shdlSpan-input', function() { 	//上半部分的按钮
			// var shebeilngs = $(this).attr("data-lngs"); 		//设备地址
			// var shebeilats = $(this).attr("data-lats");
			// var deName = $(this).attr("data-deName"); 			//设备名字
			// var detailAddress = $(this).attr("data-detailAddress"); //设备具体的地址
			// window.location.href = "../mainpage/dingweiMap.html?shebeilngs=" + shebeilngs + "&shebeilats=" + shebeilats + "&deName=" + deName + "&detailAddress=" + detailAddress;
			var bookToken = $.fn.cookie("bookToken");
				if(bookToken == undefined){
					alert("请先登录");
					window.location.href = Config.rootPath + "loginregister/login.html";
				}else{
					//----------------------到书柜详情页----------------------//
					// var saleStatus = $(this).attr("data-saleStatus"); 							//销售状态 0_正常 1_停售 2_缺货
					// if(saleStatus == 0) {
					// 	window.sessionStorage['devName'] = $(this).attr("data-devName");		//设备名称
					// 	window.sessionStorage['nameplate'] = $(this).attr("data-nameplate");			//铭牌
					// 	window.location.href = Config.rootPath + "nearbybookcase/viewTheBookcase.html";
					// } else if(saleStatus == 2) {
					// 	$.toast("抱歉，设备正在升级中，无法购买");
					// } else {
					// 	$.toast("书本卖完了！请换一台设备");
					// }
					//-----------------------------------------------------//
					var $tcCon = $(".tcCon");
					crruntId = $(this).attr("data-id");
					$.popup($tcCon);
					$(".popup-overlay").css({
						"width": 0,
						"height": 0
					});
					$("#" + crruntId).show();
					$("#" + crruntId).siblings().hide();
				}
		});
		$(".tcCon").on('touchstart', '.zjmUl ul li', function() {
			$(this).siblings('li').removeClass('zjmActive');
			$(this).addClass('zjmActive').fadeToggle;
		});
		$(".tcCon").on('touchstart', '.zjmPlaceOrder', function() { 	//下单按钮
			var bookToken = $.fn.cookie("bookToken");
			if(bookToken == undefined){
				alert("请先登录");
				window.location.href = Config.rootPath + "loginregister/login.html";
			}else{
				var saleStatus = $(this).attr("data-saleStatus"); 			//销售状态 0_正常 1_停售 2_缺货
				if(saleStatus == 0) {
					window.sessionStorage['devName'] = $(this).attr("data-devName");				//设备名称
					window.sessionStorage['nameplate'] = $(this).attr("data-nameplate");			//铭牌
					window.location.href = Config.rootPath + "nearbybookcase/viewTheBookcase.html";
				} else if(saleStatus == 2) {
					$.toast("抱歉，设备正在升级中，无法购买");
				} else {
					$.toast("书本卖完了！请换一台设备");
				}
			}
		});
		$(".tcCon").on('touchstart', '#tc-quxiao', function() { 	//弹出层取消按钮
			$(".tcCon").removeClass("modal-in");
			$(".tcCon").addClass("modal-out");
			Index.removeBlueIcon();
		});
	},
	weChatMonitor: function() { //微信监听
		pushHistory();
		window.addEventListener("popstate", function(e) {
			console.log("我监听到了浏览器的返回按钮事件啦"); 	//根据自己的需求实现自己的功能  
		}, false);
		function pushHistory() {
			var state = {
				title: "title",
				url: "window.location.href = Config.rootPath + mainpage/index.html"
			};
			window.history.pushState(state, "title", "#");
		}
	},
	showPoints: function(){
		setTimeout(function(){
			if(pointId!=""){
				// console.log("id is "+ pointId)
				var $tcCon = $(".tcCon");
				crruntId = pointId;
				// pointId = "";	
				$.popup($tcCon);
				$(".popup-overlay").css({
					"width": 0,
					"height": 0
				});
				$("#" + crruntId).show();
				$("#" + crruntId).siblings().hide();
			}
		},500)
	},
	init: function() {
		//-------------------------------allPoints.html调用定位点-------------------------------//
		var url = decodeURI(location.search); 	//解码获取参数值,location.search获取url的?后面的值
		var Request = new Object();
		if(url.indexOf("?") != -1) {			//?后面有值
		var str = url.substr(1); 			 	//截取？后面的所有字符串substr(1); 		
			strs = str.split("&"); 				//按照&分割成字符串数组
			for(var i = 0; i < strs.length; i++) {
				Request[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		pointDevName = Request.devName;
		//------------------------------------------------------------------------------------//

		this.maps();
		this.bindIcon();
		//禁用下滑事件
		$('.tcCon').on('touchmove', function (event) {
			event.preventDefault();
		});
	}
};
$(function() {
	Index.weChatMonitor();
	Index.init();
	Index.showPoints();
});