import React, { useState, useEffect } from "react";
import Axios from "axios";
import "../css/login.css";
import { useAuth } from "react-auth-verification-context";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";

/**
 * Register component for user registration.
 *
 * @returns {JSX.Element} The Register component.
 */
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
      setValidEmailFormat(false);
      return;
    }
    if (!passwordRegex.test(password)) {
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
              login({
                username: user.username,
                email: user.email,
                id: user.user_id,
                role: user.role,
              });
            }

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
        );
      });
  };

  return (
    <div className={"mainContainer"}>
      <div className={"titleContainer"}>
        <div>Registrácia</div>
      </div>
      <form>
        <br />
        <label>
          Užívateľské meno:
          <div className={"inputContainer"}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="inputBox"
            />
            {!validUsername && (
              <p className={"errorLabel"}>Zadajte používateľské meno.</p>
            )}
          </div>
        </label>
        <br />
        <label>
          Email:
          <div className={"inputContainer"}>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="inputBox"
            />
            {!validEmailFormat && (
              <p className={"errorLabel"}>Prosím vložte platný email.</p>
            )}
          </div>
        </label>
        <br />
        <label>
          Heslo:
          <div className={"inputContainer"}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="inputBox"
            />
          </div>
        </label>
        <br />
        <label>
          Potvrdenie hesla:
          <br />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="inputBox"
          />
          {!passwordsMatch && <p>Heslá sa nezhodujú. Zadajte rovnaké heslá.</p>}
          {!passwordMeetsCriteria && (
            <p className={"errorLabel"}>
              Heslo nespĺňa kritériá. Zadajte heslo, ktoré má aspoň 6 znakov a
              obsahuje aspoň jedno číslo.
            </p>
          )}
        </label>
        <br />
        <button
          type="button"
          onClick={submitRegistration}
          className={"inputbutton"}
        >
          Registrovať sa
        </button>
      </form>
      <div className={"endContainer"}>
        Už máte účet?<Link to="/Login">Prihlásiť sa</Link>.
      </div>
    </div>
  );
};

export default Register;
