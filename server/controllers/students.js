//Imports
const { MongoClient, ObjectId} = require("mongodb");
const { connection } = require("../models/connection");
const dotenv = require("dotenv").config();
//Mongo credentials
const uri = process.env.URI;
const dataBaseName = process.env.DB;
const collectionName = process.env.COLLECTION1;
const client = new MongoClient(uri);



async function getStudentsData(req, res) {
    try {
      const {collection} = await connection(client, dataBaseName, collectionName);
      const studentData = await collection.find({}).toArray();
      console.log(studentData);
      return res.status(200).json({ success: true, data: studentData });
    } catch (error) {
        return res
        .status(500)
        .json({ success: false, message: "Error fetching students" });
    }
}
  
async function createStudent(req, res) {
    
    //Client input

    console.log(req.body)
    const { name, age, hasFinished, collegeName, degreeName, interests} = req.body;

    //Server-side input validation

    var validationErrors = [];

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name) || name.length < 3) {
      validationErrors.push(
        "The name must contain at least 3 letters and no numbers"
      );
    }
  
    if (age < 18 || age > 75 || typeof age !== "number") {
      validationErrors.push(
        "Student age can't be less than 18 or higher than 75"
      );
    }
  
    if (typeof hasFinished !== "boolean") {
      validationErrors.push("Please provide if a student has finished or not.");
    }
  
    const collegeNameRegex = /^[A-Za-z\s]+$/;
    if (!collegeNameRegex.test(collegeName)) {
      validationErrors.push("Please provide a valid college name");
    }
  
    const degreeNames = ["Bachelors", "Masters", "PhD"];
    const degreeRegex = degreeNames.includes(degreeName);
  
    if (degreeName && !hasFinished) {
      validationErrors.push("Invalid value");
    }
  
    if (hasFinished && !degreeRegex) {
      validationErrors.push("Please enter a valid degree");
    }
  
    const interestArray = interests
      .map((item) => item.trim())
      .filter((item) => item !== "" && /^[A-Za-z\s]+$/.test(item));
  
    if (interestArray.length < 1) {
      validationErrors.push("Please provide valid interests.");
    }
  
    if (validationErrors.length > 0) {
        return res
        .status(400)
        .json({ success: false, errors: validationErrors });
    }

    //Try to create a student
    try {
       const { collection } = await connection(client, dataBaseName, collectionName);
       const studentCreation = await collection.insertOne({
            name: name,
            age: Number(age),
            finished: hasFinished,
            college: collegeName,
            degree: degreeName,
            interests: interestArray,
      });
      console.log(studentCreation);
      return res.status(201).json({ success: true, message: "Student successfully created!" });
    } catch (error) {
      console.error("Db side error", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    } 
}

async function deleteStudent(req, res) {
    try {
      const { id } = req.params;
      const { collection } = await connection(client, dataBaseName, collectionName);
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if(result.deletedCount === 0) {
        return res.status(404).json({success:false,message : "The student with the following id not found"});
      }    
      return res.status(200).json({success:true, message : "You'have successfully deleted a student"});
    } catch (error) {
      console.error(error);
      return res.status(500).json({success:false,message : "Internal server error",error : error});
    }
}
  
async function updateStudent(req, res) {
    try {
      const { studentId } = req.params;
      const { finished, degree } = req.body;
      const { collection } = await connection(client, dataBaseName, collectionName);
      const updateResult = await collection.updateOne({_id : new ObjectId(studentId)},{$set : {finished : finished, degree : degree }});
  
      if(Number(updateResult.modifiedCount) === 0 ) {
        return res.status(400).json({success : false, message : updateStudentR.error});
      }
  
      return res.status(202).json({success : true, message : "Successfully updated the student"});
  
    }
    catch(error) {
      console.log(error, "Internal database error");
      return res.status(400).json({success : false, message : error});
    }
}

module.exports = { getStudentsData, createStudent, deleteStudent, updateStudent };