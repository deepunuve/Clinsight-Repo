// src/components/UserTable.js
import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <Table striped bordered hover responsive className="mt-3">
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <Button variant="warning" size="sm" onClick={() => onEdit(user)} className="me-2">
                <FontAwesomeIcon icon={faEdit} /> Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => onDelete(user.id)}>
                <FontAwesomeIcon icon={faTrash} /> Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserTable;
