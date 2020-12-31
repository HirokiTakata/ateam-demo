// app.js
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'takata',
  password: 'Hey5587283',
  database: 'recipes'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});
 
let list = []
connection.query('SELECT * FROM recipes', (err,rows) => {
  if(err) throw err;
 
  console.log('Data received from Db:\n');
  console.log(rows);
  for(let i=0;i<rows.length;i++){
    list.push(rows[i]);
  }
  console.log(list[0]);

});