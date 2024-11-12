// src/pages/AdminUserPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import UserTable from '../../components/UserTable';
import { getUsers } from '../../api/user';

const AdminUserPage = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getUsers();  // Update with your API endpoint
            setUsers(response);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`/api/users/${userId}`);
            setUsers(users.filter(user => user.id !== userId));  // Remove deleted user from local state
        } catch (error) {
            console.error("Error deleting user", error);
        }
    };

    const handleSave = async () => {
        try {
            if (selectedUser.id) {
                await axios.put(`/api/users/${selectedUser.id}`, selectedUser);
            } else {
                const response = await axios.post('/api/users', selectedUser);
                setUsers([...users, response.data]);
            }
            setShowModal(false);
            setSelectedUser(null);
        } catch (error) {
            console.error("Error saving user", error);
        }
    };

    return (
        <div className="dashboard-container"> {/* Updated container class name */}

            <Row className="g-4">
                <Col md={12} lg={12}>
                    <Card className=" p-4 mb-4 ">
                        <Card.Body>
                            <Button variant="primary" onClick={() => handleEdit({})}>Add User</Button>

                            <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>{selectedUser?.id ? 'Edit User' : 'Add User'}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={selectedUser?.username || ''}
                                                onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={selectedUser?.email || ''}
                                                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Role</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={selectedUser?.role || ''}
                                                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                                    <Button variant="primary" onClick={handleSave}>Save</Button>
                                </Modal.Footer>
                            </Modal>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminUserPage;
