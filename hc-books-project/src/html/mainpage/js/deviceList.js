
;var DeviceList={
	getDeviceList: function(){			//用户首页查询周围设备
		var lngs = window.sessionStorage["lngs"];
		var lats = window.sessionStorage["lats"];
		var ips = returnCitySN.cip;
		var devName = $("#search").val();
		$.ajax({
			dataType: "json",
			type: "post",
			async: false,
			timeout: 10000,
			url: Config.remoteAddress + "wechat/queryDevList",
			data: {
				longitude: lngs,
				latitude: lats,
				ip: ips
			},
			success: function(data){
				if(data.result_code == "0000"){
					var $devULli = $(".devULli"),html = [],i = 0,len=data.result.length;
					var liwozuij = [];
					var $dlconMain = $(".dlconMain");
					if(len == 0){
						html.push('<div class="wdNodata">暂无数据</div>');
						$dlconMain.append(html.join(""));
					}else{
						$(".wdNodata").css("display","none");
						for(;i<len;i++){
							var deName = data.result[i].deName;					//设备名称
							var type = data.result[i].type;						//1_总部,2_分公司,3_加盟商,4_自营店
							var detailAddress = data.result[i].detailAddress;	//地址
							var distance = data.result[i].distance;				//距离KM
							liwozuij.push(distance);
							window.sessionStorage["liwozuij"] = liwozuij[0];	//最近的距离
							var planId = data.result[i].planId;					//优惠，0表示没有，其他值表示有
							var lngs = data.result[i].longitude;
							var lats = data.result[i].latitude;
							console.log(liwozuij+":liwozuij");
							console.log(distance+":distance");
							html.push('<li><div class="clearfix borderbottom"><div class="chestnut left"><span class="font-sizes">'+ deName +'</span><div class="operated">');
							if(type == "1"){
								html.push('<img src="../../images/ziying.png">');
							}else if(type == "2"){
								html.push('<img src="../../images/ziying.png">');
							}else if(type == "3"){
								html.push('<img src="../../images/jiamen.png">');
							}else if(type == "4"){
								html.push('<img src="../../images/ziying.png">');
							}
							html.push('</div><div class="card-content"><div class="card-content-inner"><i class="icon iconfont icon-dingwei"></i>&nbsp;'+ detailAddress +'</div>');
							html.push('</div></div><div class="chestnut2 right" data-lngs='+lngs+' data-lats='+lats+'>');							
							if(liwozuij[0] == distance){
								html.push('<span>'+ distance +'KM</span><br /><span class="spans">离我最近</span><i class="icon iconfont icon-jinru right juli"></i>');
							}else{
								html.push('<span>'+ distance +'KM</span><br /><span >距离我</span><i class="icon iconfont icon-jinru right juli"></i>');
							}
							html.push('</div></div></li>');
						}
						$devULli.append(html.join(""));
					}
				}else if(data.result_code == "1111"){
					//alert("系统异常");
				}else if(data.result_code == "1002"){	//缺少必要的参数跳转登录页面
					alert("请先登录")
					location.href = Config.rootPath + "loginregister/login.html";	//登录页面
				}else if(data.result_code == "1022"){
					//alert("操作频繁，请稍后操作!");
				}else if(data.result_code == "1023"){	//token异常跳转登录页面
					alert("请先登录")
					location.href = Config.rootPath + "loginregister/login.html";	//登录页面
				}
			},
			error: function(xhrFields,status){
				if(status == 'timeout'){
					alert("请求超时！");
				}
			}
		});	
	},
	searchDevName: function(){
		$(".devULli").html("");
		var lngs = window.sessionStorage["lngs"];
		var lats = window.sessionStorage["lats"];
		var ips = returnCitySN.cip;
		var devName = $("#search").val();
		$.ajax({
			dataType: "json",
			type: "post",
			async: false,
			timeout: 10000,
			url: Config.remoteAddress + "wechat/queryDevList",
			data: {
				longitude: lngs,
				latitude: lats,
				ip: ips,
				devName: devName
			},
			success: function(data){
				if(data.result_code == "0000"){
					var $devULli = $(".devULli"),html = [],i = 0,len=data.result.length;
					var $dlconMain = $(".dlconMain");
					if(len == 0){
						html.push('<div class="wdNodata">暂无数据</div>');
						$devULli.css("background","#f5f5f5");	//换颜色
						$devULli.append(html.join(""));
					}else{
						$(".wdNodata").css("display","none");
						$devULli.css("background","#fff");		//换颜色
						for(;i<len;i++){
							var deName = data.result[i].deName;					//设备名称
							var type = data.result[i].type;						//1_总部,2_分公司,3_加盟商,4_自营店
							var detailAddress = data.result[i].detailAddress;	//地址
							var distance = data.result[i].distance;				//距离KM
							var liwozuij = window.sessionStorage["liwozuij"];	//最近的距离
							var planId = data.result[i].planId;					//优惠，0表示没有，其他值表示有
							var lngs = data.result[i].longitude;
							var lats = data.result[i].latitude;							
							html.push('<li><div class="clearfix borderbottom"><div class="chestnut left"><span class="font-sizes">'+ deName +'</span><div class="operated">');
							if(type == "1"){
								html.push('<img src="../../images/ziying.png">');
							}else if(type == "2"){
								html.push('<img src="../../images/ziying.png">');
							}else if(type == "3"){
								html.push('<img src="../../images/jiamen.png">');
							}else if(type == "4"){
								html.push('<img src="../../images/ziying.png">');
							}
							html.push('</div><div class="card-content"><div class="card-content-inner"><i class="icon iconfont icon-dingwei"></i>&nbsp;'+ detailAddress +'</div>');
							html.push('</div></div><div class="chestnut2 right" data-lngs='+lngs+' data-lats='+lats+'>');							
							if(liwozuij == distance){
								html.push('<span>'+ distance +'KM</span><br /><span class="spans">离我最近</span><i class="icon iconfont icon-jinru right juli"></i>');
							
							}else{
								html.push('<span>'+ distance +'KM</span><br /><span >距离我</span><i class="icon iconfont icon-jinru right juli"></i>');
							}
							html.push('</div></div></li>');
						}
						$devULli.append(html.join(""));
					}
				}else if(data.result_code == "1111"){
					//alert("系统异常");
				}else if(data.result_code == "1002"){	//缺少必要的参数跳转登录页面
					alert("请先登录")
					window.location.href = Config.rootPath + "loginregister/login.html";	//登录页面
				}else if(data.result_code == "1022"){
					//alert("操作频繁，请稍后操作!");
				}else if(data.result_code == "1023"){	//token异常跳转登录页面
					alert("请先登录")
					window.location.href = Config.rootPath + "loginregister/login.html";	//登录页面
				}
			},
			error: function(xhrFields,status){
				if(status == 'timeout'){
					alert("请求超时！");
				}
			}
		});
	},
	bindInput: function(){
		$('input').bind('input propertychange', function() { 	//input输入框
			DeviceList.searchDevName();
		});
		$(".devULli").on('click','.chestnut2',function(){	//路线导航
			var lngs = window.sessionStorage["lngs"];
			var lats = window.sessionStorage["lats"];
			var didianLngs = $(this).attr("data-lngs");
			var didianLats = $(this).attr("data-lats");
			//调用百度地图导航
			window.location.href = "http://api.map.baidu.com/direction?origin=latlng:"+lats+","+lngs+"|name:我的位置&destination="+didianLats+","+didianLngs+"&mode=driving&region=东莞&output=html&src=弘驰智能";
		});
		$(".devULli").on('click','.chestnut',function(){	//路线导航
			window.location.href = "index.html";
		});
		$('#quxiao').on('touchstart', function() { 	//取消按钮
			$("#search").val("");
			DeviceList.searchDevName();
		});
	},
	init: function(){
		this.getDeviceList();
		this.bindInput();
	}
};
$(function(){
	DeviceList.init();
});