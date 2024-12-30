// CreateAccount.tsx
import React, { useState } from "react";

// Importa a função e a interface do serviço
import { createAccountRequest, CreateAccountFormData } from "../modules/UserService";

// 1. Importe o arquivo CSS
import "../styles/CreateAccountStyle.css";

const CreateAccount: React.FC = () => {
  const [formData, setFormData] = useState<CreateAccountFormData>({
    username: "",
    email: "",
    password: "",
    age: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      // Agora chamamos a função do service
      const response = await createAccountRequest(formData);
      setMessage(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar conta.");
    }
  };

  return (
    <div className="create-account-container">
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit} className="create-account-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="create-account-input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="create-account-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="create-account-input"
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="create-account-input"
        />
        <button type="submit" className="create-account-button">
          Create Account
        </button>
      </form>
      {message && <p className="create-account-success">{message}</p>}
      {error && <p className="create-account-error">{error}</p>}
    </div>
  );
};

export default CreateAccount;
