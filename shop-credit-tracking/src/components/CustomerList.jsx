// checked
import React, { useState } from "react";

function CustomerList({ customers, onEdit, onDelete, language, darkMode }) {
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  const toggleExpand = (id) => {
    setExpandedCustomer(expandedCustomer === id ? null : id);
  };

  return (
    <div className={`contacts-section ${darkMode ? "dark" : ""}`}>
      {customers.length === 0 ? (
        <p>{language === "en" ? "No customers yet" : "இன்னும் வாடிக்கையாளர்கள் இல்லை"}</p>
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
                    color: (customer.balance || 0) > 0 ? "red" : "green",
                  }}
                >
                  {language === "en" ? "Balance" : "இருப்பு"}: ₹{(customer.balance || 0).toFixed(2)}
                </span>
              </div>
              {expandedCustomer === customer.id && (
                <div className="customer-details">
                  <p>{language === "en" ? "Email" : "மின்னஞ்சல்"}: {customer.email || "N/A"}</p>
                  <p>{language === "en" ? "Phone" : "தொலைபேசி"}: {customer.phone || "N/A"}</p>
                  <p>{language === "en" ? "Address" : "முகவரி"}: {customer.address || "N/A"}</p>
                  <p>{language === "en" ? "Aadhar" : "ஆதார்"}: {customer.aadhar || "N/A"}</p>
                  <p>{language === "en" ? "Advance" : "முன்பணம்"}: ₹{(customer.advance || 0).toFixed(2)}</p>
                  <p>
                    {language === "en" ? "Notifications" : "அறிவிப்புகள்"}: {customer.smsEnabled ? (language === "en" ? "Yes" : "ஆம்") : (language === "en" ? "No" : "இல்லை")}
                  </p>
                  {(customer.history || []).length > 0 ? (
                    <div>
                      <strong>{language === "en" ? "Recent Transactions" : "சமீபத்திய பரிவர்த்தனைகள்"}:</strong>
                      <ul>
                        {(customer.history || []).map((entry, index) => (
                          <li
                            key={index}
                            style={{
                              color: entry.type === "credit" ? "red" : "green",
                            }}
                          >
                            {entry.type === "credit"
                              ? language === "en"
                                ? "Credit"
                                : "கடன்"
                              : language === "en"
                              ? "Payment"
                              : "கட்டணம்"}
                            : ₹{entry.amount.toFixed(2)} - {entry.date}{" "}
                            {entry.items?.join(", ") || ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>{language === "en" ? "No transactions" : "பரிவர்த்தனைகள் இல்லை"}</p>
                  )}
                  <div className="btn-group">
                    <button onClick={() => onEdit(customer.id)} className="edit-btn">
                      {language === "en" ? "Edit" : "திருத்து"}
                    </button>
                    <button
                      onClick={() => onDelete(customer.id)}
                      className="delete-btn"
                    >
                      {language === "en" ? "Delete" : "நீக்கு"}
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

export default CustomerList;