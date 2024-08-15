import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api'; // Import the api instance
import '../styles/UserManager.css'; // Import the CSS file

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState({}); // Manage user roles
  const [error, setError] = useState(null); // For error messages

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users'); // Fetch users with roles
      setUsers(response.data);

      // Initialize roles state with fetched data
      const initialRoles = response.data.reduce((acc, user) => {
        const userRole = user.roles.find(role => role.name === 'ADMIN') ? 'ADMIN' : 'USER'; // Adjust based on your data structure
        acc[user.id] = userRole;
        return acc;
      }, {});
      setRoles(initialRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users.');
    }
  };

  const deleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`); // Delete user by ID
      setUsers(users.filter(user => user.id !== userId)); // Remove deleted user from state
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user.');
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setRoles({
      ...roles,
      [userId]: newRole,
    });
  };

  const handleUpdateRole = async (userId) => {
    const newRole = roles[userId];
    const newRoleId = newRole === 'ADMIN' ? 1 : 2; // Assuming role IDs are 1 for ADMIN and 2 for USER

    try {
      await api.put('/admin/users/update-role', { userId, newRoleId });
      fetchUsers(); // Refresh the user list after updating role
    } catch (error) {
      console.error('Error updating user role:', error);
      setError('Failed to update user role.');
    }
  };

  return (
    <div className="user-manager">
      <h1>User Manager</h1>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Change Role</th> {/* New column for changing roles */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>
                {user.roles.map(role => role.name).join(', ')}
              </td>
              <td>
                <select value={roles[user.id] || 'USER'} onChange={(e) => handleRoleChange(user.id, e.target.value)}>
                  <option value="ADMIN">Admin</option>
                  <option value="USER">User</option>
                </select>
                <button onClick={() => handleUpdateRole(user.id)}>Update Role</button>
              </td>
              <td>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManager;
