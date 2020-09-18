const { addNewVisitor } = require(`../src/server`);
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/umuzidb";
const visitorData = {
  name: `Vicky Vilakazi`,
  assistant: `Benjamin Dube`,
  age: `45`,
  date: `06/05/2020`,
  time: `13:47`,
  comments: `Jerusalema`,
};

MongoClient.connect(url, function (err, db) {
  const dbo = db.db("umuzidb");
  if (err) throw err;
  dbo
    .collection("visitor")
    .insertOne(visitorData)
    .then((result) => {});
  db.close();
});

describe(`This checks if mongoDB works`, () => {
  it(`should save data into the database and retrive that data`, () => {
    MongoClient.connect(url, function (err, db) {
      const dbo = db.db("umuzidb");
      if (err) throw err;
      dbo
        .collection("visitor").find().limit(1).sort({ $natural: -1 }).toArray(function (err, result) {
          expect(visitorData.name).toBe(result[0].name);
          expect(visitorData.assistant).toBe(result[0].assistant);
          expect(visitorData.age).toBe(result[0].age);
          expect(visitorData.date).toBe(result[0].date);
          expect(visitorData.time).toBe(result[0].time);
          expect(visitorData.comments).toBe(result[0].comments);
        });
      db.close();
    });
  });
});