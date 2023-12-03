import React, { useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import styles from "../css/log.module.css";
import { useAuth } from 'react-auth-verification-context';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();  // Removed setLoginStatus

  const handleLogin = () => {
    Axios.post("http://localhost:3001/api/login", {
      username: username,
      password: password,
    })
      .then((response) => {
        if (response.data.auth) {
          alert("Login successful");
          const token = response.data.token;
          const user = response.data.user;
          console.log('Received token:', token);
          console.log('Received user:', user);
          
          localStorage.setItem("token", token);
          // Call the login function from useAuth
          login({
            username: user.username,
            email: user.email,
            id: user.user_id,
          });
          Link.push("/");
        } else {
          alert("Invalid username or password");
        }
      })
      .catch((error) => {
        alert("Invalid username or password");
        console.error('Error during login:', error);
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
    </div>
  );
};

export default Login;
