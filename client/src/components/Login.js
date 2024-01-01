import React, { useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/log.module.css";
import "../css/login.css";
import { useAuth } from "react-auth-verification-context";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [validUsername, setValidUsername] = useState(true);

  const handleLogin = () => {
    Axios.post("http://localhost:3001/api/login", {
      username: username,
      password: password,
    })
      .then((response) => {
        if (response.data.auth) {
          const token = response.data.token;
          const user = response.data.user;

          localStorage.setItem("token", token);
          login({
            username: user.username,
            email: user.email,
            id: user.user_id,
            role: user.role,
          });
          navigate("/");
        } else {
          //alert("Invalid username or password");
          setValidUsername(false);
          return;
        }
      })
      .catch((error) => {
        //alert("Invalid username or password");
        console.error("Error during login:", error);
        setValidUsername(false);
        return;
      });
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className={"mainContainer"}>
      <div className={"titleContainer"}>
        <div>Prihlásenie</div>
      </div>
      <form>
        <br />
        <label>
          Užívateľské meno:
          <div className={"inputContainer"}>
            <input
              id="meno"
              type="text"
              value={username}
              placeholder="Zadajte užívateľské meno"
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              onKeyDown={handleKeyPress}
              className={"inputBox"}
            />
          </div>
        </label>
        <br />
        <label className={styles.labelHeslo}>
          Heslo:
          <div className={"inputContainer"}>
            <input
              id="heslo"
              type="password"
              value={password}
              placeholder="Zadajte heslo"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              onKeyDown={handleKeyPress}
              className={"inputBox"}
            />
          </div>
        </label>
        <br />
        {!validUsername && (
          <p className={styles["login-error"]}>
            Nesprávne zadané používateľské údaje
          </p>
        )}
        <button
          type="button"
          onClick={handleLogin}
          onKeyDown={handleKeyPress}
          className={"inputbutton"}
        >
          Prihlásiť sa
        </button>
      </form>

      <div className={"endContainer"}>
        Nemáte ešte účet? <Link to="/Register">Zaregistrujte sa tu</Link>.
      </div>
    </div>
  );
};

export default Login;
