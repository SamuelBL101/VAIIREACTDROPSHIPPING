import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Implementujte logiku pre prihlásenie
    console.log("Prihlásenie:", { username, password });
  };

  return (
    <div>
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