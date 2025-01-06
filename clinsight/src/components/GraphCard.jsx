// GraphCard.js
import React, { useEffect, useState } from 'react';
import { Col, Row, Card } from 'react-bootstrap';
import NightingaleChart from '../pages/chart/NightingaleChart';

const GraphCard = ({ dashData }) => {
    const [chartData, setChartData] = useState([]);
    useEffect(() => {
        if (dashData) {
            setChartData(dashData);
        }
    }, [dashData]);

    return (
        <div className="mb-3">
            <Row className="g-3">
                {chartData.chart && chartData.chart.map((chartItem) => (
                    <Col md={4} lg={4} key={chartItem.id}>
                        <Card className="shadow-lg rounded card-border-blue">
                            <Card.Body style={{ background: "#fff" }}>
                                <Card.Title className="h6 text-center">
                                    Summary Of Top Five {chartItem.name}
                                </Card.Title>
                                <div style={{ height: '400px', overflowY: 'scroll' }}>
                                    {/* Render the chart dynamically based on the chart type */}
                                    <NightingaleChart dashData={chartItem} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default GraphCard;
