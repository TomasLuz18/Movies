import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  deleteAccount,
  updateName,
  updatePassword,
} from "../modules/UserService";

// 1. Importe o CSS
import "../styles/EditAccountStyle.css";

const EditAccount: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user?.username || "Nome do Usuário");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const toggleEditName = () => {
    setIsEditingName(!isEditingName);
  };

  const toggleEditPassword = () => {
    setIsEditingPassword(!isEditingPassword);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "currentPassword") setCurrentPassword(value);
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  // ======================================
  // Chamada ao service: deleteAccount()
  // ======================================
  const handleDeleteAccount = async () => {
    const confirma = window.confirm(
      "Tem certeza que deseja apagar a conta? Esta ação é irreversível."
    );
    if (!confirma) return;

    try {
      await deleteAccount(); // <-- Chama a função do service
      alert("Conta apagada com sucesso!");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Erro ao apagar a conta.");
    }
  };

  // ======================================
  // Chamada ao service: updateName()
  // ======================================
  const saveName = async () => {
    try {
      await updateName(name); // <-- Chama a função do service
      alert("Nome atualizado com sucesso!");
      toggleEditName();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar o nome.");
    }
  };

  // ======================================
  // Chamada ao service: updatePassword()
  // ======================================
  const savePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("As passwords não coincidem.");
      return;
    }

    try {
      await updatePassword(currentPassword, newPassword); // <-- Chama a função do service
      alert("Password alterada com sucesso!");
      toggleEditPassword();
    } catch (err) {
      console.error(err);
      alert("Erro ao alterar a password.");
    }
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Editar Conta</h1>

      <div className="card">
        {/* Seção de Nome */}
        <div className="section">
          <label className="label">Nome:</label>
          <div className="inline">
            {isEditingName ? (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="input"
                />
                <button className="save-button" onClick={saveName}>
                  Guardar
                </button>
                <button className="cancel-button" onClick={toggleEditName}>
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className="text">{name}</span>
                <button className="edit-button" onClick={toggleEditName}>
                  Editar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Seção de Email */}
        <div className="section">
          <label className="label">Email:</label>
          <input
            type="email"
            value={user?.email || "email@exemplo.com"}
            readOnly
            className="input readonly-input" 
          />
        </div>

        {/* Seção de Alteração de Password */}
        <div className="section">
          <h2 className="sub-title">Alterar Password</h2>
          {!isEditingPassword ? (
            <button className="edit-button" onClick={toggleEditPassword}>
              Alterar Password
            </button>
          ) : (
            <div className="password-section">
              <label className="label">Password Atual:</label>
              <input
                type="password"
                name="currentPassword"
                value={currentPassword}
                onChange={handlePasswordChange}
                className="input"
              />

              <label className="label">Nova Password:</label>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
                className="input"
              />

              <label className="label">Confirmar Nova Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handlePasswordChange}
                className="input"
              />

              <div className="inline">
                <button className="save-button" onClick={savePassword}>
                  Guardar Password
                </button>
                <button className="cancel-button" onClick={toggleEditPassword}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Seção de Apagar Conta */}
        <div className="section">
          <button className="delete-button" onClick={handleDeleteAccount}>
            Apagar Conta
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAccount;
