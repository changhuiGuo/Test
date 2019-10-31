module.exports = {
  publicPath: "./",
  devServer: {
    proxy: {
      '/api/': {
        target: 'http://120.79.153.232:3000/',
        changeOrigin: true,
      },
    }
  }
}