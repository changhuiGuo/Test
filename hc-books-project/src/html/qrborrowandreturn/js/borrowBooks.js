//借书书柜
;var BorrowBooks = {
	productByCondition:()=>{		//书架管理
		if(BorrowBooks.z < 2){
			$('.infinite-scroll-preloader').css("display","none");
		}else{
			$('.infinite-scroll-preloader').css("display","block");
		}
		let token = $.fn.cookie("bookToken");	//token
		//let num = $.fn.cookie("bookToken");	//token
		$.ajax({
			dataType: "json",
			type: "post",
			async: false,
			timeout: 10000,
			url: Config.remoteAddress + "product/productByCondition",
			data:{
				token:token,
				num:'5c89a42af35442eb20180411113908',
				labelTag:"1",
				page: BorrowBooks.z,				//分页的数目，如：1,2,3页
				pageSize: BorrowBooks.itemsPerLoad	//每一页的条数，如：1有5条，2有5条
			},
			success: function(data){
				if(data.result_code === "0000"){
					let $bbkMainMar = $('.bbkMain-mar'),html = [],i = 0,len=data.result.length;
					if(len == 0){
						if(BorrowBooks.z < 2){
							html.push('<div class="wdNodata">暂无数据</div>');
							$bbkMainMar.append(html.join(""));
						}else{
							$(".wdNodata").css("display","none");
						}
					}else{
						for(;i<len;i++){
							let cabinetId = data.result[i].cabinetId;	//格子id
							let cloumnNo = data.result[i].cloumnNo;		//格子编号
							let productImg = data.result[i].productImg;	//商品图片
							let name = data.result[i].name;				//商品名称
							let productId = data.result[i].productId;	//商品id
							html.push(`
								<div class="col-33" data-cloumnNo="${cloumnNo}" data-cabinetId="${cabinetId}" data-productId="${productId}">
									<div class="bboMain-img">
										<img src="${productImg === undefined ? '../../images/u224.png':productImg}"/>
									</div>
									<p class="bboMain-p">${name}</p>
								</div>
							`);
						}
						$bbkMainMar.append(html.join(''));
					}
				}else if(result.result_code === "1111"){
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
		BorrowBooks.productByCondition();	//2，加载数据。这个是一上来就加载十条数据。如果没有就显示暂无数据
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
			BorrowBooks.productByCondition(this.z,this.itemsPerLoad);
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
		$('.bbkMain-mar').on('click','.col-33',function(){	//col-33标签	
			var productId =  $(this).attr("data-productId");
			var cloumnNo = $(this).attr("data-cloumnNo");
			var cabinetId = $(this).attr("data-cabinetId");
			window.sessionStorage['productId'] = productId;
			window.sessionStorage['cloumnNo'] = cloumnNo;
			window.sessionStorage['cabinetId'] = cabinetId;
			window.location.href = Config.rootPath + "qrborrowandreturn/borrowBooksOrder.html";		
		});	
	},
	init:function(){
		BorrowBooks.jztm();
		BorrowBooks.bindBtn();
	}
};
$(function(){
	BorrowBooks.init();
});