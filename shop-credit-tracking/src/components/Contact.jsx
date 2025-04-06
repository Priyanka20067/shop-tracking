import React, { useState } from "react";
import "./Constyle.css";
import myImage from './menu.png';
function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <header>
        <div className="profile-container" onClick={toggleMenu}>
          
          <img
            src={myImage}
            alt="Profile"
            className="profile-pic"
          />
          <div className={`menu ${menuOpen ? "open" : ""}`}>
            <a href="#dashboard" title="Dashboard">📊</a>
            <a href="#add" title="Add Customer">➕</a>
            <a href="#backup" title="Backup">☁️</a>
            <a href="#notifications" title="Notify">🔔</a>
            <a href="#pdf" title="PDF Report">📄</a>
          </div>
        </div>
        <h1 className="title">Local Credit Manager</h1>
      </header>

      <main>
        <section className="content">
          <h2>Welcome to Local Credit Manager 📋</h2>
          <p>
            This web app is designed for <strong>local shopkeepers</strong> to
            manage and track <strong>credit history</strong> of their customers.
          </p>
          <ul>
            <li>📌 Store customer details and transactions in <strong>localStorage</strong>.</li>
            <li>🔐 Option to <strong>create account</strong> and backup data online.</li>
            <li>🔔 Send notifications/reminders to customers with <strong>GPay requests</strong>.</li>
            <li>🧾 Generate and download credit statements in <strong>PDF format</strong>.</li>
            <li>💰 Track <strong>total credit</strong> and <strong>total collected</strong> amounts.</li>
            <li>🛠️ Future update: <strong>Move</strong> feature to be implemented soon!</li>
          </ul>
        </section>
      </main>
    </>
  );
}

export default App;
