var vue = new Vue({
		el:'#app',
		template:'',
		data:{
			mode:1,
			startTime:'',
			endTime:'',
			option:{},
			sourceData:{
				'201805':{'reissue':0,'social':0,'funds':0,'tax':0,'cash':4547.5},
				'201806':{'reissue':0,'social':0,'funds':0,'tax':0,'cash':8580.6},
				'201807':{'reissue':0,'social':0,'funds':0,'tax':0,'cash':8979.8},
				'201809':{'reissue':40,'social':204.5,'funds':110.5,'tax':359.57,'cash':7713.26},
				'201810':{'reissue':50,'social':204.5,'funds':110.5,'tax':223.5,'cash':9111.5},
				'201811':{'reissue':80,'social':204.5,'funds':110.5,'tax':226.5,'cash':9138.5},
				'201812':{'reissue':50,'social':204.5,'funds':110.5,'tax':430.77,'cash':10976.96},
				'201901':{'reissue':100,'social':200.1,'funds':110.5,'tax':203.68,'cash':11585.72},
				'201902':{'reissue':20,'social':200.1,'funds':110.5,'tax':111.28,'cash':11598.12},
				'201903':{'reissue':20,'social':200.1,'funds':110.5,'tax':156.29,'cash':11553.11},
        '201904':{'reissue':40,'social':200.1,'funds':110.5,'tax':156.88,'cash':11572.52},
        '201905':{'reissue':120,'social':200.1,'funds':110.5,'tax':159.28,'cash':11650.12},
			},
			thead:['月份','补发','个人社保','个人公积金','个人所得税','实发工资']
		},
		mounted(){
			this.initCharts();
		},
		methods:{
			initCharts(){
				let date = [];
				let obj = {'cash':[],'social':[],'funds':[],'reissue':[],'tax':[]};
				let objSum = {'cash':0,'social':0,'funds':0,'reissue':0,'tax':0};
				for(var key in this.sourceData){
					date.push(key);
					obj['cash'].push(this.sourceData[key]['cash']);
					obj['social'].push(this.sourceData[key]['social']);
					obj['funds'].push(this.sourceData[key]['funds']);
					obj['reissue'].push(this.sourceData[key]['reissue']);
					obj['tax'].push(this.sourceData[key]['tax']);
				}
				for(var key in obj){
					obj[key].forEach(item=>{
						objSum[key] += item;
					})
				}
				console.log(objSum);
				echarts.dispose(document.querySelector('#charts')); //清画布
				
				var myChart = echarts.init(document.querySelector('#charts')); //初始化画布
				// 指定图表的配置项和数据
				if(this.mode===0){
					this.option = {
						title: {
							text: `工资总计:${(objSum.cash+objSum.tax+objSum.funds+objSum.social+objSum.reissue).toFixed(1)}`,
							subtext: '到手工资:'+objSum.cash.toFixed(1),
							x:'center'
						},
						tooltip: {
							trigger: 'item',
							formatter: "{a} <br/>{b} : {c} ({d}%)"
						},
						legend: {
							orient: 'vertical',
							left: 'left',
							data: ['到手工资','个税','公积金','社保','补发']
						},
						series: [
							{
								name: '工资明细',
								type: 'pie',
								radius : '55%',
								center: ['50%', '60%'],
								data:[
										{value:objSum.tax.toFixed(1), name:'个税'},
										{value:objSum.funds.toFixed(1), name:'公积金'},
										{value:objSum.social.toFixed(1), name:'社保'},
										{value:objSum.reissue.toFixed(1), name:'补发'},
										{value:objSum.cash.toFixed(1), name:'到手工资'},
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
					
				}else if(this.mode===1){
					this.option = {
						tooltip : {
							trigger: 'axis'
						},
						legend: {
							data:['到手工资','社保','公积金','个税','补发']
						},
						toolbox: {
							feature: {
								saveAsImage: {}
							}
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
								name:'到手工资',
								type:'line',
								stack: '总量',
								label: {
									normal: {
											show: true,
											position: [-20,-30],
									}
								},
								data:obj.cash,
								markLine: {
									// data: [{type: 'average', name: '平均值'}]
									data:[
										[
											{name: '东莞弘驰',coord: [0, 4547.5],symbol:'arrow',label:{position:'middle'},lineStyle:{type:'dashed',color:'#a9a9a9'}},
											{coord: [2, 4547.5]},
										],
										[
											{coord: [2, 8979.8],symbol:'rect',symbolSize:2,lineStyle:{type:'dashed',color:'red'}},
											{coord: [2, 0],symbol:'rect',symbolSize:2},
										],
										[
											{name: '中软国际',coord: [2, 4547.5],symbol:'arrow',label:{position:'middle'},lineStyle:{type:'dashed',color:'#a9a9a9'}},
											{coord: [obj.cash.length-1, 4547.5]},
										],
									],
								}
							},
							{
								name:'个税',
								type:'line',
								stack: '总量',
								data:obj.tax
							},
							{
								name:'社保',
								type:'line',
								stack: '总量',
								data:obj.social
							},
							{
								name:'公积金',
								type:'line',
								stack: '总量',
								data:obj.funds
							},
							{
								name:'补发',
								type:'line',
								stack: '总量',
								data:obj.reissue
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
					for(var key in this.sourceData){
						tr += `<tr><td>${key}</td>`
						for(var subkey in this.sourceData[key]){
							tr += `<td>${this.sourceData[key][subkey]}</td>`;
						}
						tr += `</tr>`;
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