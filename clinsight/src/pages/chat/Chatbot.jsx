import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, InputGroup, Row, Col, Card, Spinner } from 'react-bootstrap'; // Import Spinner for loader
import { getChatHistory, getChatResponse } from '../../api/chat';

const Chatbot = (props) => {
    const [messages, setMessages] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const [loading, setLoading] = useState(false);  // State for loading status
    const chatEndRef = useRef(null); // Reference for scrolling

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getChatHistory(props.studyId);

                // Format each message by combining date and time, then converting to Date object
                const formattedHistory = history.flatMap((msg) => {
                    const fullDateTime = `${msg.date} ${msg.time}`; // Combine date and time
                    const timestamp = new Date(fullDateTime);  // Convert to Date object

                    // Check if msg.answer contains the word "summarize"
                    let formattedAnswer = msg.answer;
                    if (msg.question.toLowerCase().includes("summarize")) {
                        // Process the answer using fetchData if it contains "summarize"
                        const ranges = [
                            { start_index: 10, end_index: 18, color: "yellow" },
                            { start_index: 30, end_index: 40, color: "green" }
                        ]; // Example ranges, modify based on your needs
                        formattedAnswer = fetchData(msg.answer, ranges);
                        console.log(formattedAnswer);
                        console.log("ccc");
                    }

                    return [
                        {
                            sender: "user",
                            text: msg.question,
                            timestamp: timestamp
                        },
                        {
                            sender: "bot",
                            text: formattedAnswer, // Use formatted answer if contains "summarize"
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
            }
        };

        fetchHistory();
    }, [props.studyId]);

    const handleSendMessage = async () => {
        if (!userMessage.trim()) return;

        const newMessage = { sender: "user", text: userMessage, timestamp: new Date() };
        setMessages([...messages, newMessage]);
        setUserMessage('');

        // Set loading to true while waiting for the chatbot's response
        setLoading(true);

        try {
            let input = {
                study_id: props.studyId,
                node: [],
                query: userMessage
            };

            const response = await getChatResponse(input);
            const botMessage = { sender: "bot", text: response.answer, timestamp: response.date + ' ' + response.time };

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
        ranges.map((range, index) => {
            const { start_index, end_index, color } = range;
            // Add text before the colored part
            parts.push(
                '<span key={"part_' + index + '_before"}>' +
                text.substring(lastIndex, start_index) +
                '</span>'
            );
            // Add the colored part with background color
            parts.push(
                '<span style="background:' + color + ';color:white;">' +
                text.substring(start_index, end_index + 1) +
                '</span>'
            );
            lastIndex = end_index + 1;
        });
        // Add remaining text
        parts.push(
            '<span key={"part_' + ranges.length + '_remainder"}>' +
            text.substring(lastIndex) +
            '</span>'
        );
        return parts.join(''); // Return the JSX elements created
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
                                                    <div dangerouslySetInnerHTML={{ __html: msg.text }} />
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
                                        <Spinner animation="border" variant="primary" />
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
                                        if (e.key === 'Enter') handleSendMessage();
                                    }}
                                />
                                <Button variant="primary" onClick={handleSendMessage}>
                                    Send
                                </Button>
                            </InputGroup>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Chatbot;
