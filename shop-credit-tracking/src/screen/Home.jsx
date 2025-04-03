import React, { useState } from 'react'; import logo from '../assets/logo.png';
import "../screen/hom.css";
function Home() { const [menuOpen, setMenuOpen] = useState(false);

return ( <div className="home"> <nav className="navbar"> <img src={logo} alt="Shop Credit Logo" className="logo" /> <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}> ☰ </button> <ul className={menuOpen ? "nav-items open" : "nav-items"}> <li><a href="#about">About</a></li> <li><a href="#features">Features</a></li> <li><a href="#demo">Demo</a></li> <li><a href="#contact">Contact</a></li> </ul> </nav>

<header className="header">
    <h1>Welcome to Shop Credit & Tracking</h1>
    <p>Your one-stop solution for managing shop credits and tasks.</p>
  </header>
  
  <main className="main-content">
    <section id="about" className="intro">
      <h2>About Us</h2>
      
      <h3>Our Mission</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      
      <h3>Why Choose Us?</h3>
      <p>Vestibulum ac velit at sapien interdum tincidunt.</p>
      
      <h3>How It Works</h3>
      <p>Curabitur nec massa et quam malesuada convallis.</p>
      
      <h3>Customer Benefits</h3>
      <p>Donec sed sapien auctor, ultrices lacus at, cursus lectus.</p>
      
      <h3>Security and Reliability</h3>
      <p>Quisque a libero vitae orci vulputate vehicula.</p>
      
      <h3>Innovation and Technology</h3>
      <p>Morbi in odio sed ex congue egestas id id justo.</p>
      
      <h3>Future Goals</h3>
      <p>Sed sollicitudin elit nec mi hendrerit, ut gravida nulla cursus.</p>
    </section>
    
    <section id="features" className="features">
      <h2>Features</h2>
      <ul>
        <li>Calculate totals with our built-in calculator.</li>
        <li>Track customer purchases and credits in the to-do list.</li>
        <li>Easy navigation and user-friendly interface.</li>
        <li>Generate detailed reports and analytics.</li>
        <li>Secure data storage and access control.</li>
      </ul>
    </section>

    <section id="demo" className="demo">
      <h2>Watch Our Demo</h2>
      <p>See how Shop Credit & Tracking can simplify your business.</p>
      <video width="600" controls>
        <source src="shop_tracking_demo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  </main>
  
  <footer className="footer">
    <div className="footer-section">
      <h3>F1 Section</h3>
      <p>Providing seamless credit tracking solutions.</p>
    </div>
    <div className="footer-section">
      <h3>F2 Section</h3>
      <p>Enhancing financial transparency for businesses.</p>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2025 Shop Credit & Tracking. All rights reserved.</p>
      <p>Contact us: support@shopcredit.com | +1-123-456-7890</p>
    </div>
  </footer>
</div>

); }

export default Home;