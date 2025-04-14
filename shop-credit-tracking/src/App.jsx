// checked-1
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./styles/App.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import menuImage from "./assets/menu.png";
import MainPage from "./pages/MainPage";
import CustomerForm from "./pages/CustomerForm";
import CustomerHistory from "./pages/CustomerHistory";
import Dashboard from "./pages/Dashboard";
import AddItem from "./pages/AddItem";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode", !darkMode);
  };
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className={`app ${darkMode ? "dark" : ""}`}>
        <header className="app-header">
          <div className="profile-container" onClick={toggleMenu}>
            <img src={menuImage} alt="Menu" className="profile-pic" />
            <div className={`menu ${menuOpen ? "open" : ""}`}>
              <Link to="/dashboard" title={t("dashboard")}>📊</Link>
              <Link to="/main" title={t("creditTracker")}>💸</Link>
              <Link to="/customerform" title={t("addCustomer")}>➕</Link>
              <Link to="/customerhistory" title={t("history")}>📜</Link>
              <Link to="/additem" title={t("addItem")}>🛒</Link>
              <Link to="/dashboard#backup" title={t("backup")}>☁️</Link>
            </div>
          </div>
          <h1 className="title">{t("appTitle")}</h1>
          <div className="controls">
            <button onClick={toggleDarkMode}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            <select onChange={(e) => changeLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/customerform" element={<CustomerForm />} />
          <Route path="/customerhistory" element={<CustomerHistory />} />
          <Route path="/additem" element={<AddItem />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </BrowserRouter>
  );
}

export default App;