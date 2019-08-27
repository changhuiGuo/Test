import axios from 'axios'

axios.defaults.timeout = 1000*10;
// axios.defaults.baseURL = ""
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default{
  /**
   * 获取数据公用方法
   */
  _getData:function(options){
    let params = {
      method:options.method,
      url:options.url,
    }
    options.method === "GET" ? params.params = options.data : params.data = options.data;
    return axios(params)
  },
  /**
   * 获取天气信息
   * https://www.apiopen.top/weatherApi?city=深圳
   */
  getWeatherInfo:function(params){
    let options = {
      method:'GET',
      url:'/apiopen/weatherApi',
      data:params
    };
    return this._getData(options);
  },
  /**
   * 获取全国所有的城市名称
   * http://www.mxnzp.com/api/address/list
   */
  getAllCity:function(params){
    let options = {
      method:'GET',
      url:'/mxnzp/address/list',
      data:params
    };
    return this._getData(options);
  },
  /**
   * 获取本地模拟数据
   * /public/mock/data.json
   */
  getMockData:function(params){
    let options = {
      method:'GET',
      url:'/mock/data.json',
      data:params
    };
    return this._getData(options);
  },
  
}