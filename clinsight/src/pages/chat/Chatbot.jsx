// src/components/Chatbot.js
import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, InputGroup, Row, Col, Card } from 'react-bootstrap';
import { getChatHistory, getChatResponse, saveChatHistory } from '../../api/chat';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const chatEndRef = useRef(null); // Reference for scrolling

    // Helper function to parse "September 3, 2024 at 5:15:10 PM" into a Date object
    function parseCustomDate(dateStr) {
        const [datePart, timePart] = dateStr.split(" at ");
        const date = new Date(`${datePart}, ${timePart}`);
        return isNaN(date) ? new Date() : date;
    }

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getChatHistory();

                const formattedHistory = history.flatMap((msg) => ([
                    { sender: "user", text: msg.question, timestamp: parseCustomDate(msg.date) },
                    { sender: "bot", text: msg.answer, timestamp: parseCustomDate(msg.date) }
                ]));

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
    }, []);

    const handleSendMessage = async () => {
        if (!userMessage.trim()) return;

        const newMessage = { sender: "user", text: userMessage, timestamp: new Date() };
        setMessages([...messages, newMessage]);

        setUserMessage('');

        try {
            const response = await getChatResponse(userMessage);
            const botMessage = { sender: "bot", text: response.answer, timestamp: new Date() };

            // Save the chat history to the server after getting the bot's response
            // await saveChatHistory(userMessage, response.answer);  // Save to API

            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error fetching chatbot response:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: "Oops! Something went wrong.", timestamp: new Date() },
            ]);
        }
    };

    // Scroll to the bottom whenever messages change
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

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
                                                {msg.text}
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
