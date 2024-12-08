import React, { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';  // Import the CSS file for styling

const LoginPage = () => {
  const { login } = useAuth();  // Get the login function from AuthProvider
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Track if checking session data is still loading
  const navigate = useNavigate();

  // Check if the user is already logged in via sessionStorage on first render
  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      navigate('/dashboard');  // Redirect to dashboard immediately if user is already logged in
    } else {
      setLoading(false);  // If no user, stop loading
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Perform login using the login function from AuthProvider
      const user = await login(username, password, navigate);

      // After login success, save user info and token to sessionStorage
      const userData = { username: user.username, role: user.role, email: user.email };  // You can store more data like user role, email, etc.
      sessionStorage.setItem('user', JSON.stringify(userData));  // Store user data in sessionStorage
      sessionStorage.setItem('token', 'your_token_here');  // Store token in sessionStorage (adjust token handling as needed)

    } catch (err) {
      setError('Invalid username or password');
    }
  };

  if (loading) {
    // Show a loading state while checking if the user is already logged in
    return <div>Loading...</div>;
  }

  return (
    <div className="login-container">
      <div className="row h-100">
        {/* Left side - Logo and Login Form */}
        <div className="col-lg-6 col-md-12 p-5 d-flex justify-content-center align-items-center flex-column">
          {/* Logo */}
          <div className="mb-4 text-center">
            <img
              src="/images/logo.png"  // Replace with the correct path to your logo
              alt="Logo"
              style={{ height: '80px' }}  // Adjust the height of the logo
            />
          </div>

          <div className="login-form-container w-100">
            <h4 className="text-center mb-4">sign in</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-danger">{error}</p>}
              <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
          </div>
        </div>

        {/* Right side - Background Image */}
        <div className="col-lg-6 d-none d-lg-block p-0">
          <img
            src="/images/Login/sign.png" // Image from the public folder
            alt="Login Background"
            className="img-fluid h-100 w-100 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
