import React, { useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import styles from "../css/log.module.css";
import { Redirect } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);


  const handleLogin = () => {
    Axios.post("http://localhost:3001/api/login", {
      username: username,
      password: password,
    })
      .then((response) => {
        if (response.data.auth) {
          alert("Login successful");
          setLoginStatus("true");
          localStorage.setItem("token", response.data.token);
          // Handle successful login, e.g., redirect to a new page
        } else {
          setError("Invalid username or password");
          alert(response.data.message);
          setLoginStatus("false");
        }
      })
      .catch((error) => {
        setError("Invalid username or password");
        console.error('Error during login:', error);
  
        // Check if error.response is defined before accessing properties
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          // Handle the case when error.response is undefined or doesn't have the expected structure
          console.error("Unexpected error structure:", error);
        }
  
        setLoginStatus("false");
      });
  };

  const userAuth = () => {
    Axios.get("http://localhost:3001/api/isUserAuth", { 
      headers: {
        "x-access-token": localStorage.getItem("token"),
      }
    }).then((response) => {
      console.log(response);
    });
  };

  return (
    <div className={styles.login}>
      <h2>Prihlásedie</h2>
      <form>
        <label>
          Užívateľské meno:
          <input
            id="meno"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>
        <br />
        <label>
          Heslo:
          <input
            id="heslo"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Prihlásiť sa
        </button>
      </form>

      <p>
        Nemáte ešte účet? <Link to="/Register">Zaregistrujte sa tu</Link>.
      </p>
      {loginStatus && (
        <button onClick={userAuth}>Checkd if login</button>
      )}
    </div>


    

  );
};

export default Login;