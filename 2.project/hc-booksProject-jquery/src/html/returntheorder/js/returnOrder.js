//借还订单
;var ReturnOrder = {
	queryMyOrder:()=>{
		if(ReturnOrder.z < 2){
			$('.infinite-scroll-preloader').css("display","none");
		}else{
			$('.infinite-scroll-preloader').css("display","block");
		}
		$(".wdNodata").html("");
		let token = $.fn.cookie('bookToken');
		$.ajax({
			dataType: "json",
			type: "post",
			timeout: 10000,
			url: Config.remoteAddress + "order/queryMyOrder",
			data: {
				token: token,
				page: ReturnOrder.z,
				tag: ReturnOrder.queryType
			},
			success: function(data) {
				if(data.result_code == "0000") {
					let $tabAll = $('#tabAll'),$ddTabs = $(".ddTabs"),html = [],i = 0,len = data.result.length;
					if(len==0) {
						if(ReturnOrder.z < 2){
							html.push('<div class="wdNodata">暂无数据</div>');
							$ddTabs.append(html.join(""));
						}else{
							$(".wdNodata").css("display","none");
						}
					}else{
						for(i=0;i<len;i++){
							let total = data.result[i].total;				//目前总金额
							let borrowOriginalPrice = data.result[i].borrowBookPrice;	//租书租金原价
							let rentPrice = data.result[i].rentPrice;		//目前租金金额
							let name = data.result[i].name;					//产品名称
							let productImg = data.result[i].productImg;		//产品图片
							let payTime = data.result[i].payTime;			//借书时间
							let tradeTime = ReturnOrder.getDate(data.result[i].tradeTime);		//交易时间
							let orderId = data.result[i].orderId;			//订单id
							let freeDay = data.result[i].freeDay;			//剩余免费天数
							let payStatus = data.result[i].payStatus =="10"? "已支付":data.result[i].total==0?"免租金":"未支付";		//订单支付状
							let orderStatus = data.result[i].orderStatus =="10"? "已还书":"未还书";   //订单状态
							html.push(`
								<div class="content-block">
									<div class="list-block media-list">
										<ul>
											<li class="txborder" data-orderId="${orderId}">
												<div class="item-link item-content">
													<div class="item-media">
														<img src="${productImg}" style='width: 4rem;'>
													</div>
													<div class="item-inner">
														<div class="item-title-row">
															<div class="item-title">书名：${name}</div>
															<div class="item-after"><span class="bgcol-red">${total}元</span></div>
														</div>
														<div class="item-title-row rebMain-bottom">
															<div class="item-title">
																<span>借书单价：￥${borrowOriginalPrice}/天</span>
															</div>
														</div>
														<div class="item-subtitle rebMain-bottom">借书时间：${tradeTime}</div>
														<span class="orderStatus" style=${orderStatus == "未还书" ? "background-color:red;": "background-color:green;"}>${orderStatus}</span>
														<span class="payStatus" style=${payStatus == "未支付" ? "background-color:red;": "background-color:green;"}>${payStatus}</span>
													</div>
												</div>
											</li>
										</ul>
									</div>
								</div>	
							`);
						}
						$tabAll.append(html.join(''));
					}	
				}else if(data.result_code == "1111"){
					$.toast("系统异常");
				}
			}
		});
		
	},
	queryType: null,
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
		ReturnOrder.queryMyOrder();	//2，加载数据。这个是一上来就加载十条数据。如果没有就显示战无数据
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
			ReturnOrder.queryMyOrder(this.z,this.itemsPerLoad,this.queryType);
			// 更新最后加载的序号
			this.lastIndex = $('#allTab .tdbDiv').length;
			//容器发生改变,如果是js滚动，需要刷新滚动
			$.refreshScroller();
		}, 800);
	},
	getDate: function(dateTime) { //处理时间格式
		var time = new Date(dateTime);
		var y = time.getFullYear();
		var m = time.getMonth() + 1;
		var d = time.getDate();
		var h = time.getHours();
		var mm = time.getMinutes();
		var s = time.getSeconds();
		return y + '-' + ReturnOrder.add0(m) + '-' + ReturnOrder.add0(d);
	},
	add0: function(m) {
		return m < 10 ? '0' + m : m;
	},
	bindBtn:function(){
		// 注册'infinite'事件处理函数
		$(".page").on('infinite', '.infinite-scroll-bottom',()=>{
			this.publicFun();
		});	
		var $wdNodata = $(".wdNodata").html();
		var tmers;
		$("#borrowOrder").on('click',function(){	//借书
	        var $borrowOrder = $("#borrowOrder").is(".active");
			if(!$borrowOrder){
				clearTimeout(tmers);
				if($wdNodata != "暂无数据"){
					$("#tabAll").html("");
					ReturnOrder.queryType = '';
					tmers = setTimeout(function(){
						ReturnOrder.jztm();		
					},500);
					$(this).siblings("a").removeClass('active');
					$(this).addClass('active');		
				}	
			}	
		});
		$("#returnOrder").on('click',function(){	//还书
	        var $returnOrder = $("#returnOrder").is(".active");
			if(!$returnOrder){
				clearTimeout(tmers);
				if($wdNodata != "暂无数据"){
					$("#tabAll").html("");
					ReturnOrder.queryType = 1;
					tmers = setTimeout(function(){
						ReturnOrder.jztm();		
					},500);
					$(this).siblings("a").removeClass('active');
					$(this).addClass('active');		
				}	
			}	
		});
		
		//li标签  orderId
		$("#tabAll").on('click','.txborder',function(){	//还书
	        window.sessionStorage['orderId'] = $(this).attr("data-orderId");
	        window.location.href = Config.rootPath + "returntheorder/borrowOrderDetails.html";	
		});
	},
	init:function(){
		this.bindBtn();
		var $wdNodata = $(".wdNodata").html();
		if($wdNodata != "暂无数据"){
			ReturnOrder.queryType = '';
			ReturnOrder.jztm();
		}
	}
};
$(function(){
	var url = decodeURI(location.search); 	//解码获取参数值
	var Request = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1); 			//截取？后面的所有字符串
		strs = str.split("&"); 				//按照&分割成字符串数组
		for(var i = 0; i < strs.length; i++) {
			Request[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	let token = $.fn.cookie('bookToken');
	var nameplate = Request["nameplate"]; 
	//---------------------- 增加是否登录判断 ----------------------//
	if (!token) {
		// $.toast("请先登录");
		$.alert("请先登录",function(){
			// 跳转到登录页面
			window.location.href = Config.rootPath + "loginregister/login.html?nameplate="+nameplate;
		})
	}
	//---------------------- 增加是否登录判断 ----------------------//
	//还书需要的铭牌
	window.sessionStorage['nameplate'] = nameplate;
	// window.sessionStorage['nameplate'] = '539da9935c244fda20180411105146';	//写死
	ReturnOrder.init();
});
