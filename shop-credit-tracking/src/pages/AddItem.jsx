// checked-1
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { saveItems, loadItems } from "../utils/storage";
import "../styles/AddItem.css";

function AddItem() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const storedItems = loadItems();
    setItems(storedItems);
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      saveItems(items);
    }
  }, [items]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) {
      alert(t("enterItemDetails"));
      return;
    }
    const newItem = { name, price: parseFloat(price) };
    if (editId !== null) {
      setItems((prev) =>
        prev.map((item, i) => (i === editId ? newItem : item))
      );
      setEditId(null);
    } else {
      setItems((prev) => [...prev, newItem]);
    }
    setName("");
    setPrice("");
  };

  const handleEdit = (index) => {
    const item = items[index];
    setName(item.name);
    setPrice(item.price);
    setEditId(index);
  };

  const handleDelete = (index) => {
    if (window.confirm(t("confirmDeleteItem"))) {
      setItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="add-item">
      <h2>{editId !== null ? t("editItem") : t("addItem")}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t("itemName")}:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("enterItemName")}
          />
        </div>
        <div className="form-group">
          <label>{t("price")}:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={t("enterPrice")}
            min="0"
          />
        </div>
        <button type="submit">
          {editId !== null ? t("updateItem") : t("addItem")}
        </button>
      </form>
      <h3>{t("itemList")}</h3>
      {items.length === 0 ? (
        <p>{t("noItems")}</p>
      ) : (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.name}: ₹{item.price.toFixed(2)}
              <button onClick={() => handleEdit(index)}>{t("edit")}</button>
              <button onClick={() => handleDelete(index)}>{t("delete")}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AddItem;