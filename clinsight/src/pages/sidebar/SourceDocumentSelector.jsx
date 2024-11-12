import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, ListGroup, Button, Container } from 'react-bootstrap';

const SourceDocumentSelector = (props) => {
    const pdfList = props.pdfList;

    // Initialize selectedPDFs state from the pdfList based on the 'selected' field
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
    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedPDFs([]);  // Deselect all
        } else {
            setSelectedPDFs(pdfList.map((pdf) => pdf.id));  // Select all
        }
        setSelectAll(!selectAll);  // Toggle selectAll state
    };

    return (
        <div className="mt-4">           
            <p className="text-muted mb-4">Choose the documents you'd like to include.</p>

            {/* Select All Checkbox */}
            <Form.Check
                type="checkbox"
                label="Select All"
                checked={selectAll}
                onChange={handleSelectAllChange}
                className="mb-4"
                style={{ cursor: 'pointer' }}
            />

            {/* List of PDFs with individual checkboxes */}
            <ListGroup variant="flush">
                {pdfList.map((pdf) => (
                    <ListGroup.Item
                        key={pdf.id}
                        className={`d-flex justify-content-between align-items-center border-0 p-2 mb-3 rounded-3 shadow-lg ${selectedPDFs.includes(pdf.id) ? 'bg-light-blue text-white' : 'bg-white'}`}
                        style={{
                            // Remove fixed height, allowing the container to grow based on content
                            padding: '10px 15px',
                            lineHeight: '1.5',  // Control the line height for better readability
                            wordWrap: 'break-word',  // Ensure long names wrap correctly
                        }}
                    >
                        <Form.Check
                            type="checkbox"
                            label={
                                <span className="text-truncate d-block" style={{ maxWidth: '300px', whiteSpace: 'normal' }}>
                                    {pdf.source_name}
                                </span>
                            }
                            checked={selectedPDFs.includes(pdf.id)}
                            onChange={() => handleCheckboxChange(pdf.id)}
                            className="fs-6"
                            style={{ cursor: 'pointer' }}
                        />
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default SourceDocumentSelector;
