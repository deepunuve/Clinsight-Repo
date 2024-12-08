import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getMockStudies, fetchStudyTypes } from '../../api/studies';
import './DashboardPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faTachometerAlt, faDatabase, faCog, faUserCircle, faUsers } from '@fortawesome/free-solid-svg-icons';

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
        const data = await getMockStudies();
        setStudies(data);
      } catch (error) {
        console.error('Error fetching studies:', error);
      }
    };

    loadStudyTypes();
    loadStudies();
  }, []);

  const handleCardClick = (studyId) => {
    navigate(`/study/${studyId}`);
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
        <div className="col-md-2">
          <select
            className="form-select"
            id="dropdown"
            onChange={handleDropdownChange}
            value={selectedStudyType} // Controlled component
          >
            <option value="">Select all studies</option>
            {studyTypes?.map((category) => (
              <option key={category.id} value={category.title}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
            />
          </div>
        </div>
      </Row>
      <Row className="g-4">
        {filteredStudies.map((study) => (
          <Col key={study.id} md={4} lg={4}>
            <div className="container mt-4">
              <div
                className="card border-primary"
                style={{ cursor: 'pointer', minHeight: '250px' }}
              >
                <div className="card-header" onClick={() => handleCardClick(study.id)}>
                  <div className={getBorderClass(study.study_type)}>
                    <div className="card-header-div">
                      <div className="intervention-title">{study.study_type}</div>
                      <h5 className="main-title">{study.title}</h5>
                    </div>
                  </div>
                </div>
                <div className="card-body" onClick={() => handleCardClick(study.id)}>
                  <p className="card-text">
                    {study.brief_summary.length > 150
                      ? `${study.brief_summary.substring(0, 150)}...`
                      : study.brief_summary}
                  </p>
                  <div className="d-flex justify-content-between">
                    <div className="box flex-fill mx-1 d-flex align-items-center justify-content-center">
                      <FontAwesomeIcon icon={faTachometerAlt} className="icon-spacing" />
                      <div className="ms-2">30</div>
                    </div>
                    <div className="box flex-fill mx-1 d-flex align-items-center justify-content-center">
                      <FontAwesomeIcon icon={faCog} className="icon-spacing" />
                      <div className="ms-2">200</div>
                    </div>
                    <div className="box flex-fill mx-1 d-flex align-items-center justify-content-center">
                      <FontAwesomeIcon icon={faDatabase} className="icon-spacing" />
                      <div className="ms-2">47</div>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-white">
                  <div className="d-flex justify-content-between">
                    <button className="btn me-2">Dashboard</button>
                    <div className="divider"></div>
                    <button className="btn me-2">PICO</button>
                    <div className="divider"></div>
                    <button className="btn me-2">Chat</button>
                    <div className="divider"></div>
                    <button className="btn">Graphs</button>
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
