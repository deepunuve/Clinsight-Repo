import React, { useState } from 'react';
import { fetchNIHResult } from '../../api/source';
import { Card, Row, Col, Pagination, Button, Popover, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap'; // Bootstrap components
import { FaClipboardList, FaClipboardCheck, FaEye, FaCog, FaMicrochip, FaMousePointer, FaFire } from 'react-icons/fa'; // Using React Icons for icons

const NIH = () => {
    const [condition, setCondition] = useState('');  // State to store the input value
    const [error, setError] = useState('');  // State to store error messages
    const [result, setResult] = useState(null);  // State to store the result from API
    const [loading, setLoading] = useState(false);  // State to manage loading status

    // Handle form input change
    const handleConditionChange = (e) => {
        setCondition(e.target.value);
        setError('');  // Reset error when the user starts typing again
    };
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // You can set this to 5 or other numbers

    // Calculate the current items to display based on the page number
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItemsToShow = result ? result.slice(indexOfFirstItem, indexOfLastItem) : null;

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation to check if condition is empty
        if (!condition.trim()) {
            setError('Condition cannot be empty');
            return;
        }

        setLoading(true);
        setResult(null);  // Reset result while fetching new data

        try {
            // Replace the URL with the actual API endpoint you're calling
            const response = await fetchNIHResult(condition);
            setResult(response);  // Store the result from the API
        } catch (error) {
            setError('Error fetching data from the API');
        } finally {
            setLoading(false);  // Stop loading after the request is complete
        }
    };

    return (
        <div className="dashboard-container"> {/* Updated container class name */}

            {/* Form for condition */}
            <div className="mb-3">
                <Row className="g-3">
                    <Col md={12} sm={12}>
                        <Card>
                            <Card.Body>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            placeholder="Enter condition"
                                            value={condition}
                                            onChange={handleConditionChange}
                                            className={`form-control ${error ? 'is-invalid' : ''}`}
                                        />
                                        {error && <div className="invalid-feedback">{error}</div>}
                                    </div>

                                    <Button variant="primary" type="submit" disabled={loading}>
                                        {loading ? 'Loading...' : 'Submit'}
                                    </Button>
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Display API result or error */}
            {result && (
                <div className="mt-3">
                    {/* Display current items in a grid */}
                    <div className="mb-3">
                        <Row className="g-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6>Total Results: {result.length}</h6>
                            </div>
                            {currentItemsToShow.map((_item, index) => (
                                <Col key={_item.id} xs={12} md={12}>
                                    <Card className="mb-3 shadow-sm rounded border">
                                        <Card.Body>
                                            {/* Title & ID */}
                                            <a variant="link" className="d-flex align-items-center mb-2 text-decoration-none text-primary">
                                                <FaClipboardList className="me-2" />
                                                {_item.id}
                                            </a>
                                            <Card.Title>{_item.title}</Card.Title>

                                            {/* Study Information in a bordered box */}
                                            <div className="border p-3 mb-3">
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="custom-small-font" style={{ paddingBottom: '5px' }}>
                                                            Study Type
                                                        </div>
                                                        <div className="" >
                                                            {_item.study_type}
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="custom-small-font" style={{ paddingBottom: '5px' }}>
                                                            Study Status
                                                        </div>
                                                        <div className="" >
                                                            {_item.study_status}
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="custom-small-font" style={{ paddingBottom: '5px' }}>
                                                            Study Start Date
                                                        </div>
                                                        <div className="" >
                                                            {_item.study_start_date}
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="custom-small-font" style={{ paddingBottom: '5px' }}>
                                                            Study Completion Date
                                                        </div>
                                                        <div className="" >
                                                            {_item.study_completion_date}
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="custom-small-font" style={{ paddingBottom: '5px' }}>
                                                            Primary Completion Date
                                                        </div>
                                                        <div className="" >
                                                            {_item.primary_completion_date}
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="custom-small-font" style={{ paddingBottom: '5px' }}>
                                                            Enrollment
                                                        </div>
                                                        <div className="" >
                                                            {_item.enrollment}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Abstract Link */}
                                            <a variant="link" className="d-flex align-items-center text-decoration-none text-info mb-2">
                                                <FaClipboardCheck className="me-2" />
                                                Abstract
                                            </a>
                                            <Card.Text>{_item.brief_summary}</Card.Text>

                                            {/* Conditions Link */}
                                            <a variant="link" className="d-flex align-items-center text-decoration-none text-info mb-2">
                                                <FaEye className="me-2" />
                                                Conditions
                                            </a>
                                            <Card.Text>{_item.conditions.join(', ')}</Card.Text>

                                            {/* Interventions Link */}
                                            <a variant="link" className="d-flex align-items-center text-decoration-none text-info mb-2">
                                                <FaCog className="me-2" />
                                                Interventions
                                            </a>
                                            <Card.Text>{_item.interventions.join(', ')}</Card.Text>

                                            {/* Popup Links */}
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-start align-items-center border rounded p-3">
                                                    <div className="d-flex align-items-center p-2">
                                                        <FaMicrochip className="me-2" />
                                                        <span>Smart Summary</span>
                                                    </div>

                                                    <span className="separator">|</span>

                                                    <div className="d-flex align-items-center p-2">
                                                        <FaMousePointer className="me-2" />
                                                        <span>Claim Summary</span>
                                                    </div>

                                                    <span className="separator">|</span>

                                                    <div className="d-flex align-items-center p-2">
                                                        <FaFire className="me-2" />
                                                        <span>Family Tree</span>
                                                    </div>
                                                </div>
                                            </div>


                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    {/* Pagination */}
                    <Pagination className="mt-3">
                        {[...Array(Math.ceil(result.length / itemsPerPage))].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>


            )}

            {error && !result && (
                <Row className="g-3">
                    <Col md={12} sm={12}>
                        <Alert variant="danger">
                            {error}
                        </Alert>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default NIH;
