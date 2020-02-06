//个人中心
;var Mine={
	queryMyInfo:function(){		//获取用户名信息
		let token = $.fn.cookie('bookToken');
		let $cbt = $('.content-block-title'),html = [];
		if(token !== null){
			$.ajax({
				dataType: "json",
				type:"post",
				url: Config.remoteAddress + "member/queryMyInfo",
				async:false,
				timeout: 10000,
				data:{
					token:token
				},
				success:function(data){
					if(data.result_code === "0000"){
						let memberName = data.result.memberName;		//会员昵称
						let memberImg = data.result.memberImg;			//会员图片
						let borrowNum = data.result.borrowNum;			//已借数量
						let MaxBook = data.result.maxBook;				//最大借书数量
						let spendTotal = data.result.spendTotal;		//累计消费金额
						let memberType = data.result.memberType;		//会员类型(1：散户 2:普通用户 3:会员)
						let depositStatus = data.result.depositStatus;		//押金状态(0：未交 1：已交)
						let depositMoney = data.result.depositMoney;		//押金金额
						window.sessionStorage['depositStatus'] = depositStatus;
						window.sessionStorage['depositMoney'] = depositMoney;
						window.sessionStorage['memberType'] = memberType;
						
						html.push(`
							<div class="bgimg">
								<div class="mmImg">
									<img src="${memberImg === undefined || memberImg === 'null' ? 'http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0' : memberImg}" alt="" />
									<i class="iconfont ${ memberType === 3 ? 'icon-vip':''}"></i>
									<p class="mmLogin">${memberName == undefined|| memberName === 'null' ? '':memberName}</p>
								</div>
							</div>
							<div class="minconMain-content clearfix">
								<div class="left">
									<p>${borrowNum}/${MaxBook}本</p>
									<p class="mcn">已借数/最大数</p>
								</div>
								<div class="right">
									<p>${spendTotal}元</p>
									<p>消费总额</p>
								</div>
							</div>
						`);
						$cbt.append(html.join(''));
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
		}else{
			html.push(`
				<div class="bgimg">
					<div class="mmImg loginBtn">
						<img src="../../images/Me_pic_thedefaultavatar.png" alt="" />
						<p class="mmLogin">点击登录</p>
					</div>
				</div>
				<div class="minconMain-content clearfix">
					<div class="left">
						<p>3/3本</p>
						<p class="mcn">可借数/最大数</p>
					</div>
					<div class="right">
						<p>0元</p>
						<p>消费总额</p>
					</div>
				</div>
			`);
			$cbt.append(html.join(''));
		}		
	},
	bindBtn: function(){
		$(".content-block-title").on('click','.loginBtn',function(){	//点击登录按钮
			window.location.href = Config.rootPath + "loginregister/login.html";	
		});	
		let token = $.fn.cookie('bookToken');
		$(".mmOrder").on('click',function(){	//个人中心按钮
			if(token !== null){
				window.location.href = Config.rootPath + "mine/personalData.html";	
			}else{
				$.toast('请先登录');
			}
		});	
		
		let depositStatus = window.sessionStorage['depositStatus'];	//押金状态(0：未交 1：已交)
		$(".mmYajin").on('click',function(){	//我的押金按钮
			if(token !== null){
				if(depositStatus === "0"){
					window.location.href = Config.rootPath + "mine/depositAccount.html";	
				}else if(depositStatus === "1"){
					window.location.href = Config.rootPath + "mine/myDeposit.html";	
				}
				
			}else{
				$.toast('请先登录');
			}
		});
		$(".mmTaocan").on('click',function(){	//借书套餐按钮
			if(token !== null){
				window.location.href = Config.rootPath + "mine/bookMeal.html";	
			}else{
				$.toast('请先登录');
			}	
		});
		
		$(".mmZijin").on('click', function() { //资金明细按钮	
			if(token !== null){
				window.location.href = Config.rootPath + "mine/capitalDetails.html";	
			}else{
				$.toast('请先登录');
			}
		});
	},
	init:function(){
		this.queryMyInfo();
		this.bindBtn();
	}
};
$(function(){
	Mine.init();
});