import React, { useState, useEffect } from "react";
import Axios from "axios";
import styles from "../css/reg.module.css";
import { useAuth } from "react-auth-verification-context";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";

const Register = () => {
  const { isAuthenticated, attributes } = useAuth();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    console.log("Is Authenticated:", isAuthenticated);
    console.log("User Information:", attributes);
  }, [isAuthenticated, attributes]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordMeetsCriteria, setPasswordMeetsCriteria] = useState(true);
  const [validEmailFormat, setValidEmailFormat] = useState(true);
  const [validUsername, setValidUsername] = useState(true);

  const submitRegistration = () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim()) {
      setValidUsername(false);
      return;
    }
    if (!emailRegex.test(email)) {
      // Email is not in a valid format
      setValidEmailFormat(false);
      return;
    }
    if (!passwordRegex.test(password)) {
      // Password does not meet the criteria
      setPasswordMeetsCriteria(false);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    setValidUsername(true);
    setValidEmailFormat(true);
    setPasswordsMatch(true);
    setPasswordMeetsCriteria(true);

    Axios.post("http://localhost:3001/api/insertUser", {
      username,
      email,
      password,
    })
      .then((response) => {
        alert(response.data.message);

        Axios.post("http://localhost:3001/api/login", {
          username: username,
          password: password,
        })
          .then((response) => {
            if (response.data.auth) {
              const user = response.data.user;
              console.log(user);
              // Corrected login function call
              login({
                username: user.username,
                email: user.email,
                id: user.user_id,
                role: user.role,
              });
            }

            // Navigate to /profile
            navigate("/profile");
          })
          .catch((error) => {
            alert(error.response.data.message);
          });
      })
      .catch((error) => {
        alert(
          error.response?.data?.message ||
            "An error occurred during registration"
        ); // Updated to check for response property
      });
  };

  return (
    <div className={styles.registration}>
      <h2 className={styles["registration-h2"]}>Registration</h2>
      <form className={styles["registration-form"]}>
        <label className={styles["registration-label"]}>
          Užívateľské meno:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles["registration-input"]}
          />
          {!validUsername && (
            <p className={styles["registration-error"]}>Enter a username.</p>
          )}
        </label>
        <label className={styles["registration-label"]}>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles["registration-input"]}
          />
          {!validEmailFormat && (
            <p className={styles["registration-error"]}>
              Please enter a valid email.
            </p>
          )}
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
          {!passwordsMatch && (
            <p className={styles["registration-error"]}>
              Heslá sa nezhodujú. Zadajte rovnaké heslá.
            </p>
          )}
          {!passwordMeetsCriteria && (
            <p className={styles["registration-error"]}>
              Heslo nespĺňa kritériá. Zadajte heslo, ktoré má aspoň 6 znakov a
              obsahuje aspoň jedno číslo.
            </p>
          )}
        </label>
        <button
          type="button"
          onClick={submitRegistration}
          className={styles["registration-button"]}
        >
          Registrovať sa
        </button>
      </form>
      <p>
        Už máte účet?<Link to="/Login">Prihlásiť sa</Link>.
      </p>
    </div>
  );
};

export default Register;
