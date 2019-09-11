const express = require('express')
const bodyParser = require("body-parser")
const db = require('./mysql.js')
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('files'));

app.post('/api/insertHealthData',function(req,res){
  db.insertData(req.body).then((data)=>{
    res.json(data);
  })
})

app.post('/api/deleteHealthData',function(req,res){
  db.deleteData(req.body).then((data)=>{
    res.json(data);
  })
})

app.post('/api/updateHealthData',function(req,res){
  db.updateData(req.body).then((data)=>{
    res.json(data);
  })
})

app.get('/api/getHealthData',function(req,res){
  db.queryData().then((data)=>{
    data.forEach(item => {
      let dateObj = new Date(item.date);
      let year = dateObj.getFullYear();
      let month = dateObj.getMonth()+1;
      month < 10 ? month='0'+month :'';
      let date = dateObj.getDate();
      date < 10 ? date='0'+date :'';
      item.date = `${year}-${month}-${date}`;
      item.weight = item.weight.toFixed(1);
    });
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