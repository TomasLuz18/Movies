import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  deleteAccount,
  updateName,
  updatePassword,
} from "../modules/UserService";

// Importa o arquivo CSS para estilização.
import "../styles/EditAccountStyle.css";

// Componente funcional para a página de edição de conta.
const EditAccount: React.FC = () => {
  // Obtém informações do usuário autenticado a partir do contexto.
  const { user } = useContext(AuthContext);

  // Estados locais para lidar com as informações do usuário e modos de edição.
  const [name, setName] = useState(user?.username || "Nome do Usuário");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Atualiza o estado do nome do usuário quando o input é alterado.
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // Alterna o modo de edição para o nome do usuário.
  const toggleEditName = () => {
    setIsEditingName(!isEditingName);
  };

  // Alterna o modo de edição para a senha.
  const toggleEditPassword = () => {
    setIsEditingPassword(!isEditingPassword);
  };

  // Atualiza os estados das senhas conforme o usuário preenche os campos.
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "currentPassword") setCurrentPassword(value);
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  // Função para apagar a conta do usuário.
  const handleDeleteAccount = async () => {
    const confirma = window.confirm(
      "Tem certeza que deseja apagar a conta? Esta ação é irreversível."
    );
    if (!confirma) return;

    try {
      // Chama o serviço para apagar a conta.
      await deleteAccount();
      alert("Conta apagada com sucesso!");
      localStorage.removeItem("token"); // Remove o token armazenado.
      window.location.href = "/login"; // Redireciona para a página de login.
    } catch (err) {
      console.error(err);
      alert("Erro ao apagar a conta.");
    }
  };

  // Função para salvar o novo nome do usuário.
  const saveName = async () => {
    try {
      // Chama o serviço para atualizar o nome.
      await updateName(name);
      alert("Nome atualizado com sucesso!");
      toggleEditName(); // Sai do modo de edição.
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar o nome.");
    }
  };

  // Função para salvar a nova senha.
  const savePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("As passwords não coincidem.");
      return;
    }

    try {
      // Chama o serviço para atualizar a senha.
      await updatePassword(currentPassword, newPassword);
      alert("Password alterada com sucesso!");
      toggleEditPassword(); // Sai do modo de edição.
    } catch (err) {
      console.error(err);
      alert("Erro ao alterar a password.");
    }
  };

  // Renderiza o formulário de edição de conta com diferentes seções.
  return (
    <div className="page-wrapper" style={{ marginTop: "80px" }}>
      <h1 className="page-title">Editar Conta</h1>

      <div className="card">
        {/* Seção para editar o nome do usuário */}
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

        {/* Exibe o e-mail do usuário, apenas leitura */}
        <div className="section">
          <label className="label">Email:</label>
          <input
            type="email"
            value={user?.email || "email@exemplo.com"}
            readOnly
            className="input readonly-input"
          />
        </div>

        {/* Seção para alterar a senha do usuário */}
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

        {/* Botão para apagar a conta */}
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
