const fs = require('fs');
let mockData = '';
fs.writeFile('./www/mock.json',JSON.stringify({a:123,b:456}),err=>{
  if(err){
    console.log("写入失败!")
  }else{
    console.log('写入成功!');
  }
});

const http = require('http');
http.createServer((req,res)=>{
  console.log(req.url);
  fs.readFile(`./www/${req.url}`,(err,data)=>{
    if(err){
      res.writeHead(404);
      res.write('Not Found');
    }else{
      console.log('读取成功:',data);
      res.write(data);
    }
    res.end(); 
  });
}).listen(8090);

console.log('服务已运行: http://127.0.0.1:8090/');