// src/components/Header.js
import React from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faTachometerAlt, faDatabase, faCog, faUserCircle, faUsers } from '@fortawesome/free-solid-svg-icons';
import '../styles/header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    logout(navigate);
  };

  const userImage = '/images/user.jpg';

  return (
    <div className='header-container'>
      <Navbar bg="white" variant="light" expand="lg" sticky="top" className="navbar">
        <Navbar.Brand href="/dashboard">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="navbar-logo"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          {/* ms-auto ensures the nav items are pushed to the right */}
          <Nav className="ms-auto d-flex align-items-center">
            {user?.role === 'admin' && (
              <Nav.Link href="/adminDashboard">
                <FontAwesomeIcon icon={faTachometerAlt} className="icon-spacing" />
                Dashboard
              </Nav.Link>
            )}
            {user?.role === 'user' && (
              <Nav.Link href="/dashboard">
                <FontAwesomeIcon icon={faTachometerAlt} className="icon-spacing" />
                Dashboard
              </Nav.Link>
            )}
            <Nav.Link href="/sources">
              <FontAwesomeIcon icon={faDatabase} className="icon-spacing" />
              Sources
            </Nav.Link>
            <Nav.Link href="/synthetic">
              <FontAwesomeIcon icon={faCog} className="icon-spacing" />
              Synthetic
            </Nav.Link>

            {/* Conditionally render Users link for admin users only */}
            {user?.role === 'admin' && (
              <Nav.Link href="/users">
                <FontAwesomeIcon icon={faUsers} className="icon-spacing" />
                Users
              </Nav.Link>
            )}

            {user ? (
              <NavDropdown
                title={
                  <span className="d-flex align-items-center">
                    <img
                      src={userImage} // User profile image
                      alt="User Avatar"
                      className="rounded-circle user-avatar" // Make image round
                      width="30" height="30"
                    />
                    <span className="ms-2 text-dark">{user.username}</span>
                  </span>
                }
                id="user-dropdown"
              >
                <NavDropdown.Item href="/profile">
                  <FontAwesomeIcon icon={faUserCircle} className="icon-spacing" />
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="icon-spacing" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button variant="outline-primary" onClick={() => navigate('/')}>Login</Button>
            )}

          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
