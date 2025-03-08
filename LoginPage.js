import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const usersKey = 'registeredUsers';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem(usersKey)) || [];
    const user = users.find((u) => u.username === username && u.password === password);
    
    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      navigate('/upload');
    } else {
      setError('Usuário ou senha incorretos');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Nome de usuário:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>Senha:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Entrar</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p>Não tem uma conta? <a href="/register">Cadastre-se</a></p>
    </div>
  );
}

export default LoginPage;
