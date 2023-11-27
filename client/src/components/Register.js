import React, { useState, useEffect } from "react";
import Axios from 'axios';
import styles from "../css/reg.module.css"; 

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitRegistration = () => {
    Axios.post("http://localhost:3001/api/insert", {
      username: username,
      email: email,
      password: password
    }).then(() => {
      alert("Successful insert");
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
        <br />
        <label className={styles["registration-label"]}>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles["registration-input"]}
          />
        </label>
        <br />
        <label className={styles["registration-label"]}>
          Heslo:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles["registration-input"]}
          />
        </label>
        <br />
        <label className={styles["registration-label"]}>
          Potvrdenie hesla:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles["registration-input"]}
          />
        </label>
        <br />
        <button type="button" onClick={submitRegistration} className={styles["registration-button"]}>
          Registrovať sa
        </button>
      </form>
    </div>
  );
};

export default Register;
