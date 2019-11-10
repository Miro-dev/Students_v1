const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./db.sqlite");

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS Students`);
  db.run(`CREATE TABLE IF NOT EXISTS Students (
        id INTEGER PRIMARY KEY,
        Name TEXT NOT NULL,
        GPA INTEGER NOT NULL,
        School TEXT NOT NULL,
        UNIQUE(Name))`);

  // Adding initial Entries
  db.run(
    `INSERT OR IGNORE INTO Students (Name, GPA, School) VALUES ('Sonya', 120, '7th Math')`,
    err => {}
  );
  db.run(
    `INSERT OR IGNORE INTO Students (Name, GPA, School) VALUES ('Sam', 150, '5th Math')`,
    err => {}
  );
});

module.exports = db;
