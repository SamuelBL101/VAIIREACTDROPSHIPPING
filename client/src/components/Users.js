import React, { useEffect, useState } from "react";
import { useAuth } from "react-auth-verification-context";
import Axios from "axios";
import "../css/AdminUsersPage.css";
const AdminUsersPage = () => {
  const { isAuthenticated, attributes } = useAuth();
  const isAdmin = isAuthenticated && attributes.role === 1;

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      // Fetch users data from the server
      Axios.get("http://localhost:3001/api/getUsers")
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
  }, [isAdmin]);

  const handleDeleteUser = (userId) => {
    Axios.delete(`http://localhost:3001/api/deleteUser/${userId}`)
      .then((response) => {
        console.log(response.data.message);
        // Update the state to reflect the deleted user
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.user_id !== userId)
        );
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        // Handle error or show a user-friendly message
      });
  };

  const handleChangeRole = (userId) => {
    // You can implement logic to change the user's role
    // For example, make a request to the server to update the user's role
    console.log(`Change role for user ${userId}`);
  };

  return isAdmin ? (
    <div className="admin-users-page">
      <h2>Admin- Zoznam Použivateľov</h2>
      <div className="user-table">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Email</th>
              <th>Prihlasovacie meno</th>
              <th>Akcia</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteUser(user.user_id)}
                  >
                    Odstrániť
                  </button>
                  <button
                    className="btn btn-info"
                    onClick={() => handleChangeRole(user.user_id)}
                  >
                    Zmeniť rolu
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div>You do not have permission to view this page.</div>
  );
};

export default AdminUsersPage;
