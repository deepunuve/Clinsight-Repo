// src/pages/StudyDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To access route parameters
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';  // Importing bootstrap components
import { getMockDashboard, getMockStudyDetails } from '../../api/studies';  // Import API function
import './DashboardPage.css';
import DahboardCountSection from '../../components/DahboardCountSection';
import GraphCard from '../../components/GraphCard';
import DocumentGraph from '../Graph/DocumentGraph';
import ResultGraph from '../Graph/ResultGraph';
import Pico from '../Pico/Pico';
import Chatbot from '../chat/Chatbot';
import SourceDocumentSelector from '../sidebar/SourceDocumentSelector';

const StudyDetailPage = () => {
  const { studyId } = useParams();  // Access the studyId from the URL
  const [studyData, setStudyData] = useState([]);  // State to store the study data
  const [dashData, setDashData] = useState([]);  // State to store the study data
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state
  const [activeMenu, setActiveMenu] = useState('Dashboard'); // State to track active menu


  // Simulating fetching data based on studyId
  useEffect(() => {
    // Replace this with your actual data fetching logic
    const fetchData = async () => {
      try {
        // Assuming you have an API that fetches the study data based on `studyId`
        const response = await getMockStudyDetails(studyId);
        setStudyData(response);  // Set the study data
        const responseDash = await getMockDashboard(studyId);
        setDashData(responseDash);  // Set the study data
        setLoading(false);  // Set loading to false when data is fetched
      } catch (err) {
        setError('Failed to fetch study details.');  // Set error if the request fails
        setLoading(false);  // Stop loading
      }
    };

    fetchData();
  }, []);  // Re-run this effect if the studyId changes

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
        <p>Loading study details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }
  // Menu click handler
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);  // Set the active menu when clicked
  };
  return (
    <div className="dashboard-container">
      {/* Study Title */}
      <h4 className="text-left text-uppercase">{studyData.title}</h4>
      <div className="mb-3" >
        <Row className="align-items-center">
          <Col className="me-4" xs="auto">
            <p className="text-dark mb-0">Date created: 12/12/2024</p>
          </Col>
          <Col xs="auto">
            <p className="text-dark mb-0">No of Documents: {dashData.Total_count}</p>
          </Col>
        </Row>
      </div>
      <div className="mb-3">
        <Row className="g-4">
          {dashData.Type.map((item, index) => {
            // Define an array of border classes
            const borderClasses = [
              'card-border-left-green',
              'card-border-left-blue',
              'card-border-left-orange',
              'card-border-left-purple'
            ];

            // Cycle through the border classes based on index
            const borderClass = borderClasses[index % borderClasses.length];

            return (
              <Col key={index} md={3} lg={3}>
                <Card className={`shadow-lg rounded ${borderClass}`}>
                  <Card.Body>
                    <Row className="align-items-center">
                      {/* Left section with full-height border */}
                      <Col xs="auto" className="d-flex align-items-center">
                        <Card.Title className="h6 mb-0">{item.name}</Card.Title>
                      </Col>

                      {/* Right section for the count */}
                      <Col xs="auto" className="ms-auto text-end">
                        <Card.Text className="fs-2 fw-bold mb-0">
                          {item.count}
                        </Card.Text>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>

      {/* Menu */}
      <div className="mb-3">
        <Row className="g-3">
          {/* Single Card with Menu Items */}
          <Col md={12} lg={12}>
            <Card className="shadow-lg rounded">
              <Card.Body>
                <div className="d-flex justify-content-left">
                  <span
                    className="px-3"
                    onClick={() => handleMenuClick('Dashboard')}
                    style={{ cursor: 'pointer', fontWeight: activeMenu === 'Dashboard' ? 'bold' : 'normal' }}
                  >
                    Dashboard
                  </span>
                  <span className="px-3">|</span>
                  <span
                    className="px-3"
                    onClick={() => handleMenuClick('Doc Graph')}
                    style={{ cursor: 'pointer', fontWeight: activeMenu === 'Doc Graph' ? 'bold' : 'normal' }}
                  >
                    Doc Graph
                  </span>
                  <span className="px-3">|</span>
                  <span
                    className="px-3"
                    onClick={() => handleMenuClick('PICO')}
                    style={{ cursor: 'pointer', fontWeight: activeMenu === 'PICO' ? 'bold' : 'normal' }}
                  >
                    PICO
                  </span>
                  <span className="px-3">|</span>
                  <span
                    className="px-3"
                    onClick={() => handleMenuClick('Chat')}
                    style={{ cursor: 'pointer', fontWeight: activeMenu === 'Chat' ? 'bold' : 'normal' }}
                  >
                    Chat
                  </span>
                  <span className="px-3">|</span>
                  <span
                    className="px-3"
                    onClick={() => handleMenuClick('Result Graph')}
                    style={{ cursor: 'pointer', fontWeight: activeMenu === 'Result Graph' ? 'bold' : 'normal' }}
                  >
                    Result Graph
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Displaying the study data in Cards */}
      <div className="dashContent">
        {activeMenu === 'Dashboard' && (
          <>
            <DahboardCountSection dashData={dashData.count} />
            <GraphCard dashData={dashData} />
          </>
        )}

        {activeMenu === 'Chat' && (
          <div className="chat-content">
            <Chatbot />
          </div>
        )}

        {activeMenu === 'Doc Graph' && (
          <div className="DocGraph-content">
            <div className="mb-3">
              <Row className="g-3">
                <Col md={3} sm={12}>
                  <Card style={{ height: "750px", overflowY: 'scroll' }}>
                    <Card.Body>
                      <SourceDocumentSelector pdfList={studyData.source} />
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={9} sm={12}>
                  <Card>
                    <Card.Body>
                      <DocumentGraph />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        )}
        {activeMenu === 'PICO' && (
          <div className="pico-content">
            <Pico />
          </div>
        )}

        {activeMenu === 'Result Graph' && (
          <div className="result-content">
            <div className="mb-3">
              <Row className="g-3">
                <Col md={3} sm={12}>
                  <Card style={{ height: "750px" }}>
                    <Card.Body>
                      <SourceDocumentSelector pdfList={studyData.source} />
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={9} sm={12}>
                  <Card>
                    <Card.Body>
                      <ResultGraph />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </div>

    </div >
  );

};

export default StudyDetailPage;
