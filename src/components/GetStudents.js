
import "../component-styles/GetStudents.css";
import { useState, useEffect } from "react";

function GetStudents() {
  const [students, setStudents] = useState([]);
  const [hiddenClass, setHiddenClass] = useState("");
  const getStudents = async () => {
    try {
      const fetchObj = await fetch("/api/students");
      const students = await fetchObj.json();
      console.log(students);
      setHiddenClass("");
      setStudents(students.data);
    } catch (err) {
      console.error("Error from the client side");
    }
  };

  const hideStudents = (e)=> {
    setHiddenClass("hidden");
    //e.target.style.display = "none";
  }

  

  return (
    <>
      <div id="studentPlaceholder">
        <h3>
          Click on the button below to fetch all the students and their data.
        </h3>
        <input
          type="button"
          value="Click me to fetch students"
          onClick={getStudents}
        />
        {students.length < 1
          ? ""
          : students.map((student, index) => {
              return (
                <div key={index} className={`student ${hiddenClass}`}>
                  <ul>
                    <li>Name : {student.name}</li>
                    <li> Age : {student.age}</li>{" "}
                    <li>Finished : {student.finished ? <span>True</span> : <span>False</span>}</li>
                    <li> College : {student.college} </li>
                    <li>Degree : {student.degree ? student.degree : <span>Not finished</span>}</li>{" "}
                    <li>Interests : {student.interests.join(", ")}</li>
                  </ul>
                </div>
              );
            })}
            {students.length ? <input type="button" style={
              hiddenClass === "hidden" ? {display : "none"} : {display : "inline-block"} 
            } onClick={(e)=>hideStudents(e)} value={"Hide"} /> : ""}
      </div>
    </>
  );
}

export default GetStudents;
