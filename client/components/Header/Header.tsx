import React from 'react';
import './Header.css';
const Header = () => {
  return (
    <header className="header">
      <div className="logo">LearnGenix</div>
      <nav className="nav">
        <a href="#">Product</a>
        <a href="#">Pricing</a>
        <a href="#">Resources</a>
        <a href="#">Support</a>
      </nav>
      <div className="auth-buttons">
        <button className="free-trial">Sign in</button>
        <button className="book-demo">Book a demo</button>
      </div>
    </header>
  );
};

export default Header;
