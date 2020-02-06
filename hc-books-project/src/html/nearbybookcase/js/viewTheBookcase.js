//翻看书柜
;var ViewTheBooks = {
	queryProduct :()=>{			//翻看书柜
		if(ViewTheBooks.z < 2){
			$('.infinite-scroll-preloader').css("display","none");
		}else{
			$('.infinite-scroll-preloader').css("display","block");
		}
		let token = $.fn.cookie('bookToken');
		let nameplate = window.sessionStorage["nameplate"];
		let devName = window.sessionStorage["devName"];
		$.ajax({
			dataType: "json",
			type:"post",
			url: Config.remoteAddress + "product/queryProduct",
			async:true,
			timeout: 10000,
			data:{
				token:token,
				num: nameplate,
				name:name,
				page: ViewTheBooks.z,				//分页的数目，如：1,2,3页
				pageSize: ViewTheBooks.itemsPerLoad	//每一页的条数，如：1有5条，2有5条
			},
			success:function(data){
				if(data.result_code == "0000"){
					let $vtbMainUl = $('.vtbMain-ul'),html = [],html1 = [],i = 0,len=data.result.length;
					
					if(len == 0){
						if(ViewTheBooks.z < 2){
							html.push('<div class="wdNodata">暂无数据</div>');
							$vtbMainUl.append(html.join(""));
						}else{
							$(".wdNodata").css("display","none");
						}
					}else{
						for(;i<len;i++){
							let author = data.result[i].author;			//作者
							let cabinetId = data.result[i].cabinetId;	//格子id
							let cloumnNo = data.result[i].cloumnNo;		//格子编号
							let productImg = data.result[i].productImg;	//商品图片
							let name = data.result[i].name;				//商品名称
							let remarks = data.result[i].remarks;		//商品介绍
							let productId = data.result[i].productId;	//商品id
							let devId = data.result[i].devId;			//设备id
							
							html.push(`
								<li class="rebMain-border txborder" data-productId="${productId}" data-cabinetId="${cabinetId}" data-devId="${devId}" data-cloumnNo="${cloumnNo}">
									<div class="item-link item-content">
										<div class="item-media">
											<div class="vtbMain-img">
												<img src="${productImg}" style='width: 4rem;'>
											</div>
										</div>
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">书名：${name}</div>
												<div class="item-after vtbMain-xuhao" style="color: #ffffff;">${cloumnNo}</div>
											</div>
											<div class="item-title-row">
												<div class="item-title">作者：${author}</div>
											</div>
											<div class="item-title-row">
												<div class="item-title">语言：中文</div>
											</div>
											<div class="vtbMain-con">
												<p class="bgcol-a2">${remarks}</p>
											</div>
										</div>
									</div>
								</li>
							`);
						}
						$vtbMainUl.append(html.join(''));
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
		ViewTheBooks.queryProduct();	//2，加载数据。这个是一上来就加载十条数据。如果没有就显示暂无数据
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
			ViewTheBooks.queryProduct(this.z,this.itemsPerLoad);
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
		$('.vtbMain-ul').on('click','.rebMain-border',function(){		//书柜按钮
			window.sessionStorage['productId'] = $(this).attr('data-productId');
			window.sessionStorage['cabinetId'] = $(this).attr('data-cabinetId');
			window.sessionStorage['devId'] = $(this).attr('data-devId');
			window.sessionStorage['cloumnNo'] = $(this).attr('data-cloumnNo');
			window.location.href = Config.rootPath + "qrborrowandreturn/borrowBooksOrder.html";	
		});
	},
	init:function(){
		this.jztm();
		this.bindBtn();
		let devName = window.sessionStorage['devName'];
		let $vtbMainName = $('.vtbMain-name'),html = [];
		html.push(`<p>${devName}</p>`);
		$vtbMainName.append(html.join(''));
	}
};
$(function(){
	ViewTheBooks.init();
});
