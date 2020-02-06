//购买明细
;var Purchase = {
	queryCapitalList: ()=>{	//购买明细
		if(Purchase.z < 2){
			$('.infinite-scroll-preloader').css("display","none");
		}else{
			$('.infinite-scroll-preloader').css("display","block");
		}
		let token = $.fn.cookie('bookToken');
		
		$.ajax({
			dataType: "json",
			type:"post",
			url: Config.remoteAddress + "wechat/queryCapitalList",
			async:true,
			timeout: 10000,
			data:{
				token:token,
				queryType: 2,	//1.押金明细  2.购买明细  3.资金明细
				pageNumber: Purchase.z,				//分页的数目，如：1,2,3页
				pageSize: Purchase.itemsPerLoad		//每一页的条数，如：1有5条，2有5条
			},
			success:function(data){
				if(data.result_code === "0000"){
					console.log(data);
					let $cdtMainUl = $('.cdtMain-ul'),html = [],len = data.result.length;
					if(len === 0){
						if(Purchase.z < 2){
							html.push('<div class="wdNodata">暂无数据</div>');
							$cdtMainUl.append(html.join(""));
						}else{
							$(".wdNodata").css("display","none");
						}
					}else {
						data.result.forEach(function(val,index){
							let ioType = val.ioType;						//收支类型1、收入2、支出
							let seviceType = val.seviceType;				//流水单来源（1、押金缴纳2、充值3、押金退还4、借书款5、套餐退款）
							if(seviceType === "1"){
								seviceType = '缴纳';
							}else if(seviceType === "2"){
								seviceType = '充值';
							}else if(seviceType === "3"){
								seviceType = '押金退还';
							}else if(seviceType === "4"){
								seviceType = '借书款';
							}else if(seviceType === "5"){
								seviceType = '套餐购买';
							}
							let commercialOrderno = val.commercialOrderno;	//订单号
							let tradeTotal = val.tradeTotal;				//交易金额
							let tradeTime = val.tradeTime;					//订单时间
							
							html.push(`<li class="clearfix">`);
							if(seviceType === "缴纳" || seviceType === "押金退还"){
								html.push(`<img src="../../images/Thedeposit.png" class="left"/>`);
							}else if(seviceType === "套餐购买"){
								html.push(`<img src="../../images/package.png" class="left"/>`);
							}else if(seviceType === "借书款"){
								html.push(`<img src="../../images/settlement.png" class="left"/>`);
							}
							html.push(`
									<div class="left cdtMain-con">
										<p>订单号：${commercialOrderno}</p>
										<p>时间：${tradeTime}</p>
									</div>
									<div class="right">
										<p class="bgcol-red">${tradeTotal}</p>
										<p>${seviceType}</p>
									</div>	
								</li>
							`);					
							$cdtMainUl.append(html.join(''));
						});
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
		});
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
		Purchase.queryCapitalList();	//2，加载数据。这个是一上来就加载十条数据。如果没有就显示暂无数据
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
			Purchase.queryCapitalList(this.z,this.itemsPerLoad);
			// 更新最后加载的序号
			this.lastIndex = $('#allTab .tdbDiv').length;
			//容器发生改变,如果是js滚动，需要刷新滚动
			$.refreshScroller();
		}, 800);
	},
	init:function(){
		this.jztm();
	}
};
$(function(){
	Purchase.init();
});
