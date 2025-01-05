import React, { useState, useEffect } from 'react';
import { Form, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';

const SourceDocumentSelector = (props) => {
    const { pdfList, onSelectionChange } = props; // Callback function from the parent

    // Initialize selectedPDFs based on the initial pdfList where selected: true
    const [selectedPDFs, setSelectedPDFs] = useState(
        pdfList.filter(pdf => pdf.selected).map(pdf => ({ id: pdf.id, name: pdf.source_name }))
    );
    const [selectAll, setSelectAll] = useState(pdfList.every(pdf => pdf.selected));

    // Sync selectedPDFs with pdfList whenever pdfList changes
    useEffect(() => {
        setSelectedPDFs(
            pdfList.filter(pdf => pdf.selected).map(pdf => ({ id: pdf.id, name: pdf.source_name }))
        );
    }, [pdfList]);

    // Handle individual checkbox change
    const handleCheckboxChange = (id) => {
        setSelectedPDFs((prevSelected) => {
            const isAlreadySelected = prevSelected.some(pdf => pdf.id === id);

            // Add or remove the selected PDF
            const updatedSelection = isAlreadySelected
                ? prevSelected.filter((pdf) => pdf.id !== id)
                : [...prevSelected, { id, name: pdfList.find(pdf => pdf.id === id).source_name }];

            onSelectionChange(updatedSelection); // Notify parent with updated selection
            return updatedSelection;
        });
    };

    // Handle select all
    const handleSelectAll = () => {
        const allSelected = pdfList.map((pdf) => ({ id: pdf.id, name: pdf.source_name }));
        setSelectedPDFs(allSelected);
        onSelectionChange(allSelected); // Notify parent with all selected PDFs
    };

    // Handle select none
    const handleSelectNone = () => {
        setSelectedPDFs([]);
        onSelectionChange([]); // Notify parent with an empty selection
    };

    // Helper function to truncate text
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    return (
        <div className="documentSelector">
            <Row className="align-items-left">
                <div style={{ height: "10px" }}></div>
                <Col md={5} className="text-left" style={{ color: 'black' }}>
                    Select:
                </Col>
                <Col md={3} className="text-left" style={{ color: '#0070c0' }}>
                    <span onClick={handleSelectAll}>All</span>
                </Col>
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
                        }}>
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
                                        <span className="text-truncate">{truncateText(pdf.source_name, 15)}</span>
                                    </OverlayTrigger>
                                }
                                checked={selectedPDFs.some(selected => selected.id === pdf.id)}
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
