var mysql = require('mysql');
var db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'hui_db'
});

module.exports = {
  /**
   * 增
   */
  insertData:function(params){ 
    return new Promise((resolve,reject)=>{
      let sql = `INSERT INTO health_info(date,weight) VALUES(${params.date},${params.weight})`;
      db.query(sql, function (error, results) {
        if (error) throw error;
        resolve(results);
        console.log('--------------------------INSERT----------------------------');
        console.log(`INSERT ${JSON.stringify(params)} Successful!`)
        console.log('------------------------------------------------------------');
      });
    })
  },
  /**
   * 删
   */
  deleteData:function(params){
    return new Promise((resolve,reject)=>{
      let sql = `DELETE FROM health_info where date = ${params.date}`;
      db.query(sql, function (error, results) {
        if (error) throw error;
        resolve(results);
        console.log('--------------------------DELETE----------------------------');
        console.log(`DELETE ${JSON.stringify(params)} Successful!`)
        console.log('------------------------------------------------------------');
      });
    })
  },
  /**
   * 改
   */
  updateData:function(params){
    return new Promise((resolve,reject)=>{
      let sql = `UPDATE health_info SET weight = ${params.weight} WHERE date = ${params.date}`;
      db.query(sql, function (error, results) {
        if (error) throw error;
        resolve(results);
        console.log('--------------------------UPDATE----------------------------');
        console.log(`UPDATE ${JSON.stringify(params)} Successful!`)
        console.log('------------------------------------------------------------');
      });
    })
  },
  /**
   * 查
   */
  queryData:function(){
    return new Promise((resolve,reject)=>{
      let sql = `SELECT * FROM health_info ORDER BY date DESC`;
      db.query(sql, function (error, results) {
        if (error) throw error;
        resolve(results);
        console.log('--------------------------QUERY----------------------------');
        console.log(`QUERY Successful!`)
        console.log('------------------------------------------------------------');
      });
    })
  },
}