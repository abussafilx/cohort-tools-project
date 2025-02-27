const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");

const cohorts = require("./cohorts.json");
const students = require("./students.json");
const mongoose = require("mongoose");
const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model");

//Connect to MongoDB
const MONGODB_URI = "mongodb://127.0.0.1:27017/cohort-tools-api";

mongoose
  .connect(MONGODB_URI)
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
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
app.use(cors());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
//
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// COHORT ROUTES
app.get("/api/cohorts", (req, res) => {
  Cohort.find()
    .then((allCohorts) => {
      res.status(200).json(allCohorts);
    })
    .catch((e) =>
      res.status(500).json({ message: "Error getting the cohorts" })
    );
});

app.get("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Cohort.findById(cohortId)
    .then((cohort) => {
      res.status(200).json(cohort);
    })
    .catch((e) =>
      res.status(500).json({ message: "Error getting the cohort" })
    );
});

app.post("/api/cohorts", (req, res) => {
  Cohort.create(req.body)
    .then((newCohort) => {
      res.status(201).json(newCohort);
    })
    .catch((e) => res.status(500).json({ message: "Error creating a cohort" }));
});

app.put("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Cohort.findByIdAndUpdate(cohortId, req.body, { new: true })
    .then((cohort) => {
      res.status(200).json(cohort);
    })
    .catch((e) =>
      res.status(500).json({ message: "Error updating the cohort" })
    );
});

app.delete("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Cohort.findByIdAndDelete(cohortId)
    .then(() => res.status(204).send())
    .catch((e) =>
      res.status(500).json({ message: "Error deleting the cohort" })
    );
});

// STUDENT ROUTES

app.get("/api/students", (req, res) => {
  Student.find()
    .populate("cohort")
    .then((allStudents) => {
      res.status(200).json(allStudents);
    })
    .catch((e) => {
      res.status(500).json({ message: "error getting all students" });
    });
});

app.get("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  Student.findById(studentId)
    .populate("cohort")
    .then((student) => {
      res.status(200).json(student);
    })
    .catch((e) => {
      res
        .status(500)
        .json({ message: "error getting all students from cohort" });
    });
});

app.get("/api/students/cohort/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Student.find({ cohort:  cohortId  })
    .populate("cohort")
    .then((studentList) => {
      res.status(200).json(studentList);
    })
    .catch((e) => {
      res
        .status(500)
        .json({ message: "error getting all students from the cohort" });
    });
});

app.post("/api/students", (req, res) => {
  Student.create(req.body)
    .then((createdStudent) => res.status(201).json(createdStudent))
    .catch((e) => {
      console.log(e)
      res.status(500).json({ message: "error creating student" });
    });
});

app.put("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  Student.findByIdAndUpdate(studentId, req.body, { new: true })
    .then((student) => {
      res.status(200).json(student);
    })
    .catch((e) => {
      res.status(500).json({ message: "error updating student" });
    });
});

app.delete("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  Student.findByIdAndDelete(studentId)
    .then(() => {
      res.status(204).send();
    })
    .catch((e) => {
      res.status(500).json({ message: "error deleting student" });
    });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
