import React, { useState } from 'react';
import { useAuth } from 'react-auth-verification-context';
import Axios from "axios";

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUsername, setCurrentUsername] = useState('Current Username');
  const [currentEmail, setCurrentEmail] = useState('Current Email');
  const { isAuthenticated, attributes } = useAuth(); // Use useAuth hook to get user information


  const handleNameChange = (e) => {
    Axios.post(
        'http://localhost:3001/api/updateUsername',
        {
            user_id: attributes.id,
            username: name,
        },
        )
        .then((response) => {
            console.log(response.data.message); // Handle success
            setCurrentUsername(name);
        })
        .catch((error) => {
            console.error('Error updating username:', error); // Handle error
        });

  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(name.length > 0){
        handleNameChange();
    }
    if(email.length > 0){
        handleEmailChange();
    }
    if(password.length > 0){
        handlePasswordChange();
    }
    
  };

  return (
    <div>
      <h1>Profile Settings</h1>
      <p>Username: {attributes.username}</p>
      <p>Email: {attributes.email}</p>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name}  />
        </label>
        <br />
        <label>
          Email:
          <input type="email" value={email}  />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password}  />
        </label>
        <br />
        <button type="submit" onClick={handleSubmit}>Save</button>
      </form>
    </div>
  );
};

export default Profile;