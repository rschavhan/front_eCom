import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import '../styles/UserProfile.css';

const UserProfile = () => {
    const { userId } = useContext(AppContext);
    const [userData, setUserData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/user/profile/${userId}`);
                setUserData(response.data);
            } catch (err) {
                setError('Failed to fetch user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/user/profile/${userId}`, userData);
            setUserData(response.data);
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false); // Exit edit mode after successful update
        } catch (err) {
            setError('Failed to update user data.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="user-profile-container">
            <h2>Profile</h2>
            {!isEditing ? (
                <div className="user-info">
                    <p><strong>Username:</strong> {userData.username}</p>
                    <p><strong>First Name:</strong> {userData.firstName}</p>
                    <p><strong>Last Name:</strong> {userData.lastName}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Mobile Number:</strong> {userData.mobileNumber}</p>
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="user-form">
                    <div className="form-group">
                        <label>Username:</label>
                        <input type="text" name="username" value={userData.username} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>First Name:</label>
                        <input type="text" name="firstName" value={userData.firstName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input type="text" name="lastName" value={userData.lastName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" value={userData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Mobile Number:</label>
                        <input type="text" name="mobileNumber" value={userData.mobileNumber} onChange={handleChange} />
                    </div>
                    <button type="submit">Update Profile</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            )}
            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
    );
};

export default UserProfile;
