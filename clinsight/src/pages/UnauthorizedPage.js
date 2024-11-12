// src/pages/UnauthorizedPage.js
import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');  // Navigate back to the home or login page
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh' }} // Full viewport height for vertical centering
    >
      <Card className="text-center" style={{ maxWidth: '400px' }}>
        <Card.Img variant="top" src="/images/unauthorized.gif" alt="Unauthorized Access" />
        <Card.Body>
          <Card.Text>
            Sorry, you don’t have permission to view this page. Please check your access or contact support if you believe this is an error.
          </Card.Text>
          <Button variant="primary" onClick={handleGoBack}>
            Return to Home
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UnauthorizedPage;
