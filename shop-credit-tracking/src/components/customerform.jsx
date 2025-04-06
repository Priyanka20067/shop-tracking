import { useEffect, useState } from "react";
// import "./Customer.css";

const CustomerForm = () => {
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [contacts, setContacts] = useState([]);
  const [editId, setEditId] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const storedContacts = JSON.parse(localStorage.getItem("contacts")) || [];
    setContacts(storedContacts);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId !== null) {
      setContacts((prev) =>
        prev.map((c) => (c.id === editId ? { ...customer, id: editId } : c))
      );
      setEditId(null);
    } else {
      setContacts((prev) => [...prev, { ...customer, id: Date.now() }]);
    }

    setCustomer({ name: "", email: "", phone: "", address: "" });
  };

  const handleEdit = (id) => {
    const contactToEdit = contacts.find((c) => c.id === id);
    setCustomer(contactToEdit);
    setEditId(id);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contact?"
    );
    if (confirmDelete) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleClearAll = () => {
    const confirmClear = window.confirm("Clear all contacts?");
    if (confirmClear) {
      setContacts([]);
    }
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
        <h2>Contact List</h2>
        {contacts.length === 0 ? (
          <p>No contacts yet</p>
        ) : (
          <>
            <button onClick={handleClearAll} className="clear-btn">
              Clear All
            </button>
            <ul className="contact-list">
              {contacts.map((contact) => (
                <li key={contact.id} className="contact-item">
                  <strong>{contact.name}</strong>
                  <p>Email: {contact.email}</p>
                  <p>Phone: {contact.phone}</p>
                  <p>Address: {contact.address}</p>
                  <div className="btn-group">
                    <button
                      onClick={() => handleEdit(contact.id)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
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
