const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/umuzidb";

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "pug");

app.listen(3000, function () {
  console.log("listening on 3000");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

function addNewVisitor() {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("umuzidb");
    app.post("/new_visit", (req, res) => {
      dbo
        .collection("visitor").insertOne(req.body).then((result) => {
          dbo
            .collection("visitor").find().limit(1).sort({ $natural: -1 }).toArray(function (err, result) {
              if (err) throw err;
              res.render("index", {
                title: "Thank You",
                message: `Thanks for the info! The following was saved to the database:`,
                visitorId: `Visitor ID : ${result[0]._id}`,
                name: `Visitor Name    : ${result[0].name}`,
                assistant: `Assisted By: ${result[0].assistant}`,
                age: `Visitors Age     : ${result[0].age}`,
                date: `Date of Visit   : ${result[0].date}`,
                time: `Time of Visit   : ${result[0].time}`,
                comments: `Comments    : ${result[0].comments}`,
              });
              db.close();
            });
            return `visitor is added to the database`
        })
        .catch((error) => console.error(error));
    });
  });
}
addNewVisitor();

module.exports = { addNewVisitor };
