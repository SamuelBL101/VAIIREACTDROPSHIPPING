import React, { useState, useEffect } from "react";
import Axios from 'axios';
//import "../css/reg.css"; // 



const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitRegistration = () => {
    Axios.post("http://localhost:3001/api/insert", {
    username: username ,
    email:email,
    password:password
    }).then(() => {
      alert("Succesfull insert");
    });
  };

  return (
    <div>
      <h2>Registrácia</h2>
      <form>
        <label>
          Užívateľské meno:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Heslo:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <label>
          Potvrdenie hesla:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="button" onClick={submitRegistration} >
          Registrovať sa
        </button>
      </form>
    </div>
  );
};

export default Register;