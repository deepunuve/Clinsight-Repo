// GraphCard.js
import React from 'react';
import { Col, Row, Card } from 'react-bootstrap';
import PieChart from '../pages/chart/PieChart';
import NightingaleChart from '../pages/chart/NightingaleChart';

const GraphCard = ({ dashData }) => {
    return (
        <div className="mb-3">
            <Row className="g-3">
                {dashData.chartDataDisease != null ? (
                    <Col md={4} lg={4}>
                        <Card className="shadow-lg  rounded card-border-blue">
                            <Card.Body style={{ background: "#fff" }}>
                                <Card.Title className="h6 text-center">Summary of top five disease</Card.Title>
                                <div style={{ height: '400px', overflowY: 'scroll' }}>
                                    <NightingaleChart dashData={dashData.chartDataDisease} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ) : null}
                {dashData.chartDataChemical != null ? (
                    <Col md={4} lg={4}>
                        <Card className="shadow-lg  rounded card-border-blue">
                            <Card.Body style={{ background: "#fff" }}>
                                <Card.Title className="h6 text-center">Summary of top five chemicals</Card.Title>
                                <div style={{ height: '400px', overflowY: 'scroll' }}>
                                    <NightingaleChart dashData={dashData.chartDataChemical} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ) : null}
                {dashData.chartDataProtein != null ? (
                    <Col md={4} lg={4}>
                        <Card className="shadow-lg  rounded card-border-blue">
                            <Card.Body style={{ background: "#fff" }}>
                                <Card.Title className="h6 text-center">Summary of top five protein</Card.Title>
                                <div style={{ height: '400px', overflowY: 'scroll' }}>
                                    <NightingaleChart dashData={dashData.chartDataProtein} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ) : null}
            </Row>
        </div>
    );
};

export default GraphCard;
