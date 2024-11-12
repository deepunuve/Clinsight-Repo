// src/pages/UserProfilePage.js
import React from 'react';
import { Card, Button, Col, Row } from 'react-bootstrap';
import { useAuth } from '../providers/AuthProvider';

const UserProfilePage = () => {
  const { user } = useAuth();
  console.log("User Profile Data:", user);  // Add this log to check if user is available

  if (!user) {
    return <div>Loading...</div>; // Optionally show loading message
  }

  return (
    <div className="dashboard-container"> {/* Updated container class name */}

      <div className="mb-3">
        <Row className="g-3">
          <Col md={12} sm={12}>
            <Card className=" p-4 mb-4">
              <Card.Body>
                <Card.Title className="text-center">User Profile</Card.Title>
                <div className="d-flex justify-content-center">
                  <img
                    src="/images/user.jpg"
                    alt="Profile"
                    className="rounded-circle mb-3"
                    style={{ width: '150px', height: '150px' }}
                  />
                </div>
                <div className="text-center">
                  <h5>{user.username}</h5>
                  <p>{user.email}</p>
                  <Button variant="danger" onClick={() => alert('Change Password clicked')}>
                    Change Password
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col></Row></div>
    </div>
  );
};

export default UserProfilePage;
