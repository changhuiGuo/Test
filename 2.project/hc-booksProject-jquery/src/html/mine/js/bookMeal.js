//借书套餐
;var BookMeal = {
	getMemberPackageInfo:function(){	//会员套餐
		let token = $.fn.cookie('bookToken');
		let memberType = window.sessionStorage['memberType'];
		$.ajax({
			dataType: "json",
			type:"get",
			url: Config.remoteAddress + "member/getMemberPackageInfo",
			async:true,
			timeout: 10000,
			data:{
				token:token
			},
			success:function(data){
				if(data.result_code === "0000"){
					let html = [],html1 = [],$bkeMainTop = $('.bkeMain-top'),$bkeMainUl = $(".bkeMain-ul"),len = data.result.packages.length,i = 0;
					let days = data.result.days;			//有效天数
					let freeDeadline = data.result.freeDeadline;			//到期时间
					let freeStartTime = data.result.freeStartTime;	// 生效时间
					console.log(data);
					if(memberType === "3"){
						html.push(`
							<div class="bkeMain-top-con">
								<div class="matMain-deposit"><a href="#">购买记录</a></div>
								<div class="bkeMain-circle">
									<p>${days}天</p>
									<p>有效天数</p>
								</div>
								<div class="bkeMain-content clearfix">
									<div class="left">
										<p>${freeStartTime}</p>
										<p class="mcn">生效时间</p>
									</div>
									<div class="right">
										<p>${freeDeadline}</p>
										<p>到期时间</p>
									</div>
								</div>
							</div>
						`);
						$bkeMainTop.append(html.join(''));
					}else if(memberType === "1" || memberType === "2"){
						html.push(`
							<div class="bkeMain-top-img">
								<img src="../../images/Librarypackage_bg2.png"/>
							</div>
						`);
						$bkeMainTop.append(html.join(''));
					}
					for(;i<len;i++){
						let id = data.result.packages[i].id;							//id
						let packageName = data.result.packages[i].packageName;			//套餐名称
						let packageMoney = data.result.packages[i].packageMoney;		//价格
						let promotionPrice = data.result.packages[i].promotionPrice;	//活动价
						let jies = packageMoney - promotionPrice;
						
						html1.push(`
							<li class="clearfix">
								<div class="left">
									<p><span class="bkeMain-one bkeMain-money">${promotionPrice}元</span><span class="bkeMain-two bkeMain-line bgcol-a2">${packageMoney}元</span></p>
									<p><span class="taoc bgcol-red1">${packageName}</span><span class="bkeMain-two bgcol-a2">节省${jies}元</span></p>
								</div>
								<div class="right">
									<a href="#" class="button" data-id="${id}">购买</a>
								</div>
							</li>
						`);
					}
					$bkeMainUl.append(html1.join(''));
				}else if(data.result_code === "1111"){
					$.toast('系统异常');
				}
			},
			error: function(xhrFields,status){
				if(status == 'timeout'){
					alert("请求超时！");
				}
			}
		});
	},
	outBlack:function(id){
		let url = window.location.href;
		window.localStorage["bookMealurl"] = url;
		window.location.href = Config.WxPayUrl + "3:"+ id +"#wechat_redirect"
	},
	bindBtn:function(){
		$('.bkeMain-top').on('touchstart','.matMain-deposit',function(){	//购买记录按钮
			window.location.href = Config.rootPath + "mine/purchase.html";	
		});
		$('.bkeMain-ul').on('touchstart','.button',function(){	//购买按钮
			let id = $(this).attr('data-id');
			BookMeal.outBlack(id);
		});
	},
	init:function(){
		this.getMemberPackageInfo();
		this.bindBtn();
	},
};
$(function(){
	BookMeal.init();
});
