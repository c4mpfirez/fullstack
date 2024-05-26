import React, { useState } from 'react';
import loginService from '../services/login';

const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      onLoginSuccess(user);
    } catch (error) {
      //console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      Username: <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
