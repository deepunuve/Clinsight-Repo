import React, { useState } from 'react';
import { Form, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Row, Col, Button } from 'react-bootstrap';
const SourceDocumentSelector = (props) => {
    const pdfList = props.pdfList;

    const [selectedPDFs, setSelectedPDFs] = useState(
        pdfList.filter(pdf => pdf.selected).map(pdf => pdf.id)  // Select PDFs that are marked as 'selected: true'
    );
    const [selectAll, setSelectAll] = useState(pdfList.every(pdf => pdf.selected));  // Check if all PDFs are initially selected

    // Handle individual checkbox change
    const handleCheckboxChange = (id) => {
        setSelectedPDFs((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((pdfId) => pdfId !== id);  // Remove from selected
            } else {
                return [...prevSelected, id];  // Add to selected
            }
        });
    };

    // Handle select/deselect all
    const handleSelectAll = () => {
        setSelectedPDFs(pdfList.map((pdf) => pdf.id));
    };
    const handleSelectNone = () => {
        setSelectedPDFs([]);
    };
    // Helper function to truncate text
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    return (
        <div className="documentSelector" >
            <Row className="align-items-left" >
                {/* First Column: Select Dropdown */}
                <div style={{ height: "10px" }}></div>
                <Col md={5} className="text-left" style={{ color: 'black' }}>
                    Select:
                </Col>

                {/* Second Column: All Button */}
                <Col md={3} className="text-left" style={{ color: '#0070c0' }}>
                    <span onClick={handleSelectAll}>All</span>
                </Col>

                {/* Third Column: None Button */}
                <Col md={4} className="text-left" style={{ color: '#0070c0' }}>
                    <span onClick={handleSelectNone}>None</span>
                </Col>
                <div style={{ height: "10px" }}></div>
            </Row>
            {/* List of PDFs */}
            <ListGroup variant="flush">
                {pdfList.map((pdf) => (
                    <ListGroup.Item
                        key={pdf.id}
                        className="mb-2"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02)';
                            e.currentTarget.style.boxShadow = '0px 6px 10px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
                        }} >
                        {/* Checkbox with Tooltip */}
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>{pdf.source_name}</Tooltip>}
                        >
                            <Form.Check
                                type="checkbox"
                                label={
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>{pdf.source_name}</Tooltip>}
                                    >
                                        <span
                                            className="text-truncate "
                                        >
                                            {truncateText(pdf.source_name, 15)}
                                        </span>
                                    </OverlayTrigger>
                                }
                                checked={selectedPDFs.includes(pdf.id)}
                                onChange={() => handleCheckboxChange(pdf.id)}
                                style={{ cursor: 'pointer' }}
                            />
                        </OverlayTrigger>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default SourceDocumentSelector;
