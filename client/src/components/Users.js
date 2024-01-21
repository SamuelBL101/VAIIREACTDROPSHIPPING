import React, { useEffect, useState } from "react";
import { useAuth } from "react-auth-verification-context";
import Axios from "axios";
import "../css/AdminUsersPage.css";
/**
 * Renders the Admin Users Page component.
 * This component displays a table of users with their email, username, and actions.
 * Only authenticated users with the role of admin can view this page.
 *
 * @returns {JSX.Element} The rendered Admin Users Page component.
 */
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
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.user_id !== userId)
        );
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const handleChangeRole = (userId) => {
    console.log(`Change role for user ${userId}`);
    const newRole =
      users.find((user) => user.user_id === userId).role === 1 ? 0 : 1;

    Axios.post(`http://localhost:3001/api/changeRole/${userId}`, {
      role: newRole,
    })
      .then((response) => {
        console.log("User role updated successfully:", response.data);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === userId ? { ...user, role: newRole } : user
          )
        );
      })
      .catch((error) => {
        console.error("Error updating user role:", error);
      });
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
              <th>Rola</th>
              <th>Akcia</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
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
    <div>Nemáte povolenie na zobrazenie tejto stránky.</div>
  );
};

export default AdminUsersPage;
