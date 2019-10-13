var jd = {urls:[],index:0,status:'stop',msg:'',failsum:0,beansum:0}
 
// 向content-script主动发送消息
function sendMessageToContentScript(message, callback)
{
	getCurrentTabId((tabId) =>
	{
		chrome.tabs.sendMessage(tabId, message, function(response)
		{
			if(callback) callback(response);
		});
	});
}

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender,sendResponse)
{
	if(request.cmd==='get'){
		jd.urls = [];
		request.data.forEach(item=>{
			jd.urls.push({url:item,bean:'',status:''});
		})
		jd.index = 0;
		jd.status = 'stop';
	}
	if(request.cmd==='end'){
		if(jd.index < jd.urls.length && jd.status != 'stop' && jd.status != 'done')
		{
			jd.urls[jd.index?jd.index-1:jd.index].status = request.data.status;
			jd.urls[jd.index?jd.index-1:jd.index].bean = request.data.bean;
			jd.beansum += (request.data.bean==='?')?0:request.data.bean;
			if(request.data.status===false){jd.failsum++;}
			console.log('jd',jd);
			openUrlCurrentTab(jd.urls[jd.index].url);
			jd.index++;
		}else if(jd.index===jd.urls.length&&jd.urls.length&&jd.status!='done'){
			jd.urls[jd.index-1].status = request.data.status;
			jd.urls[jd.index-1].bean = request.data.bean;
			jd.beansum += (request.data.bean==='?')?0:request.data.bean;
			if(request.data.status===false){jd.failsum++;}
			jd.status = 'done';
			jd.msg = '执行完成!';
			// 显示桌面通知
			chrome.notifications.create(null, {
				type: 'basic',
				iconUrl: 'img/gift.png',
				title: '领取完成',
				message: `领取完成,本次共领取到${jd.beansum}京豆!`
			});
		}
	}
	if(request.cmd==='init'){
		if(jd.status!='stop'){
			sendMessageToContentScript({data:jd.urls[jd.index],cmd:'start'}, (response) => {
				if(response) console.log(response);
			});
		}
	}
	if(request.cmd==='progress'){
		if(jd.status!='stop'){
		  jd.msg = request.data;
		}
	}
});
 
// 获取当前选项卡ID
function getCurrentTabId(callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}

// 当前标签打开某个链接
function openUrlCurrentTab(url)
{
	getCurrentTabId(tabId => {
		chrome.tabs.update(tabId, {url: url});
	})
}