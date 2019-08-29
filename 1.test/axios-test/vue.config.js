module.exports = {
  devServer: {
    proxy: {
      '/apiopen': {    //将https://www.apiopen.top/印射为/apiopen
        target: 'https://www.apiopen.top/',  // 接口域名
        secure: true,  // 如果是https接口，需要配置这个参数
        changeOrigin: true,  //是否跨域
        pathRewrite: {
          '^/apiopen': ''   //需要rewrite的
        }
      },
      '/mxnzp': {    
        target: 'http://www.mxnzp.com/api/', 
        changeOrigin: true,  
        pathRewrite: {
          '^/mxnzp': ''  
        }
      }
    },
    port:'8090'
  }

}