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

  // Helper function to determine if a menu item is active
  const isActive = (path) => window.location.pathname === path;

  return (
    <div className='header-container'>
      <Navbar bg="white" variant="light" expand="lg" sticky="top" className="navbar">
        <Navbar.Brand href="/dashboard">
          <div className="custom-font">
            <img
              src="/Images/logo-icon.png"
              alt="Icon"
              style={{ marginRight: '8px', width: '46px', height: '46px' }}
            />
            Multi-Tenant Project Workspace
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            {user?.role === 'admin' && (
              <Nav.Link
                href="/adminDashboard"
                className={isActive('/adminDashboard') ? 'nav-link-active' : 'nav-link-inactive'}
              >
                <FontAwesomeIcon icon={faTachometerAlt} className="icon-spacing" />
                Dashboard
              </Nav.Link>
            )}
            {user?.role === 'user' && (
              <Nav.Link
                href="/dashboard"
                className={isActive('/dashboard') ? 'nav-link-active' : 'nav-link-inactive'}
              >
                <FontAwesomeIcon icon={faTachometerAlt} className="icon-spacing" />
                Dashboard
              </Nav.Link>
            )}
            <Nav.Link
              href="/sources"
              className={isActive('/sources') ? 'nav-link-active' : 'nav-link-inactive'}
            >
              <FontAwesomeIcon icon={faDatabase} className="icon-spacing" />
              Sources
            </Nav.Link>
            <Nav.Link
              href="/synthetic"
              className={isActive('/synthetic') ? 'nav-link-active' : 'nav-link-inactive'}
            >
              <FontAwesomeIcon icon={faCog} className="icon-spacing" />
              Synthetic
            </Nav.Link>

            {user?.role === 'admin' && (
              <Nav.Link
                href="/users"
                className={isActive('/users') ? 'nav-link-active' : 'nav-link-inactive'}
              >
                <FontAwesomeIcon icon={faUsers} className="icon-spacing" />
                Users
              </Nav.Link>
            )}

            {user ? (
              <NavDropdown
                title={
                  <span className="d-flex align-items-center">
                    <img
                      src={userImage}
                      alt="User Avatar"
                      className="rounded-circle user-avatar"
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
