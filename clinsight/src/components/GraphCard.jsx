// GraphCard.js
import React from 'react';
import { Col, Row, Card } from 'react-bootstrap';

const GraphCard = ({ dashData }) => {
    return (
        <div className="mb-3">
            <Row className="g-3">
                <Col md={4} lg={4}>
                    <Card className="shadow-lg  rounded card-border-green">
                        <Card.Body>
                            <Card.Title className="h6 text-center">Summary of top five diseases</Card.Title>
                            <div style={{ height: '400px', overflowY: 'scroll' }}>
                                <pre>{JSON.stringify(dashData.chartDataDisease, null, 2)}</pre>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} lg={4}>
                    <Card className="shadow-lg  rounded card-border-blue">
                        <Card.Body>
                            <Card.Title className="h6 text-center">Summary of top five chemicals</Card.Title>
                            <div style={{ height: '400px', overflowY: 'scroll' }}>
                                <pre>{JSON.stringify(dashData.chartDataChemical, null, 2)}</pre>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} lg={4}>
                    <Card className="shadow-lg  rounded card-border-orange">
                        <Card.Body>
                            <Card.Title className="h6 text-center">Summary of top five proteins</Card.Title>
                            <div style={{ height: '400px', overflowY: 'scroll' }}>
                                <pre>{JSON.stringify(dashData.chartDataProtein, null, 2)}</pre>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default GraphCard;
