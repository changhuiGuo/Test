//所有设备
;var AllPoints = {
	findListByGZH:()=>{
		if(AllPoints.z < 2){
			$('.infinite-scroll-preloader').css("display","none");
		}else{
			$('.infinite-scroll-preloader').css("display","block");
		}
		let token = $.fn.cookie('bookToken');
		let longitude = window.sessionStorage['lngs'];
		let latitude = window.sessionStorage['lats'];
		$.ajax({
			dataType: "json",
			type:"post",
			url: Config.remoteAddress + "v1/findListByGZH",
			async:true,
			timeout: 10000,
			data:{
				token:token,
				longitude:longitude,
				latitude:latitude
			},
			success:function(data){
				if(data.result_code === "0000"){
					let html = [],html1 = [],$apsMainUl = $('.apsMain-ul'),$apsMainNumber = $('.apsMain-number'),i = 0,len = data.result.list.length;
					let count = data.result.count;
					html1.push(`
						全部点位（个）：${count}
					`);
					$apsMainNumber.append(html1.join(''));
					if(len === 0){
						html.push('<div class="wdNodata">暂无数据</div>');
						$apsMainUl.append(html.join(""));
					}else{
						for(;i<len;i++){
							let longitude = data.result.longitude;						//用户经度
							let latitude = data.result.latitude;						//用户纬度
							let devName = data.result.list[i].devName;					//设备名称
							let address = data.result.list[i].address;					//地址
							let distance = data.result.list[i].distance;				//距离，以米为单位
							if (!devName) devName = "未知";
							if (!address) address = "未知";
							// 当距离没有值时显示 不详,小于1000m时显示 小于1km,大于1km时只显示km值(保留一位小数)
							if (!distance) {
								distance = " 不祥 ";
							}else if (distance<"1000"){
								distance = "小于1";
							}else {
								distance = (distance/1000).toFixed(1);
								
							};	

							html.push(`
								<li class="item-content item-link">
									<div class="apsMain-left">
										<h4 class="bgcol-b">${devName}</h4>
										<p class="bgcol-a2"><i class="iconfont icon-dingwei"></i>${address}（离我${distance}KM）</p>
									</div>
									<div class="apsMain-right pointsClick" data-lngs=${longitude} data-lats=${latitude} data-name=${devName}>
										<img src="../../images/Point_icon_navigation.png"/>
										<p>定位</p>
									</div>
								</li>
							`);
						}
						$apsMainUl.append(html.join(''));
					}
					
				}else if(data.result_code === "1111"){
					$.toast("系统异常");
				}
			},
			error: function(xhrFields,status){
				if(status == 'timeout'){
					alert("请求超时！");
				}
			}
		})
	},
	// 加载flag
	loading: false,
	// 最多可加载的条目
	maxItems: 100,
	// 每次加载添加多少条目
	itemsPerLoad: 10,
	lastIndex : 10,
	//第几页
	z : 1,
	jztm (){
		$(".xtxxqbjz").css("display","none");
		// 加载flag
		this.loading = false;
		// 最多可加载的条目
		this.maxItems = 100;
		// 每次加载添加多少条目
		this.itemsPerLoad = 10;
		//第几页
		this.z = 1;
		//预先加载10条
		AllPoints.findListByGZH();	//2，加载数据。这个是一上来就加载十条数据。如果没有就显示暂无数据
		// 上次加载的序号
		this.lastIndex = 10;
		$.init();
	},
	publicFun(){
		// 如果正在加载，则退出
		if(this.loading) return;
		// 设置flag
		this.loading = true;
		setTimeout(()=>{
			// 重置加载flag
			this.loading = false;
			this.lastIndex = this.lastIndex / 10;		//计算加载的第几页
			console.log(this.lastIndex+"：页数lastIndex");  
			this.z++;  //每次进来就自加一页
			var len = window.sessionStorage["len"];		//当len为0是。表示没有数据加载了
			if(String(this.lastIndex).indexOf(".") > -1 || len == 0) {	//当出现小数的时候就表示加载完毕。
				// 加载完毕，则注销无限加载事件，以防不必要的加载
				$.detachInfiniteScroll($('.infinite-scroll'));
				// 删除加载提示符
				$('.infinite-scroll-preloader').remove();
				$(".xtxxqbjz").css("display","block");
				this.z = 1;
				return;
			}
			AllPoints.findListByGZH(this.z,this.itemsPerLoad);
			// 更新最后加载的序号
			this.lastIndex = $('#allTab .tdbDiv').length;
			//容器发生改变,如果是js滚动，需要刷新滚动
			$.refreshScroller();
		}, 800);
	},
	bindBtn:function(){
		// 注册'infinite'事件处理函数
		$(".page").on('infinite', '.infinite-scroll-bottom',()=>{
			this.publicFun();
		});	
		$('.apsMain-ul').on('touchstart','.pointsClick',function(){	//点击定位图标
			let PointLngs = $(this).attr("data-lngs");
			let PointLats = $(this).attr("data-lats");
			let name = $(this).attr("data-name");
			console.log(this);
			console.log(PointLngs);
			console.log(PointLats);
			window.location.href = `../mainpage/index.html?devName=${name}`
			var $tcCon = $(".tcCon");
					crruntId = $(this).attr("data-id");
					$.popup($tcCon);
					$(".popup-overlay").css({
						"width": 0,
						"height": 0
					});
					$("#" + crruntId).show();
					$("#" + crruntId).siblings().hide();
		});
	},
	init:function(){
		this.jztm();
		this.bindBtn();
	}
};
$(function(){
	AllPoints.init();
})
