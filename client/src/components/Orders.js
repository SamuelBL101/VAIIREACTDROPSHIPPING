import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "react-auth-verification-context";
import "../css/AdminOrdersPage.css";
const AdminOrdersPage = () => {
  const { isAuthenticated, attributes } = useAuth(); // Assuming useAuth provides user information
  const isAdmin = isAuthenticated && attributes.role === 1; // Assuming role 1 is for admin

  // State for filters
  const [statusFilter, setStatusFilter] = useState("All"); // Initial filter: All
  const [priceFilter, setPriceFilter] = useState(0); // New state for price filter
  const [orders, setOrders] = useState([]); // Initial orders: empty array
  const [filteredOrders, setFilteredOrders] = useState([]); // New state for filtered orders
  const [sortOption, setSortOption] = useState(""); // New state for sorting option
  const [sortDirection, setSortDirection] = useState("asc"); // New state for sorting direction

  useEffect(() => {
    if (!isAdmin) {
      return;
    }
    Axios.get("http://localhost:3001/api/getOrders")
      .then((response) => {
        setOrders(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  const handleSortChange = (option) => {
    // Toggle the sort direction if the same option is selected
    if (sortOption === option) {
      setSortDirection((prevDirection) =>
        prevDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortOption(option);
      setSortDirection("asc"); // Default to ascending order when a new option is selected
    }

    // Apply sorting immediately when the user selects a sorting option
    const sortedOrders = [...filteredOrders].sort(sortOrders);
    setFilteredOrders(sortedOrders);
  };

  const sortOrders = (a, b) => {
    const multiplier = sortDirection === "asc" ? 1 : -1;

    if (sortOption === "price") {
      return multiplier * (parseFloat(a.total_cost) - parseFloat(b.total_cost));
    } else if (sortOption === "number") {
      return multiplier * (a.order_id - b.order_id);
    } else if (sortOption === "date") {
      const dateA = new Date(a.orderdate);
      const dateB = new Date(b.orderdate);
      return multiplier * (dateA - dateB);
    }

    return 0; // Default: no sorting
  };

  const handleFilterChange = (event) => {
    if (isAdmin) {
      if (event.target.name === "status") {
        setStatusFilter(event.target.value);
      } else if (event.target.name === "price") {
        setPriceFilter(event.target.value);
      }
    }
  };

  // Handlers for actions
  const handleConfirm = (id) => {
    console.log(`Confirm order ${id}`);
  };

  const handleUpdate = (id) => {
    console.log(`Update order ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete order ${id}`);
    Axios.delete(`http://localhost:3001/api/deleteOrder/${id}`)
      .then((response) => {
        console.log(response.data.message);
        alert("Order deleted successfully!");
        // Update the state to reflect the deleted order
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.order_id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting order:", error);
        // Handle error or show a user-friendly message
      });
  };

  // Filter orders based on status
  const handleApplyFilters = () => {
    // Filter orders based on status and price
    const updatedFilteredOrders = orders.filter((order) => {
      const statusCondition =
        statusFilter === "All" || order.status === statusFilter;
      const priceCondition =
        priceFilter === "" ||
        parseFloat(order.total_cost) >= parseFloat(priceFilter);

      return statusCondition && priceCondition;
    });

    // Set the filtered orders to state
    setFilteredOrders(updatedFilteredOrders);
  };

  return isAdmin ? (
    // Admin view
    <div className="admin-container">
      {/* Filters */}
      <div className="filters-container">
        <select
          className="filter-select"
          onChange={handleFilterChange}
          value={statusFilter}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          {/* Add more status options as needed */}
        </select>
        <label htmlFor="price">Minimálna cena:</label>
        <input
          className="filter-input"
          type="number"
          name="price"
          placeholder="Enter minimum price"
          value={priceFilter}
          onChange={handleFilterChange}
        />
        <button className="filter-button" onClick={handleApplyFilters}>
          Aplikovať Filter
        </button>

        {/* Add more filters as needed */}
      </div>
      <div className="sort-buttons-container">
        {/* Buttons for sorting */}

        <button
          className="sort-button"
          onClick={() => handleSortChange("number")}
        >
          Zoradiť podľa čísla objednávky
        </button>
        <button
          className="sort-button"
          onClick={() => handleSortChange("date")}
        >
          Zoradiť podľa dátumu objednávky
        </button>
        <button
          className="sort-button"
          onClick={() => handleSortChange("price")}
        >
          Zoradiť podľa ceny{" "}
        </button>
      </div>

      {/* Orders */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID objednávky</th>
              <th>ID používateľa</th>
              <th>Dátum objednávky</th>
              <th>Cena</th>
              <th>Možnosti</th>
            </tr>
          </thead>
          {/* Table rows */}
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.order_id} className="table-row">
                <td>{order.order_id}</td>
                <td>{order.user_id}</td>
                <td>{new Date(order.orderdate).toLocaleDateString()}</td>
                <td className="priceItem">{order.total_cost}</td>
                <td className="action-buttons-container">
                  {/* Buttons for actions */}
                  <button
                    className="confirm-button"
                    onClick={() => handleConfirm(order.order_id)}
                  >
                    Potvrdiť
                  </button>
                  <button
                    className="update-button"
                    onClick={() => handleUpdate(order.order_id)}
                  >
                    Aktualizovať
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(order.order_id)}
                  >
                    Odstaniť
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    // Unauthorized view
    <div>Nemáte oprávnenie na zobrazenie tejto stránky.</div>
  );
};

export default AdminOrdersPage;
