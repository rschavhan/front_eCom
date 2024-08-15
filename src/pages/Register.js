import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        mobileNumber: '',
        email: '',
    });
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username) newErrors.username = 'Username is required.';
        if (!formData.password) newErrors.password = 'Password is required.';
        if (!formData.firstName) newErrors.firstName = 'First name is required.';
        if (!formData.lastName) newErrors.lastName = 'Last name is required.';
        if (!formData.mobileNumber) {
            newErrors.mobileNumber = 'Mobile number is required.';
        } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
            newErrors.mobileNumber = 'Mobile number must be exactly 10 digits long and numeric.';
        }
        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid.';
        }
        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await api.post('/auth/register', formData);
            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            setMessage('Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {errors.username && <p className="error">{errors.username}</p>}
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    {errors.firstName && <p className="error">{errors.firstName}</p>}
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    {errors.lastName && <p className="error">{errors.lastName}</p>}
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="mobileNumber"
                        placeholder="Mobile Number"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                    />
                    {errors.mobileNumber && <p className="error">{errors.mobileNumber}</p>}
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
