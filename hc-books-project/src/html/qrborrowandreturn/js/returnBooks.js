/*
 * 还书
 */
;var ReturnBooks = {
	queryMyInfo:function(){		//通过个人信息去除当前已借数量
		let token = $.fn.cookie("bookToken");	//token
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
					let html = [],$rebMainNumber = $('.rebMain-number');
					let borrowNum = data.result.borrowNum;		//已借数量
					let MaxBook = data.result.MaxBook;			//最大借书数量
					html.push(`当前借书数量：${borrowNum} / ${MaxBook}`);
					$rebMainNumber.append(html.join(''));
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
	queryMyOrder: function(){		//还书列表
		let token = $.fn.cookie("bookToken");	//token
		$.ajax({
			dataType: "json",
			type: "post",
			async: false,
			timeout: 10000,
			url: Config.remoteAddress + "order/queryMyOrder",
			data:{
				token:token,
				page:1,
				tag:""
			},
			success: function(data){
				if(data.result_code === "0000"){
					let html = [],$rebMainUl = $('.rebMain-ul'),i = 0,len = data.result.length;
					if(len === 0){
						html.push('<div class="wdNodata">暂无数据</div>');
						$rebMainUl.append(html.join(""));
					}else{
						for(;i<len;i++){
							let orderId = data.result[i].orderId;					//订单id
							let productImg = data.result[i].productImg;				//产品图片
							let name = data.result[i].name;							//产品名称
							let borrowBookPrice = data.result[i].borrowBookPrice;	//借书单价
							let total = data.result[i].total;						//目前的总金额
							let payTime = data.result[i].payTime;					//借书时间
							let freeDay = data.result[i].freeDay;					//剩余免费天数等于0 ，没有免费
							html.push(`
								<li class="txborder" data-id="${orderId}">
									<div class="item-link item-content">
										<div class="item-media">
											<img src="${productImg}" style='width: 4rem;'>
										</div>
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">书名：${name}</div>
							`);
							if(freeDay === 0){
								html.push(`<div class="item-after"><span class="bgcol-red">${total}元</span></div>`);
							}else{
								html.push(`<div class="item-after "><span class="bgcol-green">免租${freeDay}天</span></div>`);
							}
							html.push(`
											</div>
											<div class="item-title-row rebMain-bottom">
												<div class="item-title"><span>借书单价：${borrowBookPrice}/天</span></div>
											</div>
											<div class="item-subtitle rebMain-bottom">借书时间：${ReturnBooks.getDate(payTime)}</div>
										</div>
									</div>
								</li>
							`);
						}
						$rebMainUl.append(html.join(''));
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
	getDate: function(dateTime) { //处理时间格式
		var time = new Date(dateTime);
		var y = time.getFullYear();
		var m = time.getMonth() + 1;
		var d = time.getDate();
		var h = time.getHours();
		var mm = time.getMinutes();
		var s = time.getSeconds();
		return y + '-' + ReturnBooks.add0(m) + '-' + ReturnBooks.add0(d);
	},
	add0: function(m) {
		return m < 10 ? '0' + m : m;
	},
	bindBtn:function(){
		$('.rebMain-ul').on('touchstart','.txborder',function(){
			window.sessionStorage['orderId'] = $(this).attr('data-id');
			window.location.href = Config.rootPath + "returntheorder/borrowOrderDetails.html";	
		})
	},
	init:function(){
		this.queryMyInfo();
		this.queryMyOrder();
		this.bindBtn();
	}
};
$(function(){
	ReturnBooks.init();
});

