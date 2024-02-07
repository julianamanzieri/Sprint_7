// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (userName.trim() !== "") {
      onLogin(userName); // Actualiza el estado de isLoggedIn en el componente App
      navigate('/chats'); // Redirige al usuario
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Enter your name" value={userName} onChange={(e) => setUserName(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
