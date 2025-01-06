import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, InputGroup, Row, Col, Card, Spinner, Modal } from 'react-bootstrap'; // Import Modal
import { getChatHistory, getChatResponse, getSummary } from '../../api/chat';
import axios from 'axios';
import SourceViewer from './SourceViewer';

const Chatbot = (props) => {
    const [messages, setMessages] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const [loading, setLoading] = useState(false);  // State for loading status
    const [showModal, setShowModal] = useState(false); // State to control the modal visibility
    const chatEndRef = useRef(null); // Reference for scrolling
    const [pdfData, setPdfData] = useState(null);

    useEffect(() => {

        const fetchHistory = async () => {
            try {
                setLoading(true);
                const history = await getChatHistory(props.studyId);

                // Format each message by combining date and time, then converting to Date object
                const formattedHistory = history.flatMap((msg) => {
                    const fullDateTime = `${msg.date} ${msg.time}`; // Combine date and time
                    const timestamp = new Date(fullDateTime);  // Convert to Date object
                    return [
                        {
                            sender: "user",
                            text: msg.question,
                            timestamp: timestamp
                        },
                        {
                            sender: "bot",
                            text: msg.answer, // Use formatted answer if contains "summarize"
                            timestamp: timestamp
                        }
                    ];
                });

                // If there is no history, set a default bot message
                setMessages(formattedHistory.length ? formattedHistory : [{
                    sender: "bot",
                    text: "Hello! How can I help you today?",
                    timestamp: new Date()
                }]);

            } catch (error) {
                console.error("Error fetching chat history:", error);
                setMessages([{ sender: "bot", text: "Error loading chat history.", timestamp: new Date() }]);
            } finally {
                // Set loading to false once the response is received
                setLoading(false);
            }
        };

        fetchHistory();
    }, [props.studyId]);

    const handleSendMessage = async () => {
        if (!userMessage.trim()) return;

        const newMessage = { sender: "user", text: userMessage, timestamp: new Date() };
        setMessages([...messages, newMessage]);
        setUserMessage('');
        setLoading(true);
        try {
            let input = {
                study_id: props.studyId,
                node: [],
                query: userMessage
            };
            const response = await getChatResponse(input);
            let formatted = formatResponseWithLink(response.answer, response.source)

            const botMessage = { sender: "bot", text: formatted, timestamp: response.date + ' ' + response.time };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error fetching chatbot response:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: "Oops! Something went wrong.", timestamp: new Date() },
            ]);
        } finally {
            // Set loading to false once the response is received
            setLoading(false);
        }
    };
    const handleSummary = async () => {

        const newMessage = { sender: "user", text: 'Please explore the summary details here !', timestamp: new Date() };
        setMessages([...messages, newMessage]);
        setLoading(true);

        try {
            const response = await getChatResponse(props.studyId);
            //const response = await getSummary(props.studyId);
            const dataCluster = fetchData(response.answer, response.matrix);
            const botMessage = { sender: "bot", text: dataCluster, timestamp: response.date + ' ' + response.time };

            setMessages((prevMessages) => [...prevMessages, botMessage]);

        } catch (error) {
            console.error("Error fetching chatbot response:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: "Oops! Something went wrong.", timestamp: new Date() },
            ]);
        } finally {
            // Set loading to false once the response is received
            setLoading(false);
        }
    };
    // Scroll to the bottom whenever messages change
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchData = (text, ranges) => {
        const parts = [];
        let lastIndex = 0;

        ranges.forEach((range, index) => {
            const { start_index, end_index, color } = range;

            // Add text before the colored part
            if (lastIndex < start_index) {
                parts.push(
                    <span key={`part_${index}_before`}>
                        {text.substring(lastIndex, start_index)}
                    </span>
                );
            }

            // Add the colored part with background color
            parts.push(
                <span
                    key={`part_${index}_highlight`}
                    style={{ background: color, color: 'white' }}
                >
                    {text.substring(start_index, end_index + 1)}
                </span>
            );

            lastIndex = end_index + 1;
        });

        // Add remaining text
        if (lastIndex < text.length) {
            parts.push(
                <span key={`part_${ranges.length}_remainder`}>
                    {text.substring(lastIndex)}
                </span>
            );
        }

        return <>{parts}</>; // Return the JSX elements wrapped in a fragment
    };
    const formatResponseWithLink = (text, source) => {
        // Check if source is provided and valid
        if (source && source.includes("Source not available for summary")) {
            const [_, fileName, pageNumber] = source.match(/The file name is (\S+) and the page number is (\d+)/);
            return (
                <>
                    {text} <br />
                    <a href="#" onClick={(e) => handleFileClick(fileName)}>
                        View File ({fileName}, Page: {pageNumber})
                    </a>
                </>
            );
        }

        // If source is not available or indicates no summary
        return (
            <>
                {text} <br /><br />
                <span style={{ color: "blue" }}>Source not available for summary</span>
            </>
        );
    };

    const handleFileClick = async (fileName) => {
        const response = await axios.get('http://184.105.215.253:9003/return_source_pdfs/?pdf_filename=Dermatology%2FDerm_Raw%2FRetroNectin%2FExternal%2FASGT.pdf');
        //const response = await axios.get('/api1/return_source_pdfs/?pdf_filename=Dermatology%2FDerm_Raw%2FRetroNectin%2FExternal%2FASGT.pdf');
        setPdfData(response.data);
        setShowModal(true);

    };

    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
        setPdfData(null);
    };

    return (
        <div className="mb-3">
            <Row className="g-3">
                <Col md={12} lg={12}>
                    <Card>
                        <Card.Header>Chatbot</Card.Header>
                        <Card.Body style={{ height: '400px', overflowY: 'scroll' }}>
                            <div>
                                {messages.map((msg, index) => (
                                    <div key={index}>
                                        {/* Display date only above user's message */}
                                        {msg.sender === "user" && (
                                            <div className="text-muted small text-center mb-2">
                                                {new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(msg.timestamp)}
                                            </div>
                                        )}
                                        <div className={`d-flex ${msg.sender === "bot" ? "justify-content-start" : "justify-content-end"} my-1`}>
                                            <div className={`p-2 rounded ${msg.sender === "bot" ? "bg-light text-dark" : "bg-primary text-white"}`} style={{ maxWidth: "60%" }}>
                                                {/* Render HTML content if it's a bot response */}
                                                {msg.sender === "bot" ? (
                                                    <div>{msg.text}</div>
                                                ) : (
                                                    msg.text
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Display spinner only at the bottom when loading */}
                                {loading && (
                                    <div className="d-flex justify-content-center mt-3">
                                        <Spinner animation="border" variant="success" />
                                    </div>
                                )}

                                {/* Dummy div to maintain scroll position */}
                                <div ref={chatEndRef} />
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Type a message..."
                                    value={userMessage}
                                    onChange={(e) => setUserMessage(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") handleSendMessage();
                                    }}
                                />
                                <div className="d-flex">
                                    <Button variant="primary" onClick={handleSendMessage}>
                                        Send
                                    </Button>
                                    <Button variant="success" className="ms-2" onClick={handleSummary}>
                                        Summary
                                    </Button>
                                </div>
                            </InputGroup>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* Modal for displaying file */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <SourceViewer pdfData={pdfData} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Chatbot;
