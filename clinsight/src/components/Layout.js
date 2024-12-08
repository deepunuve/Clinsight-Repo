// src/components/Layout.js
import React from 'react';
import Header from '../components/Header';  // Import Header
import Footer from '../components/Footer';  // Import Footer
import '../styles/Layout.css';  // Import custom layout styles

const Layout = ({ children, title }) => {
  return (
    <div className="layout-container">
      <Header title={title} />
      <main className="content-area">{children}</main> {/* Render child components here */}
      <Footer />
    </div>
  );
};

export default Layout;
