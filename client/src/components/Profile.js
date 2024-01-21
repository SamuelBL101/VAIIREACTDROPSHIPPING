import React, { useState, useEffect } from "react";
import { useAuth } from "react-auth-verification-context";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/profile.css"; // Import your CSS file

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUsername, setCurrentUsername] = useState("Current Username");
  const [currentEmail, setCurrentEmail] = useState("Current Email");
  const { isAuthenticated, attributes, logout } = useAuth();
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state variable
  const [profilePicture, setProfilePicture] = useState(null); // New state variable
  const [file, setFile] = useState(null); // New state variable

  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUsername(attributes.username);
    setCurrentEmail(attributes.email);
    Axios.get(`http://localhost:3001/api/getProfileImage/${attributes.id}`, {
      responseType: "arraybuffer",
    })
      .then((response) => {
        if (response.data) {
          const base64Image = arrayBufferToBase64(response.data);
          console.log("Profile image:", response.data);
          setProfilePicture(`data:image/jpeg;base64,${base64Image}`);
        }
      })
      .catch((error) => {
        console.error("Error getting profile image:", error);
      });
  }, [attributes]);

  function arrayBufferToBase64(buffer) {
    if (!buffer) return null;

    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  const deleteAccount = () => {
    Axios.post("http://localhost:3001/api/deleteAccount", {
      user_id: attributes.id,
    })
      .then((response) => {
        console.log(response.data.message);
        alert("Account deleted successfully!");
        logout();
        navigate("/");
      })
      .catch((error) => {
        console.error("Error deleting account:", error);
      });
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  const handleUpload = (e) => {
    e.preventDefault();
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", attributes.id); // Add this line to include user_id

    Axios.post("http://localhost:3001/api/updateProfileImage", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        user_id: attributes.id, // Replace with the actual user_id
      },
    })
      .then((response) => {
        console.log("Image uploaded successfully:", response.data);
        Axios.get(
          `http://localhost:3001/api/getProfileImage/${attributes.id}`,
          {
            responseType: "arraybuffer",
          }
        )
          .then((response) => {
            if (response.data) {
              const base64Image = arrayBufferToBase64(response.data);
              console.log("Profile image:", response.data);
              setProfilePicture(`data:image/jpeg;base64,${base64Image}`);
            }
          })
          .catch((error) => {
            console.error("Error getting profile image:", error);
          });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        // Handle error
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if any field has changed
    if (name !== attributes.username && name.length >= 6) {
      Axios.post("http://localhost:3001/api/updateUsername", {
        user_id: attributes.id,
        username: name,
      })
        .then((response) => {
          console.log(response.data.message);
          setCurrentUsername(name);
        })
        .catch((error) => {
          console.error("Error updating username:", error);
        });
    }

    if (email !== attributes.email && emailRegex.test(email)) {
      // Handle email change
      Axios.post("http://localhost:3001/api/updateEmail", {
        user_id: attributes.id,
        email,
      })
        .then((response) => {
          console.log(response.data.message);
          setCurrentEmail(email);
        })
        .catch((error) => {
          console.error("Error updating email:", error);
        });
    }

    if (password !== attributes.password) {
      if (password !== "") {
        if (!passwordRegex.test(password)) {
          setPasswordError("Heslo musí obsahovať aspoň 6 znakov a číslo.");
        } else {
          // Handle password change
          Axios.post("http://localhost:3001/api/updatePassword", {
            user_id: attributes.id,
            password,
          })
            .then((response) => {
              console.log(response.data.message);
              setSuccessMessage("Heslo bolo úspešne zmenené.");
            })
            .catch((error) => {
              console.error("Error updating password:", error);
            });
        }
      } else {
        setPasswordError("Heslo musí obsahovať aspoň 6 znakov a číslo.");
      }
    }
  };

  return (
    <div className="profile-container">
      <h1>Nastavenia Profilu</h1>
      <p>Používateľské meno: {currentUsername}</p>
      <p>Email: {currentEmail}</p>
      {profilePicture && (
        <img src={profilePicture} alt="Profile" className="profile-img" />
      )}
      <form onSubmit={handleSubmit} className="profile-form">
        <label>
          Používateľské meno:
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Zadajte používateľské meno"
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Zadajte e-mailovú adresu"
          />
        </label>
        <br />
        <label>
          Heslo:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Zadajte heslo"
          />
        </label>
        <br />
        <label>
          Profilový obrázok:
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        <br />
        <button onClick={handleUpload}>Zmenit profilovu fotku</button>

        {passwordError && <p className="error-message">{passwordError}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit">Uložit</button>
      </form>
      <button type="button" onClick={deleteAccount} className="delete-button">
        Odstrániť účet
      </button>
    </div>
  );
};

export default Profile;
