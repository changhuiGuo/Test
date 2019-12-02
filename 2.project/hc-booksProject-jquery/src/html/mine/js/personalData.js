//个人中心
;var PerData={
	queryMyInfo:function(){		//获取用户名信息
		let token = $.fn.cookie('bookToken');
		$.ajax({
			dataType: "json",
			type:"post",
			url: Config.remoteAddress + "member/queryMyInfo",
			async:true,
			timeout: 10000,
			data:{
				token:token
			},
			success:function(data){
				if(data.result_code === "0000"){
					let memberName = data.result.memberName;		//会员昵称
					if (!memberName) {memberName = ""}			//没有返回值时,显示默认值
					let mobile = data.result.mobile;				//手机号(账号)
					let memberImg = data.result.memberImg;			//会员图片
					// if (!memberImg) {memberImg = "../../images/gerendianji.png"}	//没有返回值,显示默认图片
					let regTime = PerData.getDate(data.result.regTime);				//注册时间
					console.log(regTime);
					let $pdaMainUl = $('.pdaMain-Ul'),html = [];
					html.push(`
						<li class="item-content item-link">
								<div class="item-inner">
									<div class="mmLeft">头像</div>
									<div class="mmRight"><img src="${memberImg === undefined || memberImg === 'null'? '../../images/gerendianji.png':memberImg }" /></div>
								</div>
							</li>
							<li class="item-content item-link">
								<div class="item-inner">
									<div class="mmLeft">昵称</div>
									<div class="mmRight">${memberName === undefined || memberName === 'null'?mobile:memberName}</div>
								</div>
							</li>
							<li class="item-content item-link">
								<div class="item-inner">
									<div class="mmLeft">账号</div>
									<div class="mmRight">${mobile}</div>
								</div>
							</li>
							<li class="item-content item-link">
								<div class="item-inner">
									<div class="mmLeft">注册时间</div>
									<div class="mmRight">${regTime}</div>
								</div>
							</li>
							<li class="item-content item-link pdaMainPwd">
								<div class="item-inner">
									<div class="mmLeft">修改密码</div>
									<div class="mmRight"><i class="iconfont icon-jinru"></i></div>
								</div>
							</li>
					`);
					$pdaMainUl.append(html.join(''));
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
	getDate: function(dateTime) { //格式化时间
		var time = new Date(dateTime);
		var y = time.getFullYear();
		var m = time.getMonth() + 1;
		var d = time.getDate();
		var h = time.getHours();
		var mm = time.getMinutes();
		var s = time.getSeconds();
		return y + '-' + PerData.add0(m) + '-' + d;
	},
	add0: function(m) {
		return m < 10 ? '0' + m : m;
	},
	bindBtn:function(){
		$('.pdaMain-Ul').on('touchstart','.pdaMainPwd',function(){	//修改密码按钮
			window.location.href = Config.rootPath + 'loginregister/modifyPwd.html';
		});
		$('.pdaMain-zhzx').on('touchstart',function(){				//注销用户按钮
			let token = $.fn.cookie('bookToken');
			//注销用户要删除cookie缓存
			$.fn.cookie('bookToken','token',{
				expires: -1,
				path: '/'
			});
			window.location.href = Config.rootPath + 'loginregister/login.html';
		});
	},
	init:function(){
		this.queryMyInfo();
		this.bindBtn();
	}
};
$(function(){
	PerData.init();
});