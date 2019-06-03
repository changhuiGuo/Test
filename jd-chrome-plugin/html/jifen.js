new Vue({
		el: '#app',
		template: '',
		data: {
			mockData: [
				['2018/10/16', 20, 0],
				['2018/10/17', 20, 32],
				['2018/10/18', 20, 38],
				['2018/10/19', 20, 37],
				['2018/10/22', 20, 0],
				['2018/12/19', 20, 31],
				['2018/12/20', 20, 0],
				['2018/12/22', 20, 29],
				['2018/12/24', 20, 29],
				['2018/12/26', 20, 0],
				['2018/12/27', 200, 0],
				['2018/12/28', 20, 33],
				['2019/1/2', 200, 357],
				['2019/1/3', 100, 218],
				['2019/1/4', 200, 278],
				['2019/1/7', 200, 258],
				['2019/1/8', 100, 0],
				['2019/1/9', 200, 262],
				['2019/1/10', 200, 0],
				['2019/1/11', 100, 188],
				['2019/1/14', 200, 328],
				['2019/1/15', 200, 261],
				['2019/1/16', 20, 41],
				['2019/1/17', 200, 0],
				['2019/1/18', 200, 269],
				['2019/1/31', 200, 0],
				['2019/2/22', 200, 0],
				['2019/2/25', 200, 0],
				['2019/2/26', 200, 227],
				['2019/2/27', 200, 0],
				['2019/2/28', 200, 386],
				['2019/3/1', 50, 0],
				['2019/3/4', 200, 226],
				['2019/3/5', 200, 307],
				['2019/3/6', 200, 248],
				['2019/3/7', 50, 0],
				['2019/3/8', 200, 294],
				['2019/3/11', 200, 296],
				['2019/3/12', 200, 216],
				['2019/3/13', 50, 97],
				['2019/3/14', 200, 283],
				['2019/3/15', 200, 231],
				['2019/3/18', 200, 222],
				['2019/3/19', 50, 105],
				['2019/3/20', 200, 304],
				['2019/3/21', 200, 483],
				['2019/3/22', 200, 0],
				['2019/3/25', 200, 321],
				['2019/3/26', 200, 303],
				['2019/3/27', 200, 250],
				['2019/3/28', 50, 101],
				['2019/3/29', 200, 226],
				['2019/4/1', 200, 204],
				['2019/4/2', 50, 62],
				['2019/4/3', 50, 82],
				['2019/4/4', 200, 249],
				['2019/4/8', 50, 130],
				['2019/4/9', 200, 0],
				['2019/4/10', 50, 0],
				['2019/4/11', 200, 284],
				['2019/4/12', 200, 312],
				['2019/4/15', 200, 0],
				['2019/4/16', 200, 269],
				['2019/4/17', 50, 0],
			],
			chartsData: []
		},
		created() {
		},
		mounted() {
			this.initCharts();
		},
		methods: {
			initCharts() {
				// 基于准备好的dom，初始化echarts实例
				var myChart = echarts.init(document.querySelector('#charts'));
				// 开盘，收盘，最低，最高
				let temp = JSON.parse(JSON.stringify(this.mockData));
				this.chartsData = splitData(computeData(temp));
				function computeData(res) {
					return res.map((item, index) => {
						item[2] = (index === 0) ? item[2] - item[1] : res[index - 1][2] + item[2] - item[1];
						item[1] = (index === 0) ? item[1] : res[index - 1][2];
						if (item[2] > item[1]) {
							item.push(item[1]);
							item.push(item[2]);
						} else {
							item.push(item[2]);
							item.push(item[1]);
						}
						return item
					})
				}
				function splitData(rawData) {
					var categoryData = [];
					var values = []
					for (var i = 0; i < rawData.length; i++) {
						categoryData.push(rawData[i].splice(0, 1)[0]);
						values.push(rawData[i])
					}
					return {
						categoryData: categoryData,
						values: values
					};
				}
				option = {
					title: {
						text: '蚂蚁积分大盘走势',
						left: 'center'
					},
					tooltip: {
						show: true,
						trigger: 'axis',
						axisPointer: {
							type: 'line'
						}
					},
					grid: {
						left: '10%',
						right: '10%',
						bottom: '15%'
					},
					xAxis: {
						type: 'category',
						data: this.chartsData.categoryData,
						scale: true,
						boundaryGap: false,
						axisLine: {
							onZero: false
						},
						splitLine: {
							show: false
						},
						splitNumber: 20,
						min: 'dataMin',
						max: 'dataMax'
					},
					yAxis: {
						scale: true,
						splitArea: {
							show: true
						}
					},
					dataZoom: [
						{
							type: 'inside',
							start: 0,
							end: 100
						},
						{
							show: true,
							type: 'slider',
							y: '90%',
							start: 50,
							end: 100
						}
					],
					series: [
						{
							name: '大盘走势',
							type: 'candlestick',
							data: this.chartsData.values
						}
					]
				};

				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
			}
		}
	});