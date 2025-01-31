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
                // const response = await axios.get('/temp/pico.json');
                const response = await axios.post('http://184.105.215.253:9004/pico_nl/', props.payload);
                //const response = await axios.post('/api2/pico_nl/', props.payload);
                setData(Object.entries(response.data)); // Convert data to array of entries
            } catch (error) {
                setError(error.message || 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [props.payload]);

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
                <Spinner animation="border" variant="success" />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const totalPages = Math.ceil(data.length / rowsPerPage);

    // Define how many pages to show at a time (5 pages)
    const maxPagesToShow = 5;
    const halfWindow = Math.floor(maxPagesToShow / 2);

    // Calculate start and end pages
    let startPage = Math.max(1, page - halfWindow);
    let endPage = Math.min(totalPages, page + halfWindow);

    // Adjust startPage if the window is near the last page
    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

    return (
        <div className="mb-3">
            <Row className="g-3">
                <Col md={12} lg={12}>
                    <Card className="shadow-lg rounded">
                        <Card.Body style={{ padding: '15px' }}>
                            <Col xs={12} md={5} className="card-border-left-blue">
                                <h4 className="text-left text-uppercase" style={{ marginLeft: "12px", marginBottom: "6px" }}>
                                    Pico Study Data
                                </h4>
                            </Col>
                            {data && (
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Document</th>
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
                                {pages.map((pageNumber) => (
                                    <Pagination.Item
                                        key={pageNumber}
                                        active={pageNumber === page}
                                        onClick={() => handlePageChange(pageNumber)}
                                    >
                                        {pageNumber}
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
