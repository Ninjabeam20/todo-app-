const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Bond@007",
  database: "todo_app"
});

db.connect(function (err) {
  if (err) throw err;
  console.log("✅ MySQL connected");
});

module.exports = db;
