import "../component-styles/DeleteStudent.css";
import {useState, useEffect} from 'react';


function DeleteStudent() {


    const [students, setStudents] = useState([]);

    useEffect(()=>{
        const getStudents = async () => {
            try {
              const fetchObj = await fetch("/api/students");
              const studentsObj = await fetchObj.json();
              console.log(studentsObj);
              setStudents(studentsObj.data);
              //console.log(students)
            } catch (err) {
              console.error("Error from the client side");
            }
          };

          getStudents();
    },[])

    async function deleteStudent(studentId) {
        if (window.confirm(`Are you sure you want to delete a student with the ID ${studentId}?`)) {
            try {
                const deleteConfirmation = await fetch(`/api/students/deleteStudent/${studentId}`, { method: "DELETE" });
                const message = await deleteConfirmation.json();
               
                alert(message.message);
    
                // 🔹 Remove the deleted student from the list (optional, improves UX)
                setStudents(prevStudents => prevStudents.filter(student => student._id !== studentId));
            }
            catch (err) {
                console.error("Error deleting student:", err);
            }
        } else {
            alert("Deletion canceled.");
        }
    }
    

    
    return <>
        {students.length == 0 ? ("") : (
           <table>
           <thead>
             <tr>
               <th>Name</th>
               <th>Age</th>
               <th>College</th>
               <th>Finished</th>
               <th>Degree</th>
               <th>Actions</th>
             </tr>
           </thead>
           <tbody>
             {students.map((student) => (
               <tr key={student._id}>
                 <td>{student.name}</td>
                 <td>{student.age}</td>
                 <td>{student.college}</td>
                 <td>{student.finished ? "Yes" : "No"}</td>
                 <td>{student.finished ? student.degree : "Not finished yes"}</td>
                 <td>
                   <input 
                     type="button" 
                     value="Delete a student" 
                     onClick={() => deleteStudent(student._id)} 
                   />
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
         
        ) }  
    </>
}

export default DeleteStudent;
