import "../component-styles/CreateStudent.css";
import { useState, useEffect } from "react";
import axios from "axios";

function CreateStudent() {
  const [studentName, setStudentName] = useState("");
  const [studentAge, setStudentAge] = useState(0);
  const [hasFinished, setHasFinished] = useState("yes");
  const [collegeName, setCollegeName] = useState("");
  const [degreeName, setDegreeName] = useState(""); //trebalo bi da bude dd lista
  const [interests, setInterests] = useState("");
  const [error, setError] = useState([]);
  const [success, setSuccessMessage] = useState({hasSucceded : "", message : ""});

  const createStudent = async (e) => {
    e.preventDefault();
    let validationErrors = [];
    //Name regex
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(studentName) || studentName.length < 3) {
      validationErrors.push(
        "The name must contain at least 3 letters and no numbers."
      );
    }

    if (studentAge < 18 || studentAge > 75) {
      validationErrors.push(
        "Student age can't be less than 18 or higher than 75."
      );
    }

    if (hasFinished === "") {
      validationErrors.push("Please provide if a student has finished or not.");
    }

    const collegeNameRegex = /^[A-Za-z\s]+$/;
    if (!collegeNameRegex.test(collegeName)) {
      validationErrors.push("Please provide a valid college name.");
    }

    const degreeNames = ["Bachelors", "Masters", "PhD"];
    const degreeRegex = degreeNames.includes(degreeName);

    if (degreeName !== "" && hasFinished === "no") {
      validationErrors.push("Invalid value.");
    }

    if (hasFinished === "yes" && !degreeRegex) {
      validationErrors.push("Please enter a valid degree.");
    }

    const interestArray = interests
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "" && /^[A-Za-z\s]+$/.test(item)); // Only allow letters and spaces

    if (interestArray.length < 1) {
      validationErrors.push("Please provide valid interests.");
    }

    if (validationErrors.length > 0) {
      setError(validationErrors);
      console.error(validationErrors);
      return;
    }

    setError([]); //resetovanje gresaka
    try {
      const xhrObj = await axios.post("/api/students/createStudent", {
        name: studentName.trim(),
        age: Number(studentAge),
        hasFinished: hasFinished === "yes",
        collegeName: collegeName,
        degreeName: hasFinished === "yes" ? degreeName.trim() : null,
        interests: interests.split(",").map((interest) => interest.trim()),
      });
      //console.log(xhrObj.data.message);

      setSuccessMessage({hasSucceded : true, message : xhrObj.data.message});
      window.location.reload();
      //console.log(success)
      
    } catch (err) {
      //console.error(err);
      if(err.status === 400) {
        setSuccessMessage({hasSucceded : false, message : "Bad, request, the data You've provided is invalid"});
        //console.log(success)
      }

      else {
        setSuccessMessage({hasSucceded : false, message : "Internal database error"});
        //console.log(success)
      }
      
    }
  };

  return (
    <>
      <div id="createStudent">
        <h2>Enter valid data and create a student record.</h2>
        <form onSubmit={createStudent}>
          <input
            type="text"
            placeholder="Enter a name"
            name="studentName"
            onChange={(e) => {
              setStudentName(e.target.value);
            }}
          />
          <input
            type="number"
            min={18}
            max={75}
            placeholder="Enter an age between 18 and 75"
            name="studentAge"
            onChange={(e) => {
              setStudentAge(Number(e.target.value));
            }}
          />
          <span style={{ marginTop: "10px" }}>Finished : yes</span>
          <input
            type="radio"
            name="finished"
            value={"yes"}
            onChange={(e) => {
              setHasFinished(e.target.value);
            }}
            checked={hasFinished === "yes"}
          />
          <span style={{ marginTop: "10px" }}>Finished : no</span>
          <input
            type="radio"
            name="finished"
            value={"no"}
            onChange={(e) => {
              setHasFinished(e.target.value);
            }}
            checked={hasFinished === "no"}
          />
          <input
            type="text"
            placeholder="Enter college name"
            name="collegeName"
            onChange={(e) => {
              setCollegeName(e.target.value);
            }}
          />
          <select
            onChange={(e) => {
              setDegreeName(e.target.value);
            }}
            disabled={hasFinished === "no"}
          >
            <option value="">Select a degree</option>
            <option value="Bachelors">Bachelors</option>
            <option value="Masters">Masters</option>
            <option value="PhD">PhD</option>
          </select>
          <input
            type="text"
            placeholder="Enter interests separated by comma"
            name="studentInterest"
            onChange={(e) => {
              setInterests(e.target.value);
            }}
          />
          <input type="submit" value={"Create a student"} />
          {error.length > 0 && (
            <ul id="errorList" style={{marginTop : "20px"}}>
              {error.map((error, index) => (
                <li style = {{color : "orange", fontWeight : "bolder" }} key={index}>{error}</li>
              ))}
            </ul>
          )}
          {success.message !== "" && (
            <p
              style={{
                color: success.hasSucceded ? "green" : "red",
                backgroundColor: "white",
                padding: "20px",
                marginTop : "20px"
              }}
            >
              {success.message}
            </p>
          )}
        </form>
      </div>
    </>
  );
}

export default CreateStudent;
