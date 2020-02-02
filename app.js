const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const conn = require("./sql").conn;
const closeConnection = require("./sql").closeConnection;
const openConnection = require("./sql").connectToMySQL;

const app = express();

const PORT = process.env.PORT || 4300;

app.use(express.static("./"));
app.use(morgan("dev"));
app.use(bodyParser.json());

const failed = { err: "err" };

app.use(async function(req, res, next) {
  // util.log(util.inspect(req))
  const check = [];

  // Gets Names from DB with promise
  let promise = new Promise((resolve, reject) => {
    conn.query(`SELECT Name FROM Students`, function(err, rows) {
      if (err) {
        reject(console.log(err));
      } else {
        resolve(rows);
      }
    });
  });

  // Awaits promise and than fills check Array with rows from DB
  let rows = await promise;
  for (let i = 0; i < rows.length; i++) {
    const element = rows[i].Name;
    check.push(element);
  }

  // Check for either GET or other requests
  if (req.body.Name === undefined) {
    if (check.includes(req.query.Name) === true) {
      req.body.exists = true;
    } else {
      req.body.exists = false;
    }
  } else {
    if (check.includes(req.body.Name) === true) {
      req.body.exists = true;
    } else {
      req.body.exists = false;
    }
  }

  // Checks if DB includes Name
  next();
});

// VIEW ALL ---
app.get("/students", (req, res, next) => {
  conn.query(`SELECT * FROM Students`, function(err, rows) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

// CREATE ---
app.post("/", (req, res, next) => {
  if (req.body.exists === false) {
    conn.query(
      `INSERT INTO Students (Name, GPA, School) VALUES ('${req.body.Name}', '${req.body.GPA}', '${req.body.School}')`,
      function(err, row) {
        if (err) {
          console.log("Create error1: " + err);
          res.send(err);
        } else {
          conn.query(`SELECT * FROM Students`, function(err, rows) {
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              res.send(rows);
            }
          });
        }
      }
    );
  } else {
    res.send(failed);
  }
});

// VIEW ---
app.get("/view", (req, res, next) => {
  console.log("Req Body Name in view is: " + req.query.Name);

  if (req.body.exists === true) {
    conn.query(
      `SELECT * FROM Students WHERE name = '${req.query.Name}'`,
      function(err, row) {
        if (err) {
          console.log("err: " + err);
          res.send(err);
        }
        console.log(row[0]);
        res.send(row[0]);
      }
    );
  } else {
    res.send(failed);
  }
});

// UPDATE ---
app.put("/", async function(req, res, next) {
  console.log(
    `Update values are: '${req.body.Name}', '${req.body.GPA}', '${req.body.School}'`
  );

  console.log(req.body.exists);
  if (req.body.exists === true) {
    if (req.body.GPA !== "") {
      console.log("Updating GPA");

      let promise = new Promise((resolve, reject) => {
        conn.query(
          `UPDATE Students SET GPA = '${req.body.GPA}' WHERE Name= '${req.body.Name}'`,
          function(err) {
            if (err) {
              console.log("Updating err: " + err);
              reject(res.send(err));
            } else {
              resolve();
            }
          }
        );
      });

      await promise;
    }

    if (req.body.School !== "") {
      console.log("Updating School");

      let promise = new Promise((resolve, reject) => {
        conn.query(
          `UPDATE Students SET School = '${req.body.School}' WHERE Name= '${req.body.Name}'`,
          function(err) {
            if (err) {
              console.log("Updating err: " + err);
              reject(res.send(err));
            } else {
              resolve();
            }
          }
        );
      });

      await promise;
    }

    conn.query(`SELECT * FROM Students`, function(err, rows) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(rows);
      }
    });
  } else {
    res.send({ err: "err" });
  }
});

// DELETE ---
app.delete("/:name", (req, res, next) => {
  if (req.body.exists === true) {
    conn.query(`DELETE FROM Students WHERE name = '${req.body.Name}'`, function(
      err
    ) {
      if (err) {
        console.log(err);
        res.send(failed);
      } else {
        console.log("first del");
        conn.query(`SELECT * FROM Students`, function(err, rows) {
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            res.send(rows);
          }
        });
      }
    });
  } else {
    res.send(failed);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});

module.exports = app;
