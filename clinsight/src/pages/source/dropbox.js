import React, { useState } from 'react';
import { transferFilesFromDopBox } from '../../api/source';
import { Container, Card, Modal, Row, Col, Pagination, Button, Popover, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap'; // Bootstrap components
import { FaClipboardList, FaClipboardCheck, FaEye, FaCog, FaMicrochip, FaMousePointer, FaFire, FaRegEye, FaImage } from 'react-icons/fa'; // Using React Icons for icons
import MolecularViewer from './MolecularViewer';


const Dropbox = () => {
    const [folderId, setFolderId] = useState('');  // State to store the input value
    const [token, setToken] = useState('');  // State to store the input value
    const [error, setError] = useState('');  // State to store error messages
    const [folderError, setFolderError] = useState('');  // State to store error messages
    const [ferror, setFerror] = useState('');  // State to store error messages
    const [result, setResult] = useState(null);  // State to store the result from API
    const [loading, setLoading] = useState(false);  // State to manage loading status

    // Handle form input change
    const handleConditionChange = (e) => {
        setToken(e.target.value);
        setError('');  // Reset error when the user starts typing again
    };
    const handleFIdChange = (e) => {
        setFolderId(e.target.value);
        setFolderError('');  // Reset error when the user starts typing again
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation to check if condition is empty
        if (!token.trim()) {
            setError('Token cannot be empty');
            return;
        }
        if (!folderId.trim()) {
            setFolderError('Dropbox folder path cannot be empty');
            return;
        }
        setLoading(true);
        setResult(null);  // Reset result while fetching new data

        try {

            // Replace the URL with the actual API endpoint you're calling
            const response = await transferFilesFromDopBox(token, folderId);
            if (response)
                setResult(response);
            else
                setFerror('Error fetching data from the API');

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
                                            placeholder="Enter dropbox api token"
                                            value={token}
                                            onChange={handleConditionChange}
                                            className={`form-control ${error ? 'is-invalid' : ''}`}
                                        />
                                        {error && <div className="invalid-feedback">{error}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            placeholder="Enter dropbox folder identifier"
                                            value={folderId}
                                            onChange={handleFIdChange}
                                            className={`form-control ${folderError ? 'is-invalid' : ''}`}
                                        />
                                        {folderError && <div className="invalid-feedback">{folderError}</div>}
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
                                <h6>{result}</h6>
                            </div>

                        </Row>
                    </div>
                </div>
            )
            }
            {
                ferror && !result && (
                    <Row className="g-3">
                        <Col md={12} sm={12}>
                            <Alert variant="danger">
                                {ferror}
                            </Alert>
                        </Col>
                    </Row>
                )
            }
        </div >
    );
};

export default Dropbox;
