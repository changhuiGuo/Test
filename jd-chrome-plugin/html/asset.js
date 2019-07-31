var vue = new Vue({
		el:'#app',
		template:'',
		data:{
			mode:0,
			startTime:'',
			endTime:'',
			option:{},
			sourceData:{
				'201904':{'花呗':5508.62,'借呗':26499.79,'招联金融':21670.05,'京东白条':0,'京东金条':2577.66,'省呗':13982.39,'百度满易贷':16728.67,'百度尊享贷':15668.86,'拍拍贷':9604.17,'中原金融':2498.8,'360借条':3144,'信用钱包':1411.11,'微贷':10328.18},
				'201905':{'花呗':5562.46,'借呗':26499.23,'招联金融':21699.36,'京东白条':279.16,'京东金条':1323.66,'省呗':13064.03,'百度满易贷':20714.06,'百度尊享贷':15070.58,'拍拍贷':25162.88,'中原金融':1110.67,'360借条':2096,'信用钱包':0,'微贷':7864.60},
				'201906':{'花呗':5571.34,'借呗':26499.66,'招联金融':19604.88,'京东白条':112.79,'京东金条':661.83,'省呗':10404.95,'百度满易贷':16408.33,'百度尊享贷':14472.3,'拍拍贷':21054.94,'中原金融':555.36,'360借条':1048,'信用钱包':0,'微贷':5383.15},
				'201907':{'花呗':5303.17,'借呗':26499.13,'招联金融':16784.13,'京东白条':0,'京东金条':0,'省呗':17495.04,'百度满易贷':13263.54,'百度尊享贷':13874.02,'拍拍贷':16946.91,'中原金融':0,'360借条':0,'信用钱包':0,'微贷':2810.89},
// 				'201908':{'花呗':0,'借呗':0,'招联金融':0,'京东白条':0,'京东金条':0,'省呗':0,'百度满易贷':0,'百度尊享贷':0,'拍拍贷':0,'中原金融':0,'360借条':0,'信用钱包':0,'微贷':0},
// 				'201909':{'花呗':0,'借呗':0,'招联金融':0,'京东白条':0,'京东金条':0,'省呗':0,'百度满易贷':0,'百度尊享贷':0,'拍拍贷':0,'中原金融':0,'360借条':0,'信用钱包':0,'微贷':0},
// 				'201910':{'花呗':0,'借呗':0,'招联金融':0,'京东白条':0,'京东金条':0,'省呗':0,'百度满易贷':0,'百度尊享贷':0,'拍拍贷':0,'中原金融':0,'360借条':0,'信用钱包':0,'微贷':0},
// 				'201911':{'花呗':0,'借呗':0,'招联金融':0,'京东白条':0,'京东金条':0,'省呗':0,'百度满易贷':0,'百度尊享贷':0,'拍拍贷':0,'中原金融':0,'360借条':0,'信用钱包':0,'微贷':0},
// 				'201912':{'花呗':0,'借呗':0,'招联金融':0,'京东白条':0,'京东金条':0,'省呗':0,'百度满易贷':0,'百度尊享贷':0,'拍拍贷':0,'中原金融':0,'360借条':0,'信用钱包':0,'微贷':0},
// 				'202001':{'花呗':0,'借呗':0,'招联金融':0,'京东白条':0,'京东金条':0,'省呗':0,'百度满易贷':0,'百度尊享贷':0,'拍拍贷':0,'中原金融':0,'360借条':0,'信用钱包':0,'微贷':0},
// 				'202002':{'花呗':0,'借呗':0,'招联金融':0,'京东白条':0,'京东金条':0,'省呗':0,'百度满易贷':0,'百度尊享贷':0,'拍拍贷':0,'中原金融':0,'360借条':0,'信用钱包':0,'微贷':0},
// 				'202003':{'花呗':0,'借呗':0,'招联金融':0,'京东白条':0,'京东金条':0,'省呗':0,'百度满易贷':0,'百度尊享贷':0,'拍拍贷':0,'中原金融':0,'360借条':0,'信用钱包':0,'微贷':0},
// 				'202004':{'花呗':0,'借呗':0,'招联金融':0,'京东白条':0,'京东金条':0,'省呗':0,'百度满易贷':0,'百度尊享贷':0,'拍拍贷':0,'中原金融':0,'360借条':0,'信用钱包':0,'微贷':0},
			},
			thead:['月份','花呗','借呗','招联金融','京东白条','京东金条','省呗','百度满易贷','百度尊享贷','拍拍贷','中原金融','360借条','信用钱包','微贷']
		},
		mounted(){
			this.initCharts();
		},
		methods:{
			initCharts(){
				let date = [];
				let obj = {'京东金条':[],'借呗':[],'招联金融':[],'花呗':[],'京东白条':[],'省呗':[],'百度满易贷':[],'百度尊享贷':[],'拍拍贷':[],'中原金融':[],'360借条':[],'信用钱包':[],'微贷':[]};
				let objSum = {'京东金条':0,'借呗':0,'招联金融':0,'花呗':0,'京东白条':0,'省呗':0,'百度满易贷':0,'百度尊享贷':0,'拍拍贷':0,'中原金融':0,'360借条':0,'信用钱包':0,'微贷':0};
				for(var key in this.sourceData){
					date.push(key);
					obj['京东金条'].push(this.sourceData[key]['京东金条']);
					obj['借呗'].push(this.sourceData[key]['借呗']);
					obj['招联金融'].push(this.sourceData[key]['招联金融']);
					obj['花呗'].push(this.sourceData[key]['花呗']);
					obj['京东白条'].push(this.sourceData[key]['京东白条']);
					obj['省呗'].push(this.sourceData[key]['省呗']);
					obj['百度满易贷'].push(this.sourceData[key]['百度满易贷']);
					obj['百度尊享贷'].push(this.sourceData[key]['百度尊享贷']);
					obj['拍拍贷'].push(this.sourceData[key]['拍拍贷']);
					obj['中原金融'].push(this.sourceData[key]['中原金融']);
					obj['360借条'].push(this.sourceData[key]['360借条']);
					obj['信用钱包'].push(this.sourceData[key]['信用钱包']);
					obj['微贷'].push(this.sourceData[key]['微贷']);
				}
				for(var key in obj){
					obj[key].forEach(item=>{
						objSum[key] = item;
					})
				}
				console.log(objSum);
				echarts.dispose(document.querySelector('#charts')); //清画布
				
				var myChart = echarts.init(document.querySelector('#charts')); //初始化画布
				// 指定图表的配置项和数据
				if(this.mode===1){
					this.option = {
						title: {
							text: `负资产合计:${(objSum["京东金条"]+objSum["京东白条"]+objSum["招联金融"]+objSum["借呗"]+objSum["花呗"]+objSum["省呗"]+objSum["百度满易贷"]+objSum["百度尊享贷"]+objSum["拍拍贷"]+objSum["中原金融"]+objSum["360借条"]+objSum["信用钱包"]+objSum["微贷"]).toFixed(2)}`,
							x:'center'
						},
						tooltip: {
							trigger: 'item',
							formatter: "{a} <br/>{b} : {c} ({d}%)"
						},
						legend: {
							orient: 'vertical',
							left: 'left',
							data: ['花呗','借呗','招联金融','京东白条','京东金条','省呗','百度满易贷','百度尊享贷','拍拍贷','中原金融','360借条','信用钱包','微贷']
						},
						series: [
							{
								name: '资产明细',
								type: 'pie',
								radius : '55%',
								center: ['50%', '60%'],
								data:[
										{value:objSum["京东白条"], name:'京东白条'},
										{value:objSum["招联金融"], name:'招联金融'},
										{value:objSum["借呗"], name:'借呗'},
										{value:objSum["花呗"], name:'花呗'},
										{value:objSum["京东金条"], name:'京东金条'},
										{value:objSum["省呗"], name:'省呗'},
										{value:objSum["百度满易贷"], name:'百度满易贷'},
										{value:objSum["百度尊享贷"], name:'百度尊享贷'},
										{value:objSum["拍拍贷"], name:'拍拍贷'},
										{value:objSum["中原金融"], name:'中原金融'},
										{value:objSum["360借条"], name:'360借条'},
										{value:objSum["信用钱包"], name:'信用钱包'},
										{value:objSum["微贷"], name:'微贷'}
								],
								itemStyle: {
									emphasis: {
										shadowBlur: 10,
										shadowOffsetX: 0,
										shadowColor: 'rgba(0, 0, 0, 0.5)'
									}
								}
							}
						]
					};
					
				}else if(this.mode===0){
					this.option = {
						tooltip : {
							trigger: 'axis'
						},
						legend: {
							data: ['花呗','借呗','招联金融','京东白条','京东金条','省呗','百度满易贷','百度尊享贷','拍拍贷','中原金融','360借条','信用钱包','微贷']
						},
						grid: {
							left: '3%',
							right: '4%',
							bottom: '3%',
							containLabel: true
						},
						xAxis: [
							{
								type : 'category',
								boundaryGap : false,
								data : date
							}
						],
						yAxis: [
							{
								type: 'value'
							}
						],
						series: [
							{
								name:'京东金条',
								type:'line',
								stack: '总量',
								data:obj["京东金条"],
							},
							{
								name:'京东白条',
								type:'line',
								stack: '总量',
								data:obj["京东白条"]
							},
							{
								name:'借呗',
								type:'line',
								stack: '总量',
								data:obj["借呗"]
							},
							{
								name:'招联金融',
								type:'line',
								stack: '总量',
								data:obj["招联金融"]
							},
							{
								name:'花呗',
								type:'line',
								stack: '总量',
								data:obj["花呗"]
							},
							{
								name:'省呗',
								type:'line',
								stack: '总量',
								data:obj["省呗"]
							},
							{
								name:'百度满易贷',
								type:'line',
								stack: '总量',
								data:obj["百度满易贷"]
							},
							{
								name:'百度尊享贷',
								type:'line',
								stack: '总量',
								data:obj["百度尊享贷"]
							},
							{
								name:'拍拍贷',
								type:'line',
								stack: '总量',
								data:obj["拍拍贷"]
							},
							{
								name:'中原金融',
								type:'line',
								stack: '总量',
								data:obj["中原金融"]
							},
							{
								name:'360借条',
								type:'line',
								stack: '总量',
								data:obj["360借条"]
							},
							{
								name:'信用钱包',
								type:'line',
								stack: '总量',
								data:obj["信用钱包"]
							},
							{
								name:'微贷',
								type:'line',
								stack: '总量',
								data:obj["微贷"]
							}
						]
					};
				}
				// 使用刚指定的配置项和数据显示图表。
				if(this.mode<2){
					myChart.setOption(this.option);
				}
			},
			changMode(){
				this.mode>1?this.mode=0 : this.mode++;
				this.initCharts();
				if(this.mode>1){
					var th = '',tr= '';
          this.thead.forEach((item)=>{th+=`<th>${item}</th>`;});
          th+='<th>合计</th>';
					for(var key in this.sourceData){
            let monthSum = 0;
						tr += `<tr><td>${key}</td>`
						for(var subkey in this.sourceData[key]){
              tr += `<td>${this.sourceData[key][subkey].toFixed(2)}</td>`;
              monthSum += this.sourceData[key][subkey];
						}
            // tr += `</tr>`;
            tr += `<td>${monthSum.toFixed(2)}</td></tr>`;
          }
					document.querySelector('#charts').innerHTML = `<table cellspacing="0" cellpadding="0">
						<thead>
							<tr>
								${th}
							</tr>
						</thead>
						<tbody>
							${tr}
						</tbody>
					</table>`
				}
			}
		}
	})
	
	document.querySelector('button').addEventListener('click',function(){
		vue.changMode();
	})