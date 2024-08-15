import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AppContext } from '../context/AppContext';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password }, { withCredentials: true });
      console.log('Login successful:', response.data);
      const { userName, userId, roles } = response.data;
      console.log("userId: ", userId);
      const roleName = roles.map(role => role.name)[0];
      console.log("RoleName: ", roleName);
      login(userName, userId, roleName);
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
