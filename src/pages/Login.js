import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AppContext } from '../context/AppContext';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password }, { withCredentials: true });
      console.log('Login successful:', response.data);
      const { userName,userId, roles } = response.data;
      console.log("userId: ",userId);
      const roleName = roles.map(role=>role.name)[0];
      console.log("RoleName: ",roleName);
      login(userName,userId, roleName);
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
