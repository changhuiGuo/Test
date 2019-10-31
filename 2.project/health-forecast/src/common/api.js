import axios from 'axios'

axios.defaults.timeout = 1000*10;
//axios.defaults.baseURL = "http://120.79.153.232:3000/";
//axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
const baseURL = "http://120.79.153.232";
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
      url:baseURL+options.url,
    }
    options.method === "GET" ? params.params = options.data : params.data = options.data;
    return axios(params)
  },
  /**
   * 获取体重数据
   */
  getHealthData:function(){
    let options = {
      method:'GET',
      url:'/api/getHealthData',
    };
    return this._getData(options);
  },
  /**
   * 更新体重数据
   */
  updateHealthData:function(params){
    let options = {
      method:'POST',
      url:'/api/updateHealthData',
      data:params
    };
    return this._getData(options);
  },
  /**
   * 增加一条数据
   */
  insertHealthData:function(params){
    let options = {
      method:'POST',
      url:'/api/insertHealthData',
      data:params
    };
    return this._getData(options);
  },
  /**
   * 删除一条数据
   */
  deleteHealthData:function(params){
    let options = {
      method:'POST',
      url:'/api/deleteHealthData',
      data:params
    };
    return this._getData(options);
  },
}