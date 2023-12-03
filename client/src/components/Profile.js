import React, { useState, useEffect } from 'react';
import { useAuth } from 'react-auth-verification-context';
import Axios from 'axios';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUsername, setCurrentUsername] = useState('Current Username');
  const [currentEmail, setCurrentEmail] = useState('Current Email');
  const { isAuthenticated, attributes } = useAuth();

  useEffect(() => {
    // Set initial values for name and email
    setCurrentUsername(attributes.username);
    setCurrentEmail(attributes.email);
  }, [attributes]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if any field has changed
    if (name !== attributes.username) {
      Axios.post(
        'http://localhost:3001/api/updateUsername',
        {
          user_id: attributes.id,
          username: name,
        }
      )
        .then((response) => {
          console.log(response.data.message);
          setCurrentUsername(name);
        })
        .catch((error) => {
          console.error('Error updating username:', error);
        });
    }

    if (email !== attributes.email) {
      // Handle email change
      Axios.post(
        'http://localhost:3001/api/updateEmail',
        {
          user_id: attributes.id,
          email,
        }
      )
        .then((response) => {
          console.log(response.data.message);
          setCurrentEmail(email);
        })
        .catch((error) => {
          console.error('Error updating email:', error);
        });
    }

    if (password.length > 0) {
      // Handle password change
      Axios.post(
        'http://localhost:3001/api/updatePassword',
        {
          user_id: attributes.id,
          password,
        }
      )
        .then((response) => {
          console.log(response.data.message);
        })
        .catch((error) => {
          console.error('Error updating password:', error);
        });
    }
  };

  return (
    <div>
      <h1>Profile Settings</h1>
      <p>Username: {currentUsername}</p>
      <p>Email: {currentEmail}</p>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" value={email} onChange={handleEmailChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <br />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Profile;