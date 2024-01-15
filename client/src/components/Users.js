import React, { useEffect, useState } from "react";
import { useAuth } from "react-auth-verification-context";
import Axios from "axios";

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
    <div>
      <h2>Admin Users Page</h2>
      <div>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>
                  <button onClick={() => handleDeleteUser(user.user_id)}>
                    Delete
                  </button>
                  <button onClick={() => handleChangeRole(user.user_id)}>
                    Change Role
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
