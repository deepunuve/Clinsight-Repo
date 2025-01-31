import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchStudies, fetchStudyTypes } from '../../api/studies';
import './DashboardPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faFileAlt, faDatabase, faCompressArrowsAlt, faUserCircle, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faStar } from '@fortawesome/free-regular-svg-icons';

const DashboardPage = () => {
  const [studies, setStudies] = useState([]);
  const [studyTypes, setStudyTypes] = useState([]);
  const [selectedStudyType, setSelectedStudyType] = useState(''); // Track selected study type
  const navigate = useNavigate();

  useEffect(() => {
    const loadStudyTypes = async () => {
      try {
        const data = await fetchStudyTypes();
        setStudyTypes(data);
      } catch (error) {
        console.error('Error fetching study types:', error);
      }
    };

    const loadStudies = async () => {
      try {
        const data = await fetchStudies();
        setStudies(data);
      } catch (error) {
        console.error('Error fetching studies:', error);
      }
    };

    loadStudyTypes();
    loadStudies();
  }, []);

  const handleCardClick = (studyId, menu) => {
    navigate(`/study/${studyId}?menu=${menu}`);
  };

  const getBorderClass = (studyType) => {
    switch (studyType) {
      case 'Intervention':
        return 'border-div-intervention';
      case 'observation':
        return 'border-div-observation';
      case 'invoices':
        return 'border-div-diagnostic';
      default:
        return 'border-div-default';
    }
  };

  // Handle dropdown change
  const handleDropdownChange = (event) => {
    setSelectedStudyType(event.target.value); // Update the selected study type
  };

  // Filter studies based on the selected study type
  const filteredStudies = selectedStudyType
    ? studies.filter((study) => study.study_type === selectedStudyType)
    : studies; // Show all studies if no type is selected

  return (
    <div className="dashboard-container">
      <Row className="g-4">
        {filteredStudies.map((study) => (
          <Col key={study.id} md={4} lg={4}>
            <div className="container mt-4">
              <div
                className="card border-primary position-relative"
                style={{ cursor: 'pointer', minHeight: '250px' }}
              >
                {/* Icons in the Top-Right Corner */}
                <div
                  className="position-absolute top-0 end-0 p-2 d-flex"
                  style={{ gap: '0.5rem', zIndex: 10 }}
                >

                  <FontAwesomeIcon
                    icon={faHeart}
                    style={{ cursor: 'pointer', fontSize: '1rem' }}
                    title="Favourites"
                  />
                  <FontAwesomeIcon
                    icon={faStar}
                    style={{ cursor: 'pointer', fontSize: '1rem' }}
                    title="Important"
                  />
                  <FontAwesomeIcon
                    icon={faSyncAlt}
                    style={{ cursor: 'pointer', fontSize: '1rem' }}
                    title="Refresh"
                  />
                </div>

                {/* Card Header */}
                <div className="card-header" onClick={() => handleCardClick(study.id, "Dashboard")}>
                  <div className={getBorderClass(study.study_type)}>
                    <div className="card-header-div">
                      <div className="intervention-title">{study.study_type}</div>
                      <h5 className="main-title">{study.title}</h5>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body" onClick={() => handleCardClick(study.id)}>
                  <p className="card-text">
                    {study.brief_summary.length > 150
                      ? `${study.brief_summary.substring(0, 150)}...`
                      : study.brief_summary}
                  </p>
                  <div className="d-flex justify-content-between">
                    <div className="box flex-fill mx-1 d-flex align-items-center justify-content-center" title={study.count[0].name}>
                      <FontAwesomeIcon icon={faFileAlt} className="icon-spacing" />
                      <div className="ms-2">{study.count[0].count}</div>
                    </div>
                    <div className="box flex-fill mx-1 d-flex align-items-center justify-content-center" title={study.count[1].name}>
                      <FontAwesomeIcon icon={faCompressArrowsAlt} className="icon-spacing" />
                      <div className="ms-2">{study.count[1].count}</div>
                    </div>
                    <div className="box flex-fill mx-1 d-flex align-items-center justify-content-center" title={study.count[2].name}>
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="icon-spacing" />
                      <div className="ms-2">{study.count[2].count}</div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="card-footer bg-white">
                  <div className="d-flex justify-content-between">
                    <button className="btn me-2" onClick={() => handleCardClick(study.id, "Dashboard")}>Dashboard</button>
                    <div className="divider"></div>
                    <button className="btn me-2" onClick={() => handleCardClick(study.id, "PICO")}>PICO</button>
                    <div className="divider"></div>
                    <button className="btn me-2" onClick={() => handleCardClick(study.id, "Chat")}>Chat</button>
                    <div className="divider"></div>
                    <button className="btn me-2" onClick={() => handleCardClick(study.id, "Result Graph")}>Graphs</button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

    </div>
  );
};

export default DashboardPage;
