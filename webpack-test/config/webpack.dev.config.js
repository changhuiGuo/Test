const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
  entry:'./main.js',
  output:{
    path:path.resolve('./build'),
    filename:'dist.js'
  },
  module:{
    rules:[
      {
        test:/\.vue$/,
        use:['vue-loader']
      },
      {
        test:/\.css$/,
        use:['style-loader,css-loader']
      },
      {
        test:/\.less$/,
        use:['style-loader','css-loader','less-loader']
      },
      {
        test:/\.(jpg|jpeg|png|bmp|svg|gif)$/,
        use:[{
          loader:"url-loader",
          options:{
            limit:2000,
          }
        }]
      }
    ]
  },
  plugins:[
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template:'./index.html'
    })
  ]
  // watch:true
}