const express = require("express");
const { getStudentsData, createStudent, deleteStudent, updateStudent } = require("../controllers/students");
const router = express.Router();

router.get("/", getStudentsData);
router.post("/createStudent", createStudent);
router.delete("/deleteStudent/:id", deleteStudent);
router.put("/updateStudent/:studentId", updateStudent);

module.exports = router;