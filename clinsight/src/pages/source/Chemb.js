import React, { useState } from 'react';
import { fetchChempResult } from '../../api/source';
import { Container, Card, Modal, Row, Col, Pagination, Button, Popover, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap'; // Bootstrap components
import { FaClipboardList, FaClipboardCheck, FaEye, FaCog, FaMicrochip, FaMousePointer, FaFire, FaRegEye, FaImage } from 'react-icons/fa'; // Using React Icons for icons
import MolecularViewer from './MolecularViewer';


const Chemb = () => {
    const [condition, setCondition] = useState('');  // State to store the input value
    const [error, setError] = useState('');  // State to store error messages
    const [result, setResult] = useState(null);  // State to store the result from API
    const [loading, setLoading] = useState(false);  // State to manage loading status
    const [showModal, setShowModal] = useState(false); // State to control the modal visibility
    const [showModalSub, setShowModalSub] = useState(false);
    const [molDataMain, setMolDataMain] = useState(null);
    const [molDataSub, setMolDataSub] = useState(null);
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
            const response = await fetchChempResult(condition);
            setResult(response);  // Store the result from the API
        } catch (error) {
            setError('Error fetching data from the API');
        } finally {
            setLoading(false);  // Stop loading after the request is complete
        }
    };

    const handleCloseModal = (index) => {
        setMolDataMain(null);
        setShowModal(false);
    };
    const handleOpen = (smile) => {
        setMolDataMain(smile);
        setShowModal(true);
    };
    const handleOpenSub = (smile) => {
        setMolDataSub(smile);
        setShowModalSub(true);
    };
    const handleCloseModalSub = (index) => {
        setMolDataSub(null);
        setShowModalSub(false);
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
                                            placeholder="Enter a Chemical"
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
                                <Col xs={12} md={12}>
                                    <Card className="mb-3 shadow-sm rounded border">
                                        <Card.Body>
                                            <div className='border-bottom mb-3'>
                                                {/* Title & ID */}
                                                <a variant="link" className="d-flex align-items-center mb-2 text-decoration-none text-primary">
                                                    <FaRegEye className="me-2" />
                                                    <span className="text" >First Approval : {_item.first_approval}</span>
                                                </a>
                                                <a variant="link" className="d-flex align-items-center mb-2 text-decoration-none text-primary">
                                                    <FaImage className="me-2" />
                                                    <span style={{ cursor: "pointer" }} className="text" onClick={(e) => handleOpen(_item.canonical_smiles)}>Canonical Graph</span>
                                                </a>
                                                {/* Study Information in a bordered box */}
                                                <div className="border p-3 mb-3">
                                                    <div className="row">
                                                        <div className="col">
                                                            <div className="custom-small-font" style={{ paddingBottom: '5px' }}>
                                                                Max Phase
                                                            </div>
                                                            <div className="" >
                                                                {_item.max_phase}
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="custom-small-font" style={{ paddingBottom: '5px' }}>
                                                                Molecule Chembl ID
                                                            </div>
                                                            <div className="" >
                                                                {_item.molecule_chembl_id}
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="custom-small-font" style={{ paddingBottom: '5px' }}>
                                                                Full Molformula
                                                            </div>
                                                            <div className="" >
                                                                {_item.full_molformula}
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="custom-small-font" style={{ paddingBottom: '5px' }}>
                                                                Molecular Species
                                                            </div>
                                                            <div className="" >
                                                                {_item.molecular_species}
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="custom-small-font" style={{ paddingBottom: '5px' }}>
                                                                Canonical Smiles
                                                            </div>
                                                            <div className="" >
                                                                {_item.canonical_smiles}
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                                <Modal show={showModal} onHide={handleCloseModal} size="lg" >
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>Molecular Viewer</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <MolecularViewer smiles={molDataMain} />
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <Button variant="secondary" onClick={handleCloseModal}>
                                                            Close
                                                        </Button>
                                                    </Modal.Footer>
                                                </Modal>

                                                <a variant="link" className="d-flex align-items-center text-decoration-none text-info mb-2">
                                                    <FaClipboardCheck className="me-2" />
                                                    Standard Inchi
                                                </a>
                                                <Card.Text> {_item.standard_inchi}</Card.Text>

                                                <a variant="link" className="d-flex align-items-center text-decoration-none text-info mb-2">
                                                    <FaEye className="me-2" />
                                                    Molecule Synonyms
                                                </a>
                                                <Card.Text>{_item.molecule_synonyms.join(', ')}</Card.Text>
                                            </div>
                                            <div style={{ height: "20px" }}></div>
                                            {_item.similar_compounds.length > 0 && (
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h6>Similar Compounds: {_item.similar_compounds.length}</h6>
                                                </div>)}

                                            {_item.similar_compounds.length > 0 &&
                                                _item.similar_compounds.map((_itemS, indexS) => (
                                                    <div className='border-bottom mb-3'>
                                                        <a variant="link" className="d-flex align-items-center mb-2 text-decoration-none text-primary">
                                                            <FaMicrochip className="me-2" />
                                                            {/* <span className="text" onClick={() => handleOpen(index)}>Canonical Graph</span> */}
                                                            <span className="text" >Compounds {indexS + 1}</span>
                                                        </a>
                                                        <a variant="link" className="d-flex align-items-center mb-2 text-decoration-none text-primary">
                                                            <FaImage className="me-2" />
                                                            <span style={{ cursor: "pointer" }} className="text" onClick={(e) => handleOpenSub(_itemS.canonical_smiles)} >Canonical Graph</span>
                                                        </a>
                                                        {/* Study Information in a bordered box */}
                                                        <div className="border p-3 mb-3">
                                                            <div className="row">
                                                                <div className="col">
                                                                    <div className="custom-small-font" style={{ paddingBottom: '5px' }}>
                                                                        Max Phase
                                                                    </div>
                                                                    <div className="" >
                                                                        {_itemS.max_phase}
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="custom-small-font" style={{ paddingBottom: '5px' }}>
                                                                        Molecule Chembl ID
                                                                    </div>
                                                                    <div className="" >
                                                                        {_itemS.molecule_chembl_id}
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="custom-small-font" style={{ paddingBottom: '5px' }}>
                                                                        Full Molformula
                                                                    </div>
                                                                    <div className="" >
                                                                        {_itemS.full_molformula}
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="custom-small-font" style={{ paddingBottom: '5px' }}>
                                                                        Molecular Species
                                                                    </div>
                                                                    <div className="" >
                                                                        {_itemS.molecular_species}
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="custom-small-font" style={{ paddingBottom: '5px' }}>
                                                                        Canonical Smiles
                                                                    </div>
                                                                    <div className="" >
                                                                        {_itemS.canonical_smiles}
                                                                    </div>
                                                                </div>
                                                                <Modal show={showModalSub} onHide={handleCloseModalSub} size="lg">
                                                                    <Modal.Header closeButton>
                                                                        Molecular Viewer
                                                                    </Modal.Header>
                                                                    <Modal.Body>
                                                                        <MolecularViewer smiles={molDataSub} />
                                                                    </Modal.Body>
                                                                    <Modal.Footer>
                                                                        <Button variant="secondary" onClick={handleCloseModalSub}>
                                                                            Close
                                                                        </Button>
                                                                    </Modal.Footer>
                                                                </Modal>
                                                            </div>
                                                        </div>
                                                        <a variant="link" className="d-flex align-items-center text-decoration-none text-info mb-2">
                                                            <FaClipboardCheck className="me-2" />
                                                            Standard Inchi
                                                        </a>
                                                        <Card.Text> {_itemS.standard_inchi}</Card.Text>

                                                        <a variant="link" className="d-flex align-items-center text-decoration-none text-info mb-2">
                                                            <FaEye className="me-2" />
                                                            Molecule Synonyms
                                                        </a>
                                                        <Card.Text>{_itemS.molecule_synonyms?.join(', ')}</Card.Text>
                                                    </div>
                                                ))}
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


            )
            }
            {
                error && !result && (
                    <Row className="g-3">
                        <Col md={12} sm={12}>
                            <Alert variant="danger">
                                {error}
                            </Alert>
                        </Col>
                    </Row>
                )
            }
        </div >
    );
};

export default Chemb;
