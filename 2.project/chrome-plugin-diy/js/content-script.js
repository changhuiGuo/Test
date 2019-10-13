// init
sendMessageToBackground({data:'',cmd:'init'});

// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log('收到消息:', request);
	handleEvent(request);
});

// 主动发送消息
function sendMessageToBackground(data) {
	chrome.runtime.sendMessage(data, function(response) {
	});
}

function handleEvent(res){
	if(res.cmd==='get'){
		let urls = [];
		let link = document.querySelectorAll('.ql-link');
		link.forEach((item,index)=>{urls.push(item.href);})
		urls=urls.filter(item=>item.indexOf('http://t.cn')===0);
		urls = Array.from(new Set(urls));
		sendMessageToBackground({data:urls,cmd:'get'});
	}
	if(res.cmd==='start'){
		getBeans(function(obj){
			sendMessageToBackground({data:obj,cmd:'end'});
		})
	}
}

function getBeans(callback){
	let loop = 0;
	let err1 = 0;
	let err2 = 0;
	let err3 = 0;
	let bean = 0;
	var timeid = setInterval(function(){
		let dom_gift = document.querySelectorAll('.shop_gift_modal');
		let getGift = document.querySelectorAll('.shop_gift_modal_footer .shop_gift_modal_button');  // 领取奖励
		let getGift2 = document.querySelector('.slideInDown .wq-prize-btn-n.marginTop5'); // 领取奖励2
		let getGift3 = document.querySelector('.btn.js-getPrize'); // 领取奖励3
		let btn = document.querySelector('.follow_panel .with_gift_icon'); // 收藏有礼
		let newGift = document.querySelector('#gift_button_bg .button'); //新人礼包
		let beanDom = document.querySelector('.icon_bean');
		bean = bean?bean:beanDom&&beanDom.parentElement.querySelector('em')?beanDom.parentElement.querySelector('em').innerText.split('个')[0]:0; // 京豆'
		if(loop<=2) {sendMessageToBackground({data:`初始化${loop+1}...`,cmd:'progress'});}
		if(loop>=3){
			let giftFlag = false;
			if(dom_gift.length){
				dom_gift.forEach(item=>{
					if(item.style.display != 'none'){
						giftFlag = true;
					}
				})
			}
			if(getGift.length&&err1<6&&giftFlag){
				err1++;
				if(++err1>5){
					console.log("fails");
					loop = 5;
				}
				console.log("getGift");
				if(getGift3) getGift3.click();
				getGift[0].click();
				if(getGift.length>1) {getGift[1].click()};
				sendMessageToBackground({data:`已领取奖励...`,cmd:'progress'});
				loop = 2;
			}else if(btn &&err2<6){
				err2++;
				btn.click();
				sendMessageToBackground({data:`有收藏奖励,已点击...`,cmd:'progress'});
				loop = 2;
			}else if(newGift&&err3<6&&newGift.innerHTML!='已领取'){
				err3++;
				newGift.click();
				sendMessageToBackground({data:`有新人奖励,已点击...`,cmd:'progress'});
				loop = 2;
			}else if(loop>3)
			{
				sendMessageToBackground({data:`正在关闭窗口...`,cmd:'progress'});
			}else{
				sendMessageToBackground({data:`此店铺已无奖励...`,cmd:'progress'});
			}
		}
		if(++loop>5){
			window.clearInterval(timeid);
			let obj = {status:'',bean:0};
			obj.status=(err1>5)?false:true;
			obj.bean = obj.status?parseInt(bean):'?';
			callback(obj);
		}
	},1000)
}
