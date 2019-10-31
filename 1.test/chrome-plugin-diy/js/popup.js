 var sort = {name:'',type:''}; 
 // status sort
 document.querySelector('.status_sort').addEventListener('click',()=>{
	if(bg.jd.status!='done'){
		alert("请先执行完再排序!")
		return
	}
  tableSort('status_sort');
	bg.jd.urls.sort(function(a,b){
		if(sort.type === 'desc'){
			return a.status>b.status? -1 : a.status===b.status?0:1
		}else{
			return a.status>b.status? 1 : a.status===b.status?0:-1
		}
	})
 }) 
 
 // beans sort
 document.querySelector('.beans_sort').addEventListener('click',()=>{
	if(bg.jd.status!='done'){
		alert("请先执行完再排序!")
		return
	}
	tableSort('beans_sort');
	bg.jd.urls.sort(function(a,b){
		if(sort.type === 'desc'){
			return a.bean>b.bean? -1 : a.bean===b.bean?0:1
		}else{
			return a.bean>b.bean? 1 : a.bean===b.bean?0:-1
		}
	})
 }) 
 
 function tableSort (name) {
 	document.querySelector('.beans_sort .asc').classList.remove('sort_active');
 	document.querySelector('.beans_sort .desc').classList.remove('sort_active');
 	document.querySelector('.status_sort .asc').classList.remove('sort_active');
 	document.querySelector('.status_sort .desc').classList.remove('sort_active');
 	if(sort.name != name) {
 		sort.name = name;
 		sort.type = 'desc';
 	}else{
 		sort.type = sort.type==='desc'?'asc':'desc';
 	}
 	sort.type==='asc'? document.querySelector(`.${name} .asc`).classList.add('sort_active') :
 	document.querySelector(`.${name} .desc`).classList.add('sort_active');
}

// get
document.querySelector('#btn_get').addEventListener('click',()=>{
	let select = document.querySelector('#input_select').value;
	if(select === 'auto'){
			document.querySelector('.url_input').style['display']= 'none';
			sendMessageToContentScript({data:'',cmd:'get'}, (response) => {
			if(response) console.log(response);
		});
	}else{
		if(document.querySelector('.url_input').style['display']==='block'){
			document.querySelector('.url_input').style['display']='none';
			let urls = document.querySelector('.url_input textarea').value.split('\n');
			urls = urls.filter((item)=>{
				return item.indexOf('http')>-1;
			})
			bg.jd.urls = [];
			urls.forEach(item=>{
				bg.jd.urls.push({url:item,bean:'',status:''});
			})
			bg.jd.index = 0;
			bg.jd.status = 'stop';
			console.log('urls',urls);
			console.log('bg.jd.urls',bg.jd.urls);
		}else{
			document.querySelector('.url_input').style['display']='block';
		}
	}
})

// start/stop
document.querySelector('#btn_start').addEventListener('click',()=>{
	let status = document.querySelector('#btn_start');
	if(status.innerText==='开始'){
		bg.jd.status = '';
		sendMessageToContentScript({data:bg.jd.urls[0],cmd:'start'}, (response) => {
			if(response) console.log(response);
		});
	}else{
		bg.jd.status = 'stop';
		bg.jd.msg = "已暂停,请点击开始按钮继续..."
	}
	status.innerText = (status.innerText==='开始') ? '暂停' : '开始';
})

// copy
document.querySelector('#btn_copy').addEventListener('click',()=>{
	let fails_url = bg.jd.urls.filter(function(item){
		return item.status===false
	})
	let success_url = bg.jd.urls.filter(function(item){
		return (item.bean!==0&&item.bean!=='?'&&item.status);
	})
	let nobean_url = bg.jd.urls.filter(function(item){
		return (item.status&&item.bean===0);
	})
	let normal_url = bg.jd.urls.filter(function(item){
		return item.status===''
	})
	document.querySelector('textarea').value = `\n---领取失败的链接--\n`;
	fails_url.forEach((item,index)=>{
		document.querySelector('textarea').value += `${item.url}\n`;
	})
	document.querySelector('textarea').value += `\n---有京豆的链接---\n`;
	success_url.forEach((item,index)=>{
		document.querySelector('textarea').value += `${item.url}\n`;
	})
	document.querySelector('textarea').value += `\n---无京豆的链接---\n`;
	nobean_url.forEach((item,index)=>{
		document.querySelector('textarea').value += `${item.url}\n`;
	})
	document.querySelector('textarea').value += `\n---未执行的链接---\n`;
	normal_url.forEach((item,index)=>{
		document.querySelector('textarea').value += `${item.url}\n`;
	})
	document.querySelector('textarea').select();
	document.execCommand('Copy');
	alert('复制成功!');
})

// clear
document.querySelector('#btn_clear').addEventListener('click',()=>{
	bg.jd = {urls:[],index:0,status:'stop',msg:'',failsum:0,beansum:0}
})

// more
document.querySelector('#btn_more').addEventListener('click',()=>{
	document.querySelector('#btn_more').classList.length ?
	document.querySelector('#btn_more').classList.remove('showMore') :
	document.querySelector('#btn_more').classList.add('showMore');
// 	document.querySelector('#btn_mayi').classList.length ?
// 	document.querySelector('#btn_mayi').classList.remove('display') :
// 	document.querySelector('#btn_mayi').classList.add('display');
	document.querySelector('#btn_asset').classList.length ?
	document.querySelector('#btn_asset').classList.remove('display') :
	document.querySelector('#btn_asset').classList.add('display');
	document.querySelector('#btn_xinzi').classList.length ?
	document.querySelector('#btn_xinzi').classList.remove('display') :
	document.querySelector('#btn_xinzi').classList.add('display');
})

// restart
document.querySelector('#btn_restart').addEventListener('click',()=>{
	let index = document.querySelector('#input_restart').value||0;
	if(index>=bg.jd.urls.length){
		alert(`请输入${bg.jd.urls.length}以下的数字!`);
	}else{
		bg.jd.index = index;
	}
})

// open mayijifen
// document.querySelector('#btn_mayi').addEventListener('click',()=>{
// 	openUrlCurrentTab('./html/jifen.html');
// })

// open asset
document.querySelector('#btn_asset').addEventListener('click',()=>{
	openUrlCurrentTab('./html/asset.html');
})

// open xinzimingxi
document.querySelector('#btn_xinzi').addEventListener('click',()=>{
	openUrlCurrentTab('./html/pay.html');
})

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

// update Dom
var bg = chrome.extension.getBackgroundPage();
function updateDom() {
	bg = chrome.extension.getBackgroundPage();
	let urls = bg.jd.urls||[];
	let tbody = urls.length?'':'<div class="noData">没有数据...</div>';
	urls.forEach((item,index)=>{
	tbody += `<tr class=${index<bg.jd.index? 'active':'normal'}>
						 <td>${index+1}</td>       
						 <td><span class=${item.status===''?'normal':(item.status?'ctrue':'cfalse')}>-</span></td>
						 <td>${(item.bean===''||!item.bean)?'-':item.bean+"<span class='beans'></span>"}</td>
						 <td><a href=${item.url} class=${index<bg.jd.index? 'active':'normal'}>${item.url}</a></td>
						</tr>`
	}) 
	document.querySelector('tbody').innerHTML = tbody;
	document.querySelector('.status').innerHTML = `已领取京豆${bg.jd.beansum}个,领取失败${bg.jd.failsum}个,${bg.jd.index||0}/${urls.length}`;
	document.querySelector('.msg').innerHTML = `${bg.jd.msg}`;
	(bg.jd.status === 'stop')? document.querySelector('img').classList.remove('display') :
	document.querySelector('img').classList.add('display');
	document.querySelector('#btn_start').innerText = bg.jd.status==='stop'?'开始':'暂停';
	urls.length? document.querySelector('#btn_start').removeAttribute('disabled'):
							 document.querySelector('#btn_start').setAttribute('disabled','true');
}
updateDom();
setInterval(function(){
	updateDom();
},1000)