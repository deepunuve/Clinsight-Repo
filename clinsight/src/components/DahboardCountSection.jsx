// CardList.js
import React from 'react';
import { Col, Row, Card } from 'react-bootstrap';

const DahboardCountSection = ({ dashData }) => {
    // Define an array of border classes
    const borderClasses = [
        'card-border-left-lightblue',
        'card-border-left-lightgreen',
        'card-border-left-lightpurple',
        'card-border-left-lightorange'
    ];

    return (
        <div className="mb-3">
            <Row className="g-4">
                {dashData.map((item, index) => {
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
    );
};

export default DahboardCountSection;
