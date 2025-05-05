import "../component-styles/UpdateStudent.css";
import { useState, useEffect } from "react";
import axios from "axios";

function UpdateStudent() {

    const [students, setStudents] = useState([]);
    useEffect(()=>{
        const getStudents = async () => {
            try {
              const fetchObj = await fetch("/api/students");
              const studentsObj = await fetchObj.json();
              /* console.log(studentsObj); */
              setStudents(studentsObj.data);
              //console.log(students)
            } catch (err) {
              console.error("Error from the client side");
            }
          };

          getStudents();
    },[])


    async function updateStudent(studentId) {
        const studentToUpdate = students.find((student)=>student._id === studentId);
        const {finished, degree} = studentToUpdate;
        const dataToSend = {
            finished : finished,
            degree : degree
        };

        try {

            const xhrObj = await axios.put(`/api/students/updateStudent/${studentId}`,dataToSend);
            /* console.log(xhrObj); */
            if(xhrObj.status === 202) {
                alert("Student updated successully");
                setStudents((previousStudents)=>
                    previousStudents.map((student)=>student._id === studentId ? {...student, finished, degree} : student)
                );

                //console.log(students)
            }


        }
        catch(error) {
            console.error(error);
            if(error.status === 400) {
                alert(error.response.data.message + ".");
            }

            else alert("Internal server error!");
        }
    }

    const handleFinishedCollege = (index, value) => {
        setStudents(prevStudents => {
            const updatedStudents = [...prevStudents];
            updatedStudents[index] = { 
                ...updatedStudents[index], 
                finished: value, 
                degree: value ? updatedStudents[index].degree : null 
            };
            return updatedStudents;
        });
    };
    
    

    const handleDegreeChange = (index, value) => {
        setStudents(prevStudents => {
            const updatedStudents = [...prevStudents];
            updatedStudents[index] = { ...updatedStudents[index], degree: value };
            return updatedStudents;
        });
    };
    


    

    return <>
        {students.length === 0 ? (<p>Loading students...</p>) : (
            <table style={{backgroundColor:"teal"}}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>College</th>
                        <th>Has Finished</th>
                        <th>Degree</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index)=>(
                        <tr key={student._id}>
                            <td>{student.name}</td>
                            <td>{student.college}</td>
                            {/* {console.log(student.finished)} */}
                            <td>
                                <input type="radio"  name={`hasFinished-${index}`} value={"yes"} checked={student.finished === true} onChange={(e)=>handleFinishedCollege(index, true )} />
                                <input type="radio"  name={`hasFinished-${index}`} value={"no"} checked={student.finished === false} onChange={(e)=>handleFinishedCollege(index, false )}  /> 
                            </td>
                            <td>
                                <select disabled={!student.finished} value={student.degree ? student.degree : ""}  onChange={(e) => handleDegreeChange(index, e.target.value)}>
                                    <option value="">Select a degree</option>
                                    <option value="Bachelors">Bachelors</option>
                                    <option value="Masters">Masters</option>
                                    <option value="PhD">PhD</option>
                                </select>
                            </td>
                            <td><input type="button" value={"Save"} onClick={()=>updateStudent(student._id)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </>
}

export default UpdateStudent;