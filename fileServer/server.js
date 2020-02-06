var express = require('express')
var bodyParser = require('body-parser')
var fs = require('fs')
var formidable = require('formidable')
var app = express();

app.listen(3000)
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
console.log('--- server is on localhost:3000 ---')

/***********
 * 上传文件请求
 ***********/
 app.post('/uploadFile',function(req,res){
     var id = '';
     var form = new formidable.IncomingForm()

     form.uploadDir = './files' // 文件保存路径
     form.keepExtensions = true // 保持原文件扩展名
     form.on('file',(name,file)=>{ // 接收文件事件
        console.log(``)

     })
 })