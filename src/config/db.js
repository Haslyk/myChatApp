const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'chatapp'
});

connection.connect(function(err) {
  if(err)
  {
    console.log("Bağlanılamadı : "+ err.stack)
    return;
  }
  console.log("Başarıyla bağlanıldı")
})

module.exports = connection