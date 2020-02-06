/*
 * 借书订单
 */
;var BBooksOrder = {
	//下单数据的详情
	getBooksInfo: function(){
		let depositStatus = window.sessionStorage['depositStatus']; //押金状态(0：未交 1：已交)
		let productId = window.sessionStorage["productId"];	//商品ID
		let cloumnNo = window.sessionStorage["cloumnNo"];	//格子编号
		$.ajax({
			dataType: "json",
			type: "post",
			async: false,
			timeout: 10000,
			url: Config.remoteAddress + "wechat/getBooksInfo",
			data:{
				productId:productId
			},
			success: function(result){
				console.log(result);
				if(result.result_code === "0000"){
					let borrowBookPrice = result.result.borrowBookPrice;			//优惠价
					let termDay = result.result.termDay;							//期限
					let cashPledge = result.result.cashPledge;						//押金
					let productAuthor = result.result.productAuthor;				//作者
					let productImg = result.result.productImg;						//图片
					let productRemarks = result.result.productRemarks;				//详情
					let productName = result.result.productName;					//书名
					let borrowOriginalPrice = result.result.borrowOriginalPrice;	//原价
					let languageType = result.result.languageType;					//语言
					let type = result.result.type;									//用户类型,1表示要交押金,2表示不需要交押金

					let html = [],$contentPadded = $('.content-padded');
					html.push(`
						<div class="row txborder">
							<div class="col-33">
								<div class="bboMain-img">
									<img src="${productImg}" />
								</div>
								<p>格子编号:${cloumnNo}</p>
							</div>
							<div class="col-66">
								<p>书名：<span>${productName}</span></p>
								<p>作者：<span>${productAuthor}</span></p>
								<p>语言：<span>${languageType === undefined ? "中文":languageType}</span></p>
								<p>简介：<span class="bboMain-color">${productRemarks}</span></p>
							</div>
						</div>
						<div class="order-info txborder">
							<h4><span class="bboMain-span"></span>订单信息</h4>
							<div class="list-block clearfix">
								<ul>
									<li class="item-content">
										<div class="item-inner">
											<div class="item-title">${productName}：x1</div>
										</div>
									</li>
									<li class="item-content">
										<div class="item-inner">
											<div class="item-title">租赁期限：${termDay === undefined ? "30":termDay}天</div>
										</div>
									</li>
									<li class="item-content">
										<div class="item-inner">
											<div class="item-title">租赁费用：${borrowBookPrice}元 / 天</div>
										</div>
									</li>
									<li class="item-content">
										<div class="item-inner">
											<div class="item-title">租赁押金：${cashPledge}元</div>
										</div>
									</li>
									<div class="bboMain-yajin right">支付押金：<span>${cashPledge}元</span></div>
								</ul>
							</div>
						</div>
						<div class="row bboMain-fize">
							<p>【说明】</p>
							<p>1、办理缴纳借书押金后，每人仅限外借3本，每本期限为30天，逾期每册每天收取滞纳金0.1元，逾期10天后每册每天收取滞纳金0.2元</p>
							<p>2、退还押金：未有归还书册且借书费用已结清，系统会在3个工作日内完成押金退还</p>
							<p>3、押金不做任何抵扣费用，暂由XXX公司托管</p>
						</div>
					`);
					if(type == "1"){
						html.push(`<p><a href="#" class="button button-big" id="payOrder">微信支付</a></p>`);
					}else if(type == "2"){
						html.push(`<p><a href="#" class="button button-big" id="takeBook">开锁取书</a></p>`);
					}
					$contentPadded.append(html.join(''));
					
				}else if(result.result_code === "1111"){
					$.toast("系统异常");
				}else if(result.result_code === "1002"){
					let takeBook = window.sessionStorage["takeBook"];	
					if (takeBook == 1){
						BBooksOrder.openLock();
						$.toast("开锁中,请稍候...");
					}else{
						$.toast("缺少必要的参数");
					}
				}
			},
			error: function(xhrFields,status){
				if(status == 'timeout'){
					alert("请求超时！");
				}
			}
		});
			
	},
	queryMyInfo: function(){
		let token = $.fn.cookie('bookToken');
		$.ajax({
			dataType: "json",
			type: "post",
			async: false,
			timeout: 10000,
			url: Config.remoteAddress + "member/queryMyInfo",
			data:{
				token:token
			},
			success: function(data){
				if(data.result_code === "0000"){
					window.sessionStorage["depositStatus"] = data.result.depositStatus;	//押金状态(0：未交 1：已交)		
				}else if(data.result_code === "1111"){
					$.toast("系统异常");
				}else if(data.result_code === "1002"){
					$.toast("缺少必要的参数");
				}
			},
			error: function(xhrFields,status){
				if(status == 'timeout'){
					alert("请求超时！");
				}
			}
		});
	},
	openLock:function(){		//开锁取书
		let token = $.fn.cookie('bookToken');
		let devBookId = window.sessionStorage["cabinetId"];	//格子id
		let cloumnNo = window.sessionStorage["cloumnNo"];	//格子编号
		let devId = window.sessionStorage['devId'];			//设备id
		$.ajax({
			dataType: "json",
			type: "post",
			async: false,
			timeout: 10000,
			url: Config.remoteAddress + "wechat/openLock",
			data:{
				token:token,		
				devBookId:devBookId,	//货道主键ID
				cabinetNo:cloumnNo,		//柜号  0 1 2 3  0表示主柜   其他是副柜
				devId:devId				//设备ID
			},
			success: function(data){
				console.log(data);
				if(data.result_code === "0000"){
					$.toast("成功");
					setTimeout(function(){
						window.location.href = Config.rootPath + "qrborrowandreturn/unlock.html";		
					},2000);
				}else if(data.result_code == "1111"){
					$.toast("系统异常");
				}else if(data.result_code == "1002"){
					$.toast("缺少必要的参数");
				}else if(data.result_code == "1007"){
					$.toast("没缴纳押金");
				}else if(data.result_code == "1008"){
					$.toast("借书已超过上限");
					setTimeout(function(){
						window.location.href = Config.rootPath + "qrborrowandreturn/returnBooks.html";		
					},2000);
				}
			},
			error: function(xhrFields,status){
				if(status == 'timeout'){
					alert("请求超时！");
				}
			}
		})
	},
	outBlack:function(){
		//devId=设备的id  cabinetId=格子id
		let cabinetId = window.sessionStorage['cabinetId'];
		let devId = window.sessionStorage['devId'];
		// window.location.href = Config.rootPath + "qrborrowandreturn/payOrder.html?state=1:&wxOpenid=4564";
		window.location.href = Config.WxPayUrl + "=1:"+ devId +":"+ cabinetId +"#wechat_redirect"
	},
	bindBtn:function(){
		$('.content-padded').on('touchstart','#payOrder',function(){	//微信支付按钮
			BBooksOrder.outBlack();
		});
		$('.content-padded').on('touchstart','#takeBook',function(){	//开锁取书
			BBooksOrder.openLock();
		});
		setTimeout(function(){
			let takeBook = window.sessionStorage["takeBook"];			
			if (takeBook == 1){											//支付成功开锁取书
				BBooksOrder.openLock();
				sessionStorage.removeItem('takeBook');
			}
		},100);
	},
	init:function(){
		this.queryMyInfo();
		this.getBooksInfo();
		this.bindBtn();
	}
};
$(function(){
	BBooksOrder.init();
});

