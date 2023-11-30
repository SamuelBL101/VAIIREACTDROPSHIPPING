import React, { useState, useEffect } from "react";
import Axios from 'axios';
import styles from "../css/reg.module.css"; 
import { useAuth } from 'react-auth-verification-context';


  

const Register = () => {
  const { isAuthenticated, attributes } = useAuth();

  useEffect(() => {
    console.log("Is Authenticated:", isAuthenticated);
    console.log("User Information:", attributes);
  }, [isAuthenticated, attributes]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitRegistration = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    Axios.post("http://localhost:3001/api/insertUser", {
      username,
      email,
      password
    })
    .then((response) => {
      alert(response.data.message);
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
  };

  return (
    <div className={styles.registration}>
      <h2 className={styles["registration-h2"]}>Registrácia</h2>
      <form className={styles["registration-form"]}>
        <label className={styles["registration-label"]}>
          Užívateľské meno:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles["registration-input"]}
          />
        </label>
        <label className={styles["registration-label"]}>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles["registration-input"]}
          />
        </label>
        <label className={styles["registration-label"]}>
          Heslo:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles["registration-input"]}
          />
        </label>
        <label className={styles["registration-label"]}>
          Potvrdenie hesla:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles["registration-input"]}
          />
        </label>
        <button type="button" onClick={submitRegistration} className={styles["registration-button"]}>
          Registrovať sa
        </button>
      </form>
      <div>
      {isAuthenticated ? (
          <p>User {attributes?.id} is logged in</p>
        ) : (
          <p>User is not logged in</p>
        )}
    </div>
    </div>
  );
};

export default Register;