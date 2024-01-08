import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "react-auth-verification-context";

const AdminOrdersPage = () => {
  // State for filters
  const [statusFilter, setStatusFilter] = useState("All"); // Initial filter: All
  const [priceFilter, setPriceFilter] = useState(0); // New state for price filter
  const [orders, setOrders] = useState([]); // Initial orders: empty array
  const [filteredOrders, setFilteredOrders] = useState([]); // New state for filtered orders

  useEffect(() => {
    Axios.get("http://localhost:3001/api/getOrders")
      .then((response) => {
        setOrders(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  const handleFilterChange = (event) => {
    if (event.target.name === "status") {
      setStatusFilter(event.target.value);
    } else if (event.target.name === "price") {
      setPriceFilter(event.target.value);
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

  return (
    <div>
      {/* Filters */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <select onChange={handleFilterChange} value={statusFilter}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          {/* Add more status options as needed */}
        </select>
        <input
          type="number"
          name="price"
          placeholder="Enter minimum price"
          value={priceFilter}
          onChange={handleFilterChange}
        />
        <button onClick={handleApplyFilters}>Apply Filters</button>

        {/* Add more filters as needed */}
      </div>

      {/* Orders */}
      <div>
        {/* Table header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div>Order ID</div>
          <div>User ID</div>
          <div>Order Date</div>
          <div>Total Cost</div>
          <div>Actions</div>
        </div>

        {/* Table rows */}
        {filteredOrders.map((order) => (
          <div
            key={order.order_id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div style={{ minWidth: "30px" }}>{order.order_id}</div>
            <div style={{ minWidth: "30px" }}>{order.user_id}</div>
            <div style={{ minWidth: "30px" }}>
              {new Date(order.orderdate).toLocaleDateString()}
            </div>
            <div style={{ minWidth: "30px" }}>{order.total_cost}</div>
            <div>
              {/* Buttons for actions */}
              <button onClick={() => handleConfirm(order.order_id)}>
                Confirm
              </button>
              <button onClick={() => handleUpdate(order.order_id)}>
                Update
              </button>
              <button onClick={() => handleDelete(order.order_id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
