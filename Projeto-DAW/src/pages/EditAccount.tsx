import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

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

  const handleDeleteAccount = async () => {
    const confirma = window.confirm(
      "Tem certeza que deseja apagar a conta? Esta ação é irreversível."
    );
    if (!confirma) return;

    try {
      await axios.delete("http://localhost:8080/users/delete", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Conta apagada com sucesso!");
      localStorage.removeItem("token");
      window.location.href = "/login";
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
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Nome atualizado com sucesso!");
      toggleEditName();
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
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Password alterada com sucesso!");
      toggleEditPassword();
    } catch (err) {
      console.error(err);
      alert("Erro ao alterar a password.");
    }
  };

  return (
    <div style={{ ...styles.pageWrapper, marginTop: '80px' }}>

      <h1 style={styles.pageTitle}>Editar Conta</h1>

      <div style={styles.card}>
        {/* Seção de Nome */}
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
                <button
                  className="saveButton"
                  style={styles.saveButton}
                  onClick={saveName}
                >
                  Guardar
                </button>
                <button
                  className="cancelButton"
                  style={styles.cancelButton}
                  onClick={toggleEditName}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span style={styles.text}>{name}</span>
                <button
                  className="editButton"
                  style={styles.editButton}
                  onClick={toggleEditName}
                >
                  Editar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Seção de Email */}
        <div style={styles.section}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={user?.email || "email@exemplo.com"}
            readOnly
            style={{
              ...styles.input,
              backgroundColor: "#eee",
              cursor: "not-allowed",
            }}
          />
        </div>

        {/* Seção de Alteração de Password */}
        <div style={styles.section}>
          <h2 style={styles.subTitle}>Alterar Password</h2>
          {!isEditingPassword ? (
            <button
              className="editButton"
              style={styles.editButton}
              onClick={toggleEditPassword}
            >
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
                <button
                  className="saveButton"
                  style={styles.saveButton}
                  onClick={savePassword}
                >
                  Guardar Password
                </button>
                <button
                  className="cancelButton"
                  style={styles.cancelButton}
                  onClick={toggleEditPassword}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Seção de Apagar Conta */}
        <div style={styles.section}>
          <button
            className="deleteButton"
            style={styles.deleteButton}
            onClick={handleDeleteAccount}
          >
            Apagar Conta
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#f5f6f8",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "80px", // Espaçamento para o header
    padding: "40px 20px",
  },
  pageTitle: {
    fontSize: "2rem",
    marginBottom: "30px",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: "600px",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  section: {
    marginBottom: "20px",
  },
  subTitle: {
    fontSize: "1.2rem",
    margin: "10px 0",
    color: "#333",
  },
  inline: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: 600,
    fontSize: "0.95rem",
    color: "#555",
  },
  text: {
    fontSize: "1rem",
    color: "#333",
  },
  input: {
    width: "100%",
    maxWidth: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  editButton: {
    padding: "10px 20px",
    backgroundColor: "#2b2b2b",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#2b2b2b",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#2b2b2b",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out",
  },
  passwordSection: {
    marginTop: "10px",
  },
  deleteButton: {
    padding: "10px 20px",
    backgroundColor: "#2b2b2b",
    color: "#fff",
    border: "red",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "background-color 0.2s ease-in-out",
  },
};

export default EditAccount;
