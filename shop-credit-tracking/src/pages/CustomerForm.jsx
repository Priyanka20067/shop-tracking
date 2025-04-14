// checked-1
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { saveCustomers, loadCustomers } from "../utils/storage";
import { sendSMS, sendWhatsApp } from "../utils/notifications";
import "../styles/CustomerForm.css";

const CustomerForm = () => {
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    aadhar: "",
    smsEnabled: true,
    advance: 0,
    history: [],
  });
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const storedCustomers = loadCustomers();
    setCustomers(storedCustomers);
  }, []);

  useEffect(() => {
    if (customers.length > 0) {
      saveCustomers(customers);
    }
  }, [customers]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customer.name) {
      alert(t("nameRequired"));
      return;
    }

    if (customer.phone && !/^\d{10}$/.test(customer.phone)) {
      alert(t("phoneInvalid"));
      return;
    }

    if (customer.aadhar && !/^\d{12}$/.test(customer.aadhar)) {
      alert(t("aadharInvalid"));
      return;
    }

    if (editId !== null) {
      const updatedCustomers = customers.map((c) =>
        c.id === editId
          ? { ...customer, id: editId, history: c.history || [] }
          : c
      );
      setCustomers(updatedCustomers);
      if (customer.phone && customer.smsEnabled) {
        sendSMS(customer.phone, t("detailsUpdatedSMS", { name: customer.name }));
        sendWhatsApp(customer.phone, t("detailsUpdatedWhatsApp", { name: customer.name }));
      }
      setEditId(null);
    } else {
      const newCustomer = {
        ...customer,
        id: Date.now(),
        history: customer.history || [],
      };
      setCustomers((prev) => [...prev, newCustomer]);
      if (customer.phone && customer.smsEnabled) {
        sendSMS(customer.phone, t("welcomeSMS", { name: customer.name }));
        sendWhatsApp(customer.phone, t("welcomeWhatsApp", { name: customer.name }));
      }
    }

    setCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      aadhar: "",
      smsEnabled: true,
      advance: 0,
      history: [],
    });
  };

  const handleEdit = (id) => {
    const customerToEdit = customers.find((c) => c.id === id);
    if (customerToEdit) {
      setCustomer({ ...customerToEdit, history: customerToEdit.history || [] });
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(t("confirmDeleteCustomer"))) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const toggleExpand = (id) => {
    setExpandedCustomer(expandedCustomer === id ? null : id);
  };

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  return (
    <div className="customer-form-container">
      <div className="form-section">
        <h2>{editId ? t("editCustomer") : t("addCustomer")}</h2>
        <form onSubmit={handleSubmit} className="customer-form">
          <div className="form-group">
            <label htmlFor="name">{t("fullName")}:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={customer.name}
              onChange={handleChange}
              required
              placeholder={t("enterCustomerName")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">{t("phone")}:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={customer.phone}
              onChange={handleChange}
              placeholder={t("enterPhoneNumber")}
              maxLength={10}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">{t("email")}:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={customer.email}
              onChange={handleChange}
              placeholder={t("enterCustomerEmail")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">{t("address")}:</label>
            <textarea
              id="address"
              name="address"
              value={customer.address}
              onChange={handleChange}
              placeholder={t("enterCustomerAddress")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="aadhar">{t("aadharOptional")}:</label>
            <input
              type="text"
              id="aadhar"
              name="aadhar"
              value={customer.aadhar}
              onChange={handleChange}
              placeholder={t("enterAadhar")}
              maxLength={12}
            />
          </div>
          <div className="form-group">
            <label htmlFor="advance">{t("advanceDeposit")}:</label>
            <input
              type="number"
              id="advance"
              name="advance"
              value={customer.advance}
              onChange={handleChange}
              placeholder={t("enterAdvanceAmount")}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="smsEnabled"
                checked={customer.smsEnabled}
                onChange={handleChange}
              />
              {t("sendSMSNotifications")}
            </label>
          </div>
          <button type="submit" className="submit-btn">
            {editId ? t("updateCustomer") : t("addCustomer")}
          </button>
        </form>
      </div>
      <div className="contacts-section">
        <h2>{t("customerList")}</h2>
        <input
          type="text"
          placeholder={t("searchCustomers")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <CustomerList
          customers={filteredCustomers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          expandedCustomer={expandedCustomer}
          toggleExpand={toggleExpand}
        />
      </div>
    </div>
  );
};

function CustomerList({ customers, onEdit, onDelete, expandedCustomer, toggleExpand }) {
  const { t } = useTranslation();
  return (
    <div>
      {customers.length === 0 ? (
        <p>{t("noCustomers")}</p>
      ) : (
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
                <span
                  style={{
                    marginLeft: "10px",
                    color:
                      (customer.history || []).reduce(
                        (sum, e) => (e.type === "credit" ? sum + e.amount : sum - e.amount),
                        0
                      ) > 0
                        ? "red"
                        : "green",
                  }}
                >
                  {t("balance")}: ₹
                  {(customer.history || [])
                    .reduce(
                      (sum, e) => (e.type === "credit" ? sum + e.amount : sum - e.amount),
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              {expandedCustomer === customer.id && (
                <div className="customer-details">
                  <p>
                    {t("email")}: {customer.email || t("na")}
                  </p>
                  <p>
                    {t("phone")}: {customer.phone || t("na")}
                  </p>
                  <p>
                    {t("address")}: {customer.address || t("na")}
                  </p>
                  <p>
                    {t("aadhar")}: {customer.aadhar || t("na")}
                  </p>
                  <p>
                    {t("advance")}: ₹{(customer.advance || 0).toFixed(2)}
                  </p>
                  <p>
                    {t("smsEnabled")}: {customer.smsEnabled ? t("yes") : t("no")}
                  </p>
                  {(customer.history || []).length > 0 ? (
                    <div>
                      <strong>{t("last5Transactions")}:</strong>
                      <ul>
                        {(customer.history || [])
                          .slice(-5)
                          .map((entry, index) => (
                            <li
                              key={index}
                              style={{
                                color: entry.type === "credit" ? "red" : "green",
                              }}
                            >
                              {entry.type === "credit" ? t("credit") : t("payment")}: ₹
                              {entry.amount.toFixed(2)} - {entry.date}{" "}
                              {entry.items?.join(", ") || ""}
                            </li>
                          ))}
                      </ul>
                    </div>
                  ) : (
                    <p>{t("noHistory")}</p>
                  )}
                  <div className="btn-group">
                    <button onClick={() => onEdit(customer.id)} className="edit-btn">
                      {t("edit")}
                    </button>
                    <button
                      onClick={() => onDelete(customer.id)}
                      className="delete-btn"
                    >
                      {t("delete")}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomerForm;