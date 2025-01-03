import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner, Pagination, Card, Row, Col } from 'react-bootstrap';

function Pico(props) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); // Starting from page 1
    const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sid = props.payload.study_id ? parseInt(props.payload.study_id, 10) : NaN; // Default to NaN if `studyId` is falsy

                // Log for debugging
                console.log('Converted study_id:', sid);

                const input = {
                    study_id: sid, // Use a default value (0) or handle error if `sid` is NaN
                    doc_type: props.payload.doc_type,
                    entity_type: props.payload.entity_type
                };
                const response = await axios.get('/api2/pico?study_id=24579');
                //const response = await axios.post('/api2/pico_nl', input);
                //const response = await axios.get('/temp/pico.json');
                setData(Object.entries(response.data)); // Convert data to array of entries
            } catch (error) {
                setError(error.message || 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1); // Reset to first page when rows per page change
    };

    const indexOfLast = page * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentData = data.slice(indexOfFirst, indexOfLast);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status" />
                <span>Loading...</span>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const totalPages = Math.ceil(data.length / rowsPerPage);

    return (
        <div className="mb-3">
            <Row className="g-3">
                <Col md={12} lg={12}>
                    <Card className="shadow-lg rounded">
                        <Card.Body style={{ padding: '15px' }}>
                            <h6 className="my-4">Pico Study Data</h6>
                            {data && (
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>PDF</th>
                                            <th className="text-Left">Population</th>
                                            <th className="text-Left">Intervention</th>
                                            <th className="text-Left">Comparison</th>
                                            <th className="text-Left">Outcome</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map(([key, value]) => (
                                            <tr key={key}>
                                                <td>{key}</td>
                                                <td className="text-Left">{value.P}</td>
                                                <td className="text-Left">{value.I}</td>
                                                <td className="text-Left">{value.C}</td>
                                                <td className="text-Left">{value.O}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                            <Pagination className="justify-content-center">
                                <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <Pagination.Item key={index} active={index + 1 === page} onClick={() => handlePageChange(index + 1)}>
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
                            </Pagination>
                            <div className="d-flex justify-content-end my-3">
                                <select className="form-select" value={rowsPerPage} onChange={handleRowsPerPageChange}>
                                    <option value={5}>5 rows per page</option>
                                    <option value={10}>10 rows per page</option>
                                    <option value={25}>25 rows per page</option>
                                </select>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Pico;
