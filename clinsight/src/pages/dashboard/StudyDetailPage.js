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
  const { studyId } = useParams();
  const [studyData, setStudyData] = useState([]);
  const [dashData, setDashData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [selectedCardText, setSelectedCardText] = useState('');
  const [activeCard, setActiveCard] = useState([]);
  const [activeECard, setActiveECard] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState([]);
  const [selectedDoc, setselectedDoc] = useState([]);

  const [selectedEntityId, setSelectedEntityId] = useState([]);
  const [selectedDocId, setselectedDocId] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {


        let inputStudyDetails = {
          study_id: studyId,
          doc_type: [],
          entity_type: []
        };
        const response = await fetchStudyDetails(inputStudyDetails);
        setStudyData(response);
        const responseDash = await getDashboardData(inputStudyDetails);
        setDashData(responseDash);
        const allEntityTypes = responseDash.entity.map(item => item.name);
        const allDocuments = responseDash.Type.map(doc => doc.name); // Assuming `source` contains the document names

        setActiveCard(allDocuments); // Set all entities as active
        setActiveECard(allEntityTypes); // Set all entities as active
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch study details.');
        setLoading(false);
      }
    };

    fetchData();
  }, [studyId]);

  useEffect(() => {
    if (selectedCardText) {
      updateHeaderTitle(`${selectedCardText}`);
    } else {
      updateHeaderTitle();
    }
  }, [selectedCardText, studyData.title, updateHeaderTitle]);

  const handleDocumentClick = async (text, docId) => {
    try {
      // Toggle entity selection logic
      let updatedDocTypes = [...selectedDoc];

      if (updatedDocTypes.includes(docId)) {
        // If docId is already selected, remove it
        updatedDocTypes = updatedDocTypes.filter(item => item !== docId);
      } else {
        // If docId is not selected, add it
        updatedDocTypes.push(docId);
      }

      // Update selectedDoc with the docId only for API call
      setselectedDoc(updatedDocTypes);

      // Update the text displayed for the selected documents
      const updatedSelectedCardText = updatedDocTypes
        .map(id => {
          const doc = dashData.Type.find(item => item.id === id); // Find the document by id
          return doc ? doc.name : ''; // Get the name of the document from the id
        })
        .join(" & "); // Combine names with '&' separator

      // Update the text shown on the UI
      setSelectedCardText(updatedSelectedCardText);

      // Handle active card toggling
      let updatedActiveCards = [...activeCard];

      // Ensure activeECard is initialized as an array
      if (!updatedActiveCards) updatedActiveCards = [];

      if (updatedActiveCards.includes(text)) {
        // If the card is already active, deactivate it
        updatedActiveCards = updatedActiveCards.filter(item => item !== text);
      } else {
        // If the card is inactive, activate it
        updatedActiveCards.push(text);
      }

      setActiveCard(updatedActiveCards); // Update active cards state

      // Define the input for the API call
      const inputStudyDetails = {
        study_id: studyId,
        doc_type: updatedDocTypes,  // Send docId in the API call
        entity_type: selectedEntity  // Send all selected entities
      };

      // Call the API to fetch the updated data
      const updatedStudyData = await fetchStudyDetails(inputStudyDetails); // API call for study details
      const updatedDashData = await getDashboardData(inputStudyDetails);   // API call for dashboard data

      // Update state with the new data
      setStudyData(updatedStudyData);
      setDashData(updatedDashData);

    } catch (error) {
      console.error("Error updating data:", error);
      setError("Failed to update data. Please try again."); // Display an error message
    }
  };


  const handleEntityClick = async (text, entityId) => {
    try {
      // Toggle entity selection logic
      let updatedEntityTypes = [...selectedEntity];

      if (updatedEntityTypes.includes(entityId)) {
        // If entity is already selected, remove it
        updatedEntityTypes = updatedEntityTypes.filter(item => item !== entityId);
      } else {
        // If entity is not selected, add it
        updatedEntityTypes.push(entityId);
      }

      setSelectedEntity(updatedEntityTypes);

      const updatedSelectedCardText = [
        // Map over updatedEntityTypes and get corresponding names
        ...selectedDoc.map(id => {
          const doc = dashData.Type.find(item => item.id === id); // Find the document by id
          return doc ? doc.name : ''; // Get the name of the document from the id
        }),
        ...updatedEntityTypes.map(id => {
          const doc = dashData.entity.find(item => item.id === id); // Find the document by id
          return doc ? doc.name : ''; // Get the name of the document from the id
        })
      ]
        .filter(Boolean) // Remove any empty strings or undefined values
        .join(" & "); // Combine names with '&' separator

      setSelectedCardText(updatedSelectedCardText);

      // Handle active card toggling
      let updatedActiveCards = [...activeECard];

      // Ensure activeECard is initialized as an array
      if (!updatedActiveCards) updatedActiveCards = [];

      if (updatedActiveCards.includes(text)) {
        // If the card is already active, deactivate it
        updatedActiveCards = updatedActiveCards.filter(item => item !== text);
      } else {
        // If the card is inactive, activate it
        updatedActiveCards.push(text);
      }

      setActiveECard(updatedActiveCards); // Update active cards state

      // Define the input for the API call
      const inputStudyDetails = {
        study_id: studyId,
        doc_type: selectedDoc,  // Assuming you have a specific doc_type to pass based on the doc type card
        entity_type: updatedEntityTypes  // Pass all selected entities
      };

      // Call the API to fetch the updated data
      const updatedStudyData = await fetchStudyDetails(inputStudyDetails); // API call for study details
      const updatedDashData = await getDashboardData(inputStudyDetails);   // API call for dashboard data

      // Update state with the new data
      setStudyData(updatedStudyData);
      setDashData(updatedDashData);

    } catch (error) {
      console.error("Error updating data:", error);
      setError("Failed to update data. Please try again."); // Display an error message
    }
  };

  // Menu click handler
  const handleMenuClick = (menu) => {
    if (menu === "Dashboard") {
      // let newSelectedCardText = [...selectedDoc, ...selectedEntity].join(" & ");
      // setSelectedCardText(newSelectedCardText);
    } else
      setSelectedCardText(menu);
    setActiveMenu(menu);  // Set the active menu when clicked
  };


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
  const input = {
    study_id: studyId,
    doc_type: selectedDoc,
    entity_type: selectedEntity
  };
  return (
    <div className="dashboard-container">
      <Row >
        <Col xs={12} md={5} className='card-border-left-blue' style={{ marginLeft: "12px", marginBottom: "6px" }}>
          <h4 className="text-left text-uppercase">{studyData.title}</h4>
          <div className="mb-3" >
            <Row className="align-items-center ">
              <Col className="me-4" xs="auto">
                <p className="text-dark mb-0">Date created: {studyData.study_date}</p>
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
            onClick={() => handleMenuClick('Document Graph')}
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
                const borderClasses = [
                  'card-border-left-green',
                  'card-border-left-blue',
                  'card-border-left-orange',
                  'card-border-left-purple'
                ];
                const borderClass = borderClasses[index % borderClasses.length];

                // Determine if the card should be styled as active or inactive
                const isActive = selectedDoc.length === 0 || selectedDoc.includes(item.id);
                return (
                  <Col key={index} md={3} lg={3}>
                    <Card
                      className={`shadow-lg rounded ${borderClass} ${isActive ? 'active-card' : 'inactive-card'}`}
                      onClick={() => handleDocumentClick(item.name, item.id)}
                      style={{
                        opacity: isActive ? 1 : 0.2, // All cards visible when activeCard is null
                        transition: 'opacity 0.3s ease-in-out' // Smooth transition
                      }}
                    >
                      <Card.Body>
                        <Row className="align-items-center">
                          <Col xs="auto" className="d-flex align-items-center">
                            <Card.Title className="h6 mb-0">{item.name}</Card.Title>
                          </Col>
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
                <div className="mb-4">
                  <Row className="g-4">
                    {dashData.entity.map((item, index) => {
                      const borderClasses = [
                        'card-border-left-green',
                        'card-border-left-blue',
                        'card-border-left-orange',
                        'card-border-left-purple'
                      ];
                      const borderClass = borderClasses[index % borderClasses.length];

                      // Determine if the card should be styled as active or inactive
                      const isActive = selectedEntity.length === 0 || selectedEntity.includes(item.id);

                      return (
                        <Col key={index} md={3} lg={3}>
                          <Card
                            className={`shadow-lg rounded ${borderClass} ${isActive ? 'active-card' : 'inactive-card'}`}
                            onClick={() => handleEntityClick(item.name, item.id)} // Pass entity value
                            style={{
                              opacity: isActive ? 1 : 0.2, // Set opacity for inactive cards
                              transition: 'opacity 0.3s ease-in-out' // Smooth transition for opacity change
                            }}
                          >
                            <Card.Body>
                              <Row className="align-items-center">
                                <Col xs="auto" className="d-flex align-items-center">
                                  <Card.Title className="h6 mb-0">{item.name}</Card.Title>
                                </Col>
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
                <GraphCard dashData={dashData} />
              </>
            )}

            {activeMenu === 'Chat' && (
              <div className="chat-content">
                <Chatbot studyId={studyId} />
              </div>
            )}

            {activeMenu === 'Document Graph' && (
              <div className="DocGraph-content">
                <div className="mb-3">
                  <Row className="g-3">
                    <Col md={12} sm={12}>
                      <DocumentGraph payload={input} />
                    </Col>
                  </Row>
                </div>
              </div>
            )}
            {activeMenu === 'PICO' && (
              <div className="pico-content">
                <Pico payload={input} />
              </div>
            )}

            {activeMenu === 'Result Graph' && (
              <div className="result-content">
                <div className="mb-3">
                  <Row className="g-3">
                    <Col md={12} sm={12}>
                      <ResultGraph payload={input} />
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
