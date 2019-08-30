const express = require('express')
const db = require('./mysql.js')
const app = express();

app.use(express.static('files'));

app.get('/api/getHealthData',function(req,res){
  db.queryData().then((data)=>{
    res.json(data);
  })
})

app.post('/api/updateHealthData',function(req,res){
  db.updateData(req.body).then((data)=>{
    res.json(data);
  })
})

app.listen('3000',function(){
  console.log("The server is Listening on Port 3000");
})