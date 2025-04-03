// src/components/CustomerForm.jsx
import { useState } from 'react';
import '../components/Customer.css';


const CustomerForm = () => {
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [contacts, setContacts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add new customer to contacts list
    setContacts(prev => [...prev, { ...customer, id: Date.now() }]);
    // Reset form
    setCustomer({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
    alert('Customer added successfully!');
  };

  return (
    <div className="customer-page-container">
      <div className="form-section">
        <h2>Add New Customer</h2>
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
            Add Customer
          </button>
        </form>
      </div>

      <div className="contacts-section">
        <h2>Contact List</h2>
        {contacts.length === 0 ? (
          <p>No contacts yet</p>
        ) : (
          <ul className="contact-list">
            {contacts.map(contact => (
              <li key={contact.id} className="contact-item">
                <strong>{contact.name}</strong>
                <p>Email: {contact.email}</p>
                <p>Phone: {contact.phone}</p>
                <p>Address: {contact.address}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomerForm;