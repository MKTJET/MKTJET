import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const usersKey = 'registeredUsers';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    cpfCnpj: '',
    phone: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const validateCPF_CNPJ = (value) => {
    return /^(\d{11}|\d{14})$/.test(value);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem(usersKey)) || [];

    if (!validateCPF_CNPJ(formData.cpfCnpj)) {
      setError('CPF ou CNPJ inválido');
      return;
    }

    if (users.find((u) => u.username === formData.username)) {
      setError('Nome de usuário já existe');
      return;
    }

    const newUser = { ...formData };
    users.push(newUser);
    localStorage.setItem(usersKey, JSON.stringify(users));
    navigate('/');
  };

  return (
    <div className="auth-container">
      <h2>Cadastro</h2>
      <form onSubmit={handleRegister}>
        <label>Nome Completo:</label>
        <input type="text" name="fullName" required onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />

        <label>E-mail:</label>
        <input type="email" name="email" required onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

        <label>CPF ou CNPJ:</label>
        <input type="text" name="cpfCnpj" required onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })} />

        <label>Telefone:</label>
        <input type="text" name="phone" required onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />

        <label>Nome de Usuário:</label>
        <input type="text" name="username" required onChange={(e) => setFormData({ ...formData, username: e.target.value })} />

        <label>Senha:</label>
        <input type="password" name="password" required onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

        <button type="submit">Cadastrar</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default RegisterPage;
