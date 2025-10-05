const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

// temporary data
let students = [];

// GET route
app.get("/students", (req, res) => {
  res.json(students);
});

// POST route
app.post("/students", (req, res) => {
  const newStudents = req.body; // expects an array or object
  if (Array.isArray(newStudents)) {
    students.push(...newStudents);
  } else {
    students.push(newStudents);
  }
  res.status(201).json({ message: "Students added successfully", students });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
const studentRoutes = require('./routes/studentRoutes');
app.use('/students', studentRoutes);