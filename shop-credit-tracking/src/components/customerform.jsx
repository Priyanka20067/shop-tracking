import { useEffect, useState } from "react";
import './form.css';

const CustomerForm = () => {
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    history: [],
  });
  const [customers, setCustomers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const storedCustomers = JSON.parse(localStorage.getItem("customers")) || [];
      console.log("CustomerForm: Loaded customers", storedCustomers); // Debug
      setCustomers(storedCustomers);
    } catch (error) {
      console.error("CustomerForm: Error loading customers", error);
      setCustomers([]);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (customers.length > 0) {
      try {
        console.log("CustomerForm: Saving customers", customers); // Debug
        localStorage.setItem("customers", JSON.stringify(customers));
      } catch (error) {
        console.error("CustomerForm: Error saving customers", error);
      }
    }
  }, [customers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customer.name || !customer.email || !customer.phone || !customer.address) {
      alert("Please fill all required fields!");
      return;
    }

    if (editId !== null) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editId
            ? { ...customer, id: editId, history: c.history || [] }
            : c
        )
      );
      setEditId(null);
    } else {
      setCustomers((prev) => [
        ...prev,
        { ...customer, id: Date.now(), history: customer.history || [] },
      ]);
    }

    setCustomer({ name: "", email: "", phone: "", address: "", history: [] });
  };

  const handleEdit = (id) => {
    const customerToEdit = customers.find((c) => c.id === id);
    if (customerToEdit) {
      setCustomer({ ...customerToEdit, history: customerToEdit.history || [] });
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
    if (confirmDelete) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleClearAll = () => {
    const confirmClear = window.confirm("Clear all customers?");
    if (confirmClear) {
      setCustomers([]);
      localStorage.setItem("customers", JSON.stringify([]));
    }
  };

  const toggleExpand = (id) => {
    setExpandedCustomer(expandedCustomer === id ? null : id);
  };

  return (
    <div className="customer-page-container">
      <div className="form-section">
        <h2>{editId ? "Edit Customer" : "Add New Customer"}</h2>
        <form onSubmit={handleSubmit} className="customer-form">
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={customer.name}
              onChange={handleChange}
              required
              placeholder="Enter customer name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={customer.email}
              onChange={handleChange}
              required
              placeholder="Enter customer email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={customer.phone}
              onChange={handleChange}
              required
              placeholder="Enter phone number"
              maxLength={10}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <textarea
              id="address"
              name="address"
              value={customer.address}
              onChange={handleChange}
              required
              placeholder="Enter customer address"
            />
          </div>
          <button type="submit" className="submit-btn">
            {editId ? "Update Customer" : "Add Customer"}
          </button>
        </form>
      </div>

      <div className="contacts-section">
        <h2>Customer List</h2>
        {customers.length === 0 ? (
          <p>No customers yet</p>
        ) : (
          <>
            <button onClick={handleClearAll} className="clear-btn">
              Clear All
            </button>
            <ul className="contact-list">
              {customers.map((customer) => (
                <li key={customer.id} className="contact-item">
                  <div className="customer-header">
                    <button
                      onClick={() => toggleExpand(customer.id)}
                      style={{ marginRight: "10px", background: "none", border: "none", cursor: "pointer" }}
                    >
                      {expandedCustomer === customer.id ? "▼" : "▶"}
                    </button>
                    <strong>{customer.name}</strong>
                    <span style={{ marginLeft: "10px", color: (customer.history || []).reduce((sum, e) => (e.type === "credit" ? sum + e.amount : sum - e.amount), 0) > 0 ? "red" : "green" }}>
                      Balance: ₹{(customer.history || []).reduce((sum, e) => (e.type === "credit" ? sum + e.amount : sum - e.amount), 0).toFixed(2)}
                    </span>
                  </div>
                  {expandedCustomer === customer.id && (
                    <div className="customer-details">
                      <p>Email: {customer.email || "N/A"}</p>
                      <p>Phone: {customer.phone}</p>
                      <p>Address: {customer.address || "N/A"}</p>
                      {customer.history && customer.history.length > 0 ? (
                        <div>
                          <strong>History:</strong>
                          <ul>
                            {customer.history.map((entry, index) => (
                              <li
                                key={index}
                                style={{
                                  color: entry.type === "credit" ? "red" : "green",
                                }}
                              >
                                {entry.type === "credit" ? "Credit" : "Payment"}: ₹
                                {entry.amount.toFixed(2)} - {entry.date}{" "}
                                {entry.items?.join(", ") || ""}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p>No history available</p>
                      )}
                      <div className="btn-group">
                        <button
                          onClick={() => handleEdit(customer.id)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerForm;