const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors")

const cohorts = require("./cohorts.json")
const students = require("./students.json")

//Connect to MongoDB 
const MONGODB_URI = "mongodb://127.0.0.1:27017/cohort-tools-api";

mongoose
  .connect(MONGODB_URI)
  .then((x) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to mongo", err));

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...



// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// 
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// 
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.get("/api/cohorts", (req, res, next) => {
  res.json(cohorts)
});

app.get("/api/students", (req, res, next) => {
  res.json(students)
})


// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});