import Header from "./Header";
import GetStudents from "./GetStudents";
import CreateStudent from "./CreateStudent";
import DeleteStudent from "./DeleteStudent";
import UpdateStudent from "./UpdateStudent";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorList, setErrorList] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const role = localStorage.getItem("role");
  const handleLogin = async () => {
    //Input validation
    let validationErrors = [];
    if (userName.length < 3) {
      validationErrors.push("Invalid username.");
    }
    if (!password) {
      validationErrors.push("Invalid password.");
    }

    if (validationErrors.length > 0) {
      setErrorList(validationErrors);
      console.log(userName, password);
      return;
    }

    setErrorList([]);

    try {
      const objToSend = {
        userName: userName,
        password: password,
      };

      const res = await axios.post("/auth/login", objToSend);
      console.log(res);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        setSuccessMessage("You've successfully logged in.");
        setTimeout(()=>{window.location.reload()},2000);
      }
    } catch (error) {
      setSuccessMessage(error.response.data.message);
    }
  };

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      {localStorage.length === 0 && (
        <div id="logInForm">
          <h2>Welcome to students page.</h2>
          <h2>
            {" "}
            Log in to see students or make changes if You're a moderator.
          </h2>
          <form>
            <input
              type="text"
              placeholder="Enter username"
              name="username"
              onChange={(e) => handleUserNameChange(e)}
            />
            <input
              type="text"
              placeholder="Enter password"
              name="password"
              onChange={(e) => handlePasswordChange(e)}
            />
            <input type="button" value={"Log in"} onClick={handleLogin} />
          </form>
          {errorList.length > 0 && (
            <ul>
              {errorList.map((error, errorIndex) => (
                <li style={{ color: "whites" }} key={errorIndex}>
                  {error}
                </li>
              ))}
            </ul>
          )}
          <p style={{textAlign:"center", marginTop:"1em"}}>
            {success}
          </p>
        </div>
      )}
      {role === "user" && (
        <>
          <Header /> <GetStudents />
          <input
            type="button"
            style={{
              margin: "1em auto",
              display: "block",
              padding: "10px 20px",
              backgroundColor: "red",
              borderRadius: "10px",
            }}
            value={"Log out"}
            onClick={handleLogOut}
          />
        </>
      )}
      ;
      {role === "moderator" && (
        <>
          <Header />
          <GetStudents />
          <CreateStudent />
          <DeleteStudent />
          <UpdateStudent />
          <input
            style={{
              margin: "1em auto",
              display: "block",
              padding: "10px 20px",
              backgroundColor: "red",
              borderRadius: "10px",
            }}
            type="button"
            value={"Log out"}
            onClick={handleLogOut}
          />
        </>
      )}
    </>
  );
}

export default App;
