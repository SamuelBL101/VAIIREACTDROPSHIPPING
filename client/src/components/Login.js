import React, { useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import styles from "../css/log.module.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const handleLogin = () => {
    Axios.post("http://localhost:3001/api/login", {
      username: username,
      password: password,
    })
      .then((response) => {
        alert("Login successful");
        // Handle successful login, e.g., redirect to a new page
      })
      .catch((error) => {
        setError("Invalid username or password");
        alert(error.response.data.message);
      });
  };

  return (
    <div className={styles.login}>
      <h2>Prihlásenie</h2>
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
    </div>
  );
};

export default Login;