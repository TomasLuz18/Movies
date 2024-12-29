import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const EditAccount: React.FC = () => {
  const { user } = useContext(AuthContext); // Supondo que 'user' contém informações como nome e e-mail
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
  const handleDeleteAccount = async () => {
    // Normalmente, é bom perguntar se o usuário tem certeza
    const confirma = window.confirm("Tem certeza que deseja apagar a conta? Esta ação é irreversível.");
    if (!confirma) return;

    try {
      await axios.delete("http://localhost:8080/users/delete", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Conta apagada com sucesso!");

      // Remove token do storage
      localStorage.removeItem("token");

      // Opção 1: Redirecionar o usuário para a tela de login
      window.location.href = "/login";

      // Opção 2: Apenas limpar a página
      // setUser(null); // caso tenha esse state de user gerenciado globalmente
    } catch (err) {
      console.error(err);
      alert("Erro ao apagar a conta.");
    }
  };

  const saveName = async () => {
    try {
      await axios.patch(
        "http://localhost:8080/users/update-name",
        { username: name },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Nome atualizado com sucesso!");
      toggleEditName(); // Fecha o editor
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar o nome.");
    }
  };

  const savePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("As passwords não coincidem.");
      return;
    }

    try {
      await axios.patch(
        "http://localhost:8080/users/update-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Password alterada com sucesso!");
      toggleEditPassword(); // Fecha o editor
    } catch (err) {
      console.error(err);
      alert("Erro ao alterar a password.");
    }
  };


  return (
    <div style={styles.container}>
      <h1>Editar Conta</h1>
      <div style={styles.section}>
        <label style={styles.label}>Nome:</label>
        <div style={styles.inline}>
          {isEditingName ? (
            <>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                style={styles.input}
              />
              <button style={styles.button} onClick={saveName}>
                Guardar
              </button>
            </>
          ) : (
            <>
              <span style={styles.text}>{name}</span>
              <button style={styles.button} onClick={toggleEditName}>
                Editar
              </button>
            </>
          )}
        </div>
      </div>
      <div style={styles.section}>
        <label style={styles.label}>Email:</label>
        <input
          type="email"
          value={user?.email || "email@exemplo.com"}
          readOnly
          style={{ ...styles.input, backgroundColor: "#e9ecef", cursor: "not-allowed" }}
        />
      </div>
      <div style={styles.section}>
        <h2>Alterar Password</h2>
        {!isEditingPassword ? (
          <button style={styles.button} onClick={toggleEditPassword}>
            Alterar Password
          </button>
        ) : (
          <div style={styles.passwordSection}>
            <label style={styles.label}>Password Atual:</label>
            <input
              type="password"
              name="currentPassword"
              value={currentPassword}
              onChange={handlePasswordChange}
              style={styles.input}
            />
            <label style={styles.label}>Nova Password:</label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={handlePasswordChange}
              style={styles.input}
            />
            <label style={styles.label}>Confirmar Nova Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handlePasswordChange}
              style={styles.input}
            />
            <div style={styles.inline}>


              <button style={styles.button} onClick={savePassword}>
                Guardar Password
              </button>

              <button style={styles.cancelButton} onClick={toggleEditPassword}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
      <div style={styles.section}>
        <button style={styles.deleteButton} onClick={handleDeleteAccount}>
          Apagar Contaa
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#f8f9fa",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  section: {
    marginBottom: "20px",
  },
  inline: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
  },
  text: {
    fontSize: "16px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  passwordSection: {
    marginTop: "20px",
  },
  deleteButton: {
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default EditAccount;
