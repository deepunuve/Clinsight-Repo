import React, { useEffect, useState } from 'react';
import { Table, Spinner, Button, Card, Row, Col } from 'react-bootstrap';
import { getSummary } from '../../api/chat';

function Summary(props) {
    const [data, setData] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if there's saved data in sessionStorage
        const savedData = sessionStorage.getItem('summaryData');
        if (savedData) {
            setData(savedData);
            setIsLoading(false);
        } else {
            fetchData(); // Fetch from API if no saved data
        }
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getSummary(props.studyId);
            const dataCluster = matcrixData(response.answer, response.matrix);
            setData(dataCluster);

            // Save the fetched data to sessionStorage
            sessionStorage.setItem('summaryData', dataCluster);
        } catch (error) {
            setError(error.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const matcrixData = (text, ranges) => {
        const parts = [];
        let lastIndex = 0;
        ranges.forEach((range, index) => {
            const { start_index, end_index, color } = range;
            // Add text before the colored part
            parts.push(
                '<span key={"part_' + index + '_before"}>' +
                text.substring(lastIndex, start_index) +
                '</span>'
            );
            // Add the colored part with background color
            parts.push(
                '<span key="part_' + index + '_colored" style="background:' + color + ';color:white;">' +
                text.substring(start_index, end_index + 1) +
                '</span>'
            );
            lastIndex = end_index + 1;
        });
        // Add remaining text
        parts.push(
            '<span key={"part_' + ranges.length + '_remainder"}>' +
            text.substring(lastIndex) +
            '</span>'
        );

        return parts.join(''); // Return the string
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                 <Spinner animation="border" variant="success" />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="mb-3">
            <Row className="g-3">
                <Col md={12} lg={12}>
                    <Card className="shadow-lg rounded">
                        <Card.Body style={{ padding: '15px' }}>
                            <div dangerouslySetInnerHTML={{ __html: data }}></div>
                            <Button
                                variant="primary"
                                className="mt-3"
                                onClick={fetchData}
                            >
                                Refresh
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Summary;
