import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getMockStudies } from '../../api/studies';
import './DashboardPage.css';

const DashboardPage = () => {
  const [studies, setStudies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudiesData = async () => {
      try {
        const data = await getMockStudies();
        setStudies(data);
      } catch (error) {
        console.error('Error fetching studies:', error);
      }
    };

    fetchStudiesData();
  }, []);

  const handleCardClick = (studyId) => {
    navigate(`/study/${studyId}`);
  };

  return (
    <div className="dashboard-container"> {/* Updated container class name */}

      <Row className="g-4">
        {studies.map((study) => (
          <Col key={study.id} md={4} lg={4}>
            <Card
              className="shadow-lg rounded overflow-hidden card-border-blue"
              onClick={() => handleCardClick(study.id)}
              style={{ cursor: 'pointer', minHeight: '250px' }}
            >
              <Card.Body className="p-4">
                <Card.Subtitle className="mb-3 text-muted">
                  <Badge bg="warning" text="dark" className="text-capitalize">{study.study_type}</Badge>
                </Card.Subtitle>
                {/* Title */}
                <Card.Title className="fs-5  text-uppercase text-dark title-border">{study.title}</Card.Title>

                {/* Subtitle with Badge */}


                {/* Brief Summary with Truncation */}
                <Card.Text className="brief-summary text-muted" style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                  {study.brief_summary.length > 150 ? `${study.brief_summary.substring(0, 150)}...` : study.brief_summary}
                </Card.Text>

                {/* Footer with Study Status */}

                <Card.Footer className="bg-light d-flex justify-content-between align-items-center">
                  <small className="text-muted">{study.study_status}</small>
                </Card.Footer>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DashboardPage;
