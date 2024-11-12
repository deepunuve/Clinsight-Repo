import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const Sources = () => {
    const firstRowLogos = [
        { src: "/images/dash/oracle.png", alt: "Oracle", disabled: true, link: '' },
        { src: "/images/dash/medidata.png", alt: "Medidata", disabled: true, link: '' },
        { src: "/images/dash/Teradata_.png", alt: "Teradata", disabled: true, link: '' },
        { src: "/images/dash/postgrel.png", alt: "PostgreSQL", disabled: false, link: '' },
        { src: "/images/dash/mysql.png", alt: "MySQL", disabled: false, link: '' },
    ];
    const secondRowLogos = [
        { src: "/images/dash/NIH.png", alt: "NIH", disabled: false, link: '/nih' },
        { src: "/images/dash/chembl.png", alt: "Chembl", disabled: false, link: '' },
        { src: "/images/dash/pubmed.png", alt: "PubMed", disabled: false, link: '/pubmed' },
        { src: "/images/dash/drugbank.png", alt: "DrugBank", disabled: true, link: '' },
        { src: "/images/dash/Snomed.png", alt: "Snomed", disabled: true, link: '' },
    ];


    return (
        <div className="dashboard-container"> {/* Updated container class name */}

            <div className="mb-3">
                <Row className="g-3">
                    <Col md={6} sm={12}>
                        <Card className='card-border-blue'>
                            <Card.Body>
                                <p className="text-muted mb-4">Do you want to enrich your information with internal sources</p>

                                {/* First Row for the first 3 logos */}
                                <Row className="g-4 d-flex justify-content-start">
                                    {firstRowLogos.map((logo, index) => (
                                        <Col key={index} xs={6} sm={4} md={4} lg={4} className="mb-4">
                                            <Card
                                                className={`card-hover-source shadow-lg rounded-3 ${logo.disabled ? 'bg-light' : 'bg-white'}`}
                                                style={{
                                                    cursor: logo.disabled ? 'not-allowed' : 'pointer',
                                                    height: '200px', // Fixed height for all cards
                                                    display: 'flex',
                                                    width: '100%', // Make cards responsive
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    transition: 'transform 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => { if (!logo.disabled) e.currentTarget.style.transform = 'scale(1.05)'; }}
                                                onMouseLeave={(e) => { if (!logo.disabled) e.currentTarget.style.transform = 'scale(1)'; }}
                                            >
                                                <Card.Body className="d-flex justify-content-center align-items-center p-3 ">
                                                    <img
                                                        src={logo.src}
                                                        alt={logo.alt}
                                                        className="img-fluid"
                                                        style={{
                                                            maxWidth: '120px',
                                                            maxHeight: '80px',
                                                            objectFit: 'contain'
                                                        }}
                                                    />
                                                </Card.Body>
                                                <Card.Footer className="text-center">
                                                    <small className="text-muted">{logo.alt}</small>
                                                </Card.Footer>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6} sm={12}>
                        <Card className='card-border-orange'>
                            <Card.Body>
                                <p className="text-muted mb-4">Do you want to enrich your information with external knowledge base</p>

                                {/* Second Row for the remaining logos */}
                                <Row className="g-4 d-flex justify-content-start">
                                    {secondRowLogos.map((logo, index) => (
                                        <Col key={index} xs={6} sm={4} md={4} lg={4} className="mb-4">
                                            <Card
                                                className={`card-hover-source shadow-lg rounded-3 ${logo.disabled ? 'bg-light' : 'bg-white'}`}
                                                style={{
                                                    cursor: logo.disabled ? 'not-allowed' : 'pointer',
                                                    height: '200px', // Fixed height for all cards
                                                    display: 'flex',
                                                    width: '100%', // Make cards responsive
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    transition: 'transform 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => { if (!logo.disabled) e.currentTarget.style.transform = 'scale(1.05)'; }}
                                                onMouseLeave={(e) => { if (!logo.disabled) e.currentTarget.style.transform = 'scale(1)'; }}
                                            >
                                                <Card.Body className="d-flex justify-content-center align-items-center p-3">
                                                    <a href={logo.link}>
                                                        <img
                                                            src={logo.src}
                                                            alt={logo.alt}
                                                            className="img-fluid"
                                                            style={{
                                                                maxWidth: '120px',
                                                                maxHeight: '80px',
                                                                objectFit: 'contain'
                                                            }}
                                                        />
                                                    </a>
                                                </Card.Body>
                                                <Card.Footer className="text-center">
                                                    <small className="text-muted">{logo.alt}</small>
                                                </Card.Footer>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Sources;
