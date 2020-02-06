//我的押金
;var MyDeposit = {
	queryCapitalList: ()=>{	//押金明细
		if(MyDeposit.z < 2){
			$('.infinite-scroll-preloader').css("display","none");
		}else{
			$('.infinite-scroll-preloader').css("display","block");
		}
		let token = $.fn.cookie('bookToken');
		let depositStatus = window.sessionStorage['depositStatus'];		//(0：未交 1：已交)
		let depositMoney = window.sessionStorage['depositMoney'];		//押金金额
		
		$.ajax({
			dataType: "json",
			type:"post",
			url: Config.remoteAddress + "wechat/queryCapitalList",
			async:true,
			timeout: 10000,
			data:{
				token:token,
				queryType: 1,	//1.押金明细  2.购买明细  3.资金明细
				pageNumber: MyDeposit.z,				//分页的数目，如：1,2,3页
				pageSize: MyDeposit.itemsPerLoad		//每一页的条数，如：1有5条，2有5条
			},
			success:function(data){
				if(data.result_code === "0000"){
					let $matMainUl = $('.matMain-ul'),$matMainTop = $('.matMain-top'),html = [],html1 = [],len = data.result.length;
					if(len === 0){
						if(MyDeposit.z < 2){
							html1.push('<div class="wdNodata">暂无数据</div>');
							$matMainUl.append(html1.join(""));
							html.push(`
								<div class="matMain-circle">
									<p>￥${depositMoney}</p>
								</div>
								<div class="matMain-deposit depositTxt"><a href="#">押金说明</a></div>
								<div class="matMain-btn"><a href="#" class="button" id="tqDeposit">提取押金</a></div>
							`);
							$matMainTop.append(html.join(''));
						}else{
							$(".wdNodata").css("display","none");
						}
					}else {
						//============== 提取押金 =============
						html.push(`
							<div class="matMain-circle">
								<p>￥${depositMoney}</p>
							</div>
							<div class="matMain-deposit depositTxt"><a href="#">押金说明</a></div>
							<div class="matMain-btn"><a href="#" class="button" id="tqDeposit">提取押金</a></div>
						`);
						$matMainTop.append(html.join(''));

						data.result.forEach(function(val,index){
							let ioType = val.ioType;						//收支类型1、收入2、支出
							let seviceType = val.seviceType;				//流水单来源（1、押金缴纳2、充值3、押金退还4、借书款5、套餐退款）
							let commercialOrderno = val.commercialOrderno;	//订单号
							let tradeTotal = val.tradeTotal;				//交易金额
							let tradeTime = val.tradeTime;					//订单时间
							html1=[];
							//============== 押金记录 ======================
							html1.push(`
								<li class="clearfix">
									<div class="left">
										<p>订单号：${commercialOrderno}</p>
										<p>时间：${tradeTime}</p>
									</div>
							`);
							if(ioType === "1"){
								html1.push(`
									<div class="right">
											<p class="bgcol-red1">+￥${tradeTotal}</p>
											<p>缴纳</p>
										</div>
									</li>	
								`);
							}else if(ioType === "2"){
								html1.push(`
									<div class="right">
											<p class="bgcol-green1">-￥${tradeTotal}</p>
											<p>缴纳</p>
										</div>
									</li>
								`);
							}							
							$matMainUl.append(html1.join(''));
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
		MyDeposit.queryCapitalList();	//2，加载数据。这个是一上来就加载十条数据。如果没有就显示暂无数据
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
			MyDeposit.queryCapitalList(this.z,this.itemsPerLoad);
			// 更新最后加载的序号
			this.lastIndex = $('#allTab .tdbDiv').length;
			//容器发生改变,如果是js滚动，需要刷新滚动
			$.refreshScroller();
		}, 800);
	},
	bindBtn:function(){
		$('.matMain-top').on('touchstart','#tqDeposit',function(){
			let token = $.fn.cookie('bookToken');
			//$.alert('确定要提取押金吗？');
			$.ajax({
				dataType: "json",
				type:"post",
				url: Config.remoteAddress + "wechat/refund",
				async:true,
				timeout: 10000,
				data:{
					token:token
				},
				success:function(data){
					if(data.result_code === "0000"){
						$.toast("退款成功");
					}else
						{
						$.toast(data.result_hint);
						}
				}
			});
		});
		$('.matMain-top').on('touchstart','.depositTxt',function(){
			$.alert(`<div class="row depositTxt">
						<p>【押金说明】</p>
						<p>1、办理缴纳借书押金后，每人仅限外借3本，每本期限为30天，逾期每册每天收取滞纳金0.1元，逾期10天后每册每天收取滞纳金0.2元</p>
						<p>2、退还押金：未有归还书册且借书费用已结清，系统会在3个工作日内完成押金退还</p>
						<p>3、押金不做任何抵扣费用，暂由XXX公司托管</p>
					</div>`);
		});
	},
	init:function(){
		this.jztm();
		this.bindBtn();
	}
};
$(function(){
	MyDeposit.init();
});
