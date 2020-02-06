//还书订单详情 
;var ROrderDetails = {
	orderDetail:function(){
		let token = $.fn.cookie('bookToken');
		let orderId = window.sessionStorage['orderId'];
		$.ajax({
			dataType: "json",
			type:"post",
			url: Config.remoteAddress + "order/orderDetail",
			async:true,
			timeout: 10000,
			data:{
				token:token,
				orderId:orderId
			},
			success:function(data){
				if(data.result_code === "0000"){
					let originalPrice = data.result.originalPrice;			//原价
					let tradeTime = data.result.tradeTime;					//借书时间
					let commercialOrderno = data.result.commercialOrderno;	//单号
					let devName = data.result.devName;				        //设备名称
					let tradeTotal = data.result.tradeTotal;				//借书金额
					let productName = data.result.productName;				//商品名称
					let yetStatus = data.result.yetStatus;					//还书状态  5未还 10已还
					let totalDay = data.result.totalDay;					//租赁天数
					let yetTime = data.result.yetTime;						//还书时间
					let returnDevName = data.result.returnDevName;			//还书设备
					let znDay = data.result.znDay;							//滞纳天数
					let znMoney = data.result.znMoney;						//滞纳费用
					
					let html = [],$rodMain = $(".rodMain");
					//没有借书原价
					html.push(`
						<div class="content-padded">
							<div class="row txborder">
								<div class="col-33">
									<div class="rodMain-img">
										<img src="../../images/u224.png" />
									</div>
								</div>
								<div class="col-66">
									<p>书&nbsp;&nbsp;&nbsp;&nbsp;名：<span>${productName}</span></p>
									<p>借书单价：<span class="rodMain-pd">${originalPrice}元/天</span></p>
									<p class="through bgcol-a2">借书原价：<span>2元/天</span></p>
								</div>
							</div>
							<div class="row txborder">
								<h4><span class="bboMain-span"></span>订单详情</h4>
								<div class="rodMain-detail">
									<p>订单编号：${commercialOrderno}</p>
									<p>借书时间：${tradeTime}</p>
									<p>借书设备：${devName}</p>
									<p class="p-img">书册状态： ${yetStatus === 5 ? '<img src="../../images/Theorderdetails_icon_Stayback.png" alt="" />':'<img src="../../images/Theorderdetails_icon_backed.png" alt="" />'} </p>
									<p>还书设备：${returnDevName}</p>
									<p>还书时间：${yetTime}</p>
								</div>
							</div>
							<div class="row">
								<h4><span class="bboMain-span"></span>费用结算<p class="right rodMain-paymentMethod">支付方式：<span class="bgcol-green1">微信</span></p></h4>
								<div class="rodMain-detail">
									<p>租赁天数：${totalDay}天</p>
									<p>租赁费用：${tradeTotal}元</p>
									<p>滞纳天数：${znDay}天</p>
									<p>滞纳费用：${znMoney}元</p>
									<p>结算费用：￥${tradeTotal}</p>
								</div>
							</div>
						</div>
					`);
					$rodMain.append(html.join(''));
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
	init:function(){
		this.orderDetail();
	}
};
$(function(){
	ROrderDetails.init();
});
