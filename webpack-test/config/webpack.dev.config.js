module.exports = {
  entry:'./main.js',
  output:{
    filename:'./build/dist.js'
  },
  module:{
    loaders:[
      {
        test:/\.vue$/,
        loader:'vue-loader'
      }
    ]
  }
  // watch:true
}