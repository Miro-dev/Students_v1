const mysql = require("mysql");

var config = {
  host: "sql7.freesqldatabase.com",
  user: "sql7321026",
  password: "siQiGMPceA",
  database: "sql7321026",
  port: 3306,

  ssl: false
};

const conn = new mysql.createConnection(config);

function connectToMySQL() {
  conn.connect(function(err) {
    if (err) {
      console.log("!!! Cannot connect !!! Error:");
      throw err;
    } else {
      console.log("Connection established.");
    }
  });
}

connectToMySQL();
// ======================================================================

conn.query("DROP TABLE IF EXISTS Students;", function(err, results, fields) {
  if (err) throw err;
  console.log("Dropped Students table if existed.");
});

conn.query(
  `CREATE TABLE IF NOT EXISTS Students (
      id INTEGER PRIMARY KEY AUTO_INCREMENT,
      Name TEXT NOT NULL,
      GPA INTEGER NOT NULL,
      School TEXT NOT NULL)`,
  function(err, results, fields) {
    if (err) throw err;
    console.log("Created Students table.");
  }
);

conn.query(
  `INSERT INTO Students (Name, GPA, School) VALUES ('Sonya', 9, '7th Math')`,
  function(err, results, fields) {
    if (err) throw err;
    console.log("Inserted " + results.affectedRows + " row(s).");
  }
);

conn.query(
  `INSERT INTO Students (Name, GPA, School) VALUES ('Sam', 7, '5th Math')`,
  function(err, results, fields) {
    if (err) throw err;
    console.log("Inserted " + results.affectedRows + " row(s).");
  }
);

function closeConnection() {
  conn.end(function(err) {
    if (err) throw err;
    else console.log("Done.");
  });
}

module.exports.conn = conn;
module.exports.closeConnection = closeConnection;
module.exports.connectToMySQL = connectToMySQL;
