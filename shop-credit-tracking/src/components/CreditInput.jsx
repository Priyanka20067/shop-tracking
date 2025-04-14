// checked-1
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { saveCustomers, loadCustomers, loadItems } from "../utils/storage";
import { sendSMS, sendWhatsApp } from "../utils/notifications";
import "../styles/CreditInput.css";

function CreditInput() {
  const [customers, setCustomers] = useState([]);
  const [itemsPreset, setItemsPreset] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [itemInput, setItemInput] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [totalCredit, setTotalCredit] = useState(0);
  const [showCreditDetails, setShowCreditDetails] = useState(false);
  const itemInputRef = useRef(null);
  const amountInputRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const storedCustomers = loadCustomers();
    const storedItems = loadItems();
    setCustomers(storedCustomers);
    setItemsPreset(storedItems);
    calculateTotalCredit(storedCustomers);
  }, []);

  useEffect(() => {
    if (customers.length > 0) {
      saveCustomers(customers);
      calculateTotalCredit(customers);
    }
  }, [customers]);

  const calculateTotalCredit = (custs) => {
    const total = custs.reduce(
      (sum, c) =>
        sum +
        (c.history || []).reduce(
          (s, h) => (h.type === "credit" ? s + h.amount : s - h.amount),
          0
        ),
      0
    );
    setTotalCredit(total);
  };

  const getCustomerBalance = (customer) =>
    (customer.history || []).reduce(
      (sum, h) => (h.type === "credit" ? sum + h.amount : sum - h.amount),
      0
    );

  const handleNameInput = (e) => {
    const value = e.target.value;
    setNameInput(value);
    if (value) {
      const filtered = customers
        .filter((c) => c.name.toLowerCase().includes(value.toLowerCase()))
        .sort((a, b) => (b.history?.length || 0) - (a.history?.length || 0));
      setFilteredCustomers(filtered.slice(0, 5));
    } else {
      setFilteredCustomers([]);
    }
  };

  const selectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setNameInput(customer.name);
    setFilteredCustomers([]);
    itemInputRef.current.focus();
  };

  const handleItemInput = (e) => {
    const value = e.target.value;
    setItemInput(value);
    if (value) {
      const filtered = itemsPreset.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered.slice(0, 5));
    } else {
      setFilteredItems([]);
    }
  };

  const selectItem = (item) => {
    setCurrentItems((prev) => [
      ...prev,
      {
        name: item.name,
        quantity: parseInt(quantity),
        price: item.price,
        total: item.price * parseInt(quantity),
      },
    ]);
    setItemInput("");
    setQuantity(1);
    setFilteredItems([]);
    itemInputRef.current.focus();
  };

  const addItem = (e) => {
    if (e.key !== "Enter") return;

    if (itemInput && !amount) {
      // New item: move to amount
      if (!itemsPreset.some((i) => i.name.toLowerCase() === itemInput.toLowerCase())) {
        amountInputRef.current.focus();
      }
    } else if (itemInput && amount) {
      // Add item + amount
      setCurrentItems((prev) => [
        ...prev,
        {
          name: itemInput,
          quantity: parseInt(quantity),
          price: parseFloat(amount),
          total: parseFloat(amount) * parseInt(quantity),
        },
      ]);
      setItemsPreset((prev) => [
        ...prev,
        { name: itemInput, price: parseFloat(amount) },
      ]);
      setItemInput("");
      setAmount("");
      setQuantity(1);
      itemInputRef.current.focus();
    }
  };

  const saveCredit = () => {
    if (!nameInput || !currentItems.length) {
      alert(t("selectCustomerAndItems"));
      return;
    }

    let customer = selectedCustomer;
    if (!customer) {
      if (!window.confirm(t("createNewCustomer", { name: nameInput }))) return;
      customer = {
        id: Date.now(),
        name: nameInput,
        phone: "",
        email: "",
        address: "",
        history: [],
        smsEnabled: true,
        advance: 0,
        aadhar: "",
      };
      setCustomers((prev) => [...prev, customer]);
    }

    const totalAmount = currentItems.reduce((sum, i) => sum + i.total, 0) * (1 - discount / 100);
    const creditEntry = {
      type: "credit",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      items: currentItems.map((i) => `${i.quantity}x ${i.name}`),
      amount: totalAmount,
    };

    const updatedCustomers = customers.map((c) =>
      c.id === customer.id ? { ...c, history: [...c.history, creditEntry] } : c
    );
    setCustomers(updatedCustomers);

    if (customer.phone && customer.smsEnabled) {
      sendSMS(
        customer.phone,
        t("purchaseSMS", {
          name: customer.name,
          items: creditEntry.items.join(", "),
          amount: creditEntry.amount.toFixed(2),
          date: creditEntry.date,
        })
      );
      sendWhatsApp(
        customer.phone,
        t("purchaseWhatsApp", {
          name: customer.name,
          items: creditEntry.items.join(", "),
          amount: creditEntry.amount.toFixed(2),
          date: creditEntry.date,
        })
      );
    } else if (!customer.phone) {
      alert(t("addPhoneForNotifications"));
      navigate("/customerform");
    }

    setCurrentItems([]);
    setNameInput("");
    setSelectedCustomer(null);
    setDiscount(0);
    itemInputRef.current.focus();
  };

  const addPayment = () => {
    if (!selectedCustomer) {
      alert(t("selectCustomer"));
      return;
    }
    const value = parseFloat(prompt(t("enterPaymentAmount")));
    if (!value || isNaN(value) || value <= 0) {
      alert(t("invalidAmount"));
      return;
    }

    const paymentEntry = {
      type: "payment",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      amount: value,
    };

    const updatedCustomers = customers.map((c) =>
      c.id === selectedCustomer.id
        ? { ...c, history: [...c.history, paymentEntry] }
        : c
    );
    setCustomers(updatedCustomers);

    if (selectedCustomer.phone && selectedCustomer.smsEnabled) {
      sendSMS(
        selectedCustomer.phone,
        t("paymentSMS", {
          name: selectedCustomer.name,
          amount: value.toFixed(2),
          date: paymentEntry.date,
        })
      );
      sendWhatsApp(
        selectedCustomer.phone,
        t("paymentWhatsApp", {
          name: selectedCustomer.name,
          amount: value.toFixed(2),
          date: paymentEntry.date,
        })
      );
    }
  };

  return (
    <div className="credit-input">
      <div className="summary">
        <h3 onClick={() => setShowCreditDetails(true)}>
          {t("totalCredit")}: ₹{totalCredit.toFixed(2)}
        </h3>
        {showCreditDetails && (
          <div className="credit-details">
            <h4>{t("creditBreakdown")}</h4>
            <ul>
              {customers.map((c) => {
                const balance = getCustomerBalance(c);
                if (balance <= 0) return null;
                return (
                  <li key={c.id}>
                    {c.name}: ₹{balance.toFixed(2)}
                  </li>
                );
              })}
            </ul>
            <button onClick={() => setShowCreditDetails(false)}>{t("close")}</button>
          </div>
        )}
      </div>
      <div className="input-group">
        <div className="autocomplete">
          <input
            type="text"
            value={nameInput}
            onChange={handleNameInput}
            placeholder={t("customerName")}
          />
          {filteredCustomers.length > 0 && (
            <ul className="suggestions">
              {filteredCustomers.map((c) => (
                <li key={c.id} onClick={() => selectCustomer(c)}>
                  {c.name} ({c.phone || t("noPhone")})
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedCustomer && (
          <div className="customer-info">
            <p>
              {t("name")}: {selectedCustomer.name}
            </p>
            <p>
              {t("phone")}: {selectedCustomer.phone || t("na")}
            </p>
            <p>
              {t("address")}: {selectedCustomer.address || t("na")}
            </p>
            <p>
              {t("balance")}: ₹{getCustomerBalance(selectedCustomer).toFixed(2)}
            </p>
          </div>
        )}
        <div className="autocomplete">
          <input
            ref={itemInputRef}
            type="text"
            value={itemInput}
            onChange={handleItemInput}
            onKeyPress={addItem}
            placeholder={t("itemPlaceholder")}
          />
          {filteredItems.length > 0 && (
            <ul className="suggestions">
              {filteredItems.map((item) => (
                <li key={item.name} onClick={() => selectItem(item)}>
                  {item.name} (₹{item.price})
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          ref={amountInputRef}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyPress={addItem}
          placeholder={t("price")}
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder={t("quantity")}
          min="1"
        />
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          placeholder={t("discount")}
          max="100"
          min="0"
        />
        <button onClick={saveCredit}>{t("saveCredit")}</button>
        <button onClick={addPayment}>{t("addPayment")}</button>
      </div>
      {currentItems.length > 0 && (
        <div className="current-items">
          <h4>{t("currentItems")}</h4>
          <ul>
            {currentItems.map((item, index) => (
              <li key={index}>
                {item.quantity}x {item.name} @ ₹{item.price} = ₹{item.total}
              </li>
            ))}
          </ul>
          <p>
            {t("total")}: ₹
            {currentItems
              .reduce((sum, i) => sum + i.total, 0)
              .toFixed(2)}
            {discount > 0 &&
              ` (${t("afterDiscount", {
                discount,
                amount: (
                  currentItems.reduce((sum, i) => sum + i.total, 0) *
                  (1 - discount / 100)
                ).toFixed(2),
              })})`}
          </p>
        </div>
      )}
      <div className="navigation">
        <button onClick={() => navigate("/customerhistory")}>{t("history")}</button>
        <button onClick={() => navigate("/customerform")}>{t("addCustomer")}</button>
        <button onClick={() => navigate("/additem")}>{t("addItem")}</button>
      </div>
    </div>
  );
}

export default CreditInput;