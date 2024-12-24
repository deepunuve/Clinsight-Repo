// src/pages/StudyDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To access route parameters
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';  // Importing bootstrap components
import { getDashboardData, fetchStudyDetails } from '../../api/studies';  // Import API function
import './DashboardPage.css';
import DahboardCountSection from '../../components/DahboardCountSection';
import GraphCard from '../../components/GraphCard';
import DocumentGraph from '../Graph/DocumentGraph';
import ResultGraph from '../Graph/ResultGraph';
import Pico from '../Pico/Pico';
import Chatbot from '../chat/Chatbot';
import SourceDocumentSelector from '../sidebar/SourceDocumentSelector';

const StudyDetailPage = ({ updateHeaderTitle }) => {
  const { studyId } = useParams();  // Access the studyId from the URL
  const [studyData, setStudyData] = useState([]);  // State to store the study data
  const [dashData, setDashData] = useState([]);  // State to store the study data
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state
  const [activeMenu, setActiveMenu] = useState('Dashboard'); // State to track active menu
  const [selectedCardText, setSelectedCardText] = useState('');

  // Simulating fetching data based on studyId
  useEffect(() => {
    // Replace this with your actual data fetching logic
    const fetchData = async () => {
      try {
        // Assuming you have an API that fetches the study data based on `studyId`
        const response = await fetchStudyDetails(studyId);
        setStudyData(response);  // Set the study data
        const responseDash = await getDashboardData(studyId);
        setDashData(responseDash);  // Set the study data
        setLoading(false);  // Set loading to false when data is fetched
      } catch (err) {
        setError('Failed to fetch study details.');  // Set error if the request fails
        setLoading(false);  // Stop loading
      }
    };

    fetchData();
  }, []);  // Re-run this effect if the studyId changes

  useEffect(() => {
    // Update the header title dynamically when a card is clicked
    if (selectedCardText) {
      updateHeaderTitle(`${selectedCardText}`);
    } else {
      updateHeaderTitle();
    }
  }, [selectedCardText, studyData.title, updateHeaderTitle]);
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
  const handleCardClick = (text) => {
    setSelectedCardText(text);
  };
  // Menu click handler
  const handleMenuClick = (menu) => {
    setSelectedCardText();
    setActiveMenu(menu);  // Set the active menu when clicked
  };
  return (
    <div className="dashboard-container">
      <Row >
        <Col xs={12} md={5} className='card-border-left-blue' style={{ marginLeft: "12px", marginBottom: "6px" }}>
          <h4 className="text-left text-uppercase">{studyData.title}</h4>
          <div className="mb-3" >
            <Row className="align-items-center ">
              <Col className="me-4" xs="auto">
                <p className="text-dark mb-0">Date created: 12/12/2024</p>
              </Col>
              <Col xs="auto">
                <p className="text-dark mb-0">No of Documents: {dashData.Total_count}</p>
              </Col>
            </Row>
          </div>
        </Col>
        <Col xs={12} md={6} className="text-end">
          <span
            className="px-3"
            onClick={() => handleMenuClick('Dashboard')}
            style={{
              cursor: 'pointer', color: activeMenu === 'Dashboard' ? '#000' : '#0070c0',
            }}
          >
            Dashboard
          </span>
          <span className="px-3">|</span>
          <span
            className="px-3"
            onClick={() => handleMenuClick('Doc Graph')}
            style={{ cursor: 'pointer', color: activeMenu === 'Doc Graph' ? '#000' : '#0070c0', }}
          >
            Doc Graph
          </span>
          <span className="px-3">|</span>
          <span
            className="px-3"
            onClick={() => handleMenuClick('PICO')}
            style={{ cursor: 'pointer', color: activeMenu === 'PICO' ? '#000' : '#0070c0', }}
          >
            PICO
          </span>
          <span className="px-3">|</span>
          <span
            className="px-3"
            onClick={() => handleMenuClick('Chat')}
            style={{ cursor: 'pointer', color: activeMenu === 'Chat' ? '#000' : '#0070c0', }}
          >
            Chat
          </span>
          <span className="px-3">|</span>
          <span
            className="px-3"
            onClick={() => handleMenuClick('Result Graph')}
            style={{ cursor: 'pointer', color: activeMenu === 'Result Graph' ? '#000' : '#0070c0', }}
          >
            Result Graph
          </span>
        </Col>
        <Col xs={12} md={2} >
          <div style={{ height: "700px", background: "#ddd", overflowY: "auto", overflowX: "hidden" }}>
            <SourceDocumentSelector pdfList={studyData.source} />
          </div>
        </Col>
        <Col xs={12} md={10}>
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
                    <Card className={`shadow-lg rounded ${borderClass}`} onClick={() => handleCardClick(item.name)}>
                      <Card.Body>
                        <Row className="align-items-center" >
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


          {/* Displaying the study data in Cards */}
          <div className="dashContent">
            {activeMenu === 'Dashboard' && (
              <>
                <DahboardCountSection dashData={dashData.count} onClick={handleCardClick} />
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
                    <Col md={12} sm={12}>
                      <DocumentGraph />
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
                    <Col md={12} sm={12}>
                      <ResultGraph />
                    </Col>
                  </Row>
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>


    </div >
  );

};

export default StudyDetailPage;
