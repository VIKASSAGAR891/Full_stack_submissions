const Student = require('../models/studentModel');

// Get all students
exports.getStudents = async (req, res) => {
  const students = await Student.find();
  res.status(200).json(students);
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.status(200).json(student);
};

// Add new student
exports.createStudent = async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json(student);
};

// Update student
exports.updateStudent = async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(student);
};

// Delete student
exports.deleteStudent = async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  res.status(200).json({
    message: "Student deleted",
    student
  });
};
