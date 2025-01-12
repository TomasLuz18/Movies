// modules/editAccountService.ts
import axios from "axios";

export interface CreateAccountFormData {
  username: string;
  email: string;
  password: string;
  age: string;
}


/**
 * Cria a conta de um utilizador
 */
export async function createAccountRequest(formData: CreateAccountFormData) {
  return axios.post("http://localhost:8080/register", {
    ...formData,
    age: Number(formData.age),
  });
}


/**
 * Apaga a conta do utilizador na API local.
 */
export async function deleteAccount(): Promise<void> {
  return axios.delete("http://localhost:8080/users/delete", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
}

/**
 * Atualiza o nome do utilizador na API.
 */
export async function updateName(name: string): Promise<void> {
  return axios.patch(
    "http://localhost:8080/users/update-name",
    { username: name },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
}

/**
 * Atualiza a password do utilizador na API.
 */
export async function updatePassword(
  currentPassword: string, 
  newPassword: string
): Promise<void> {
  return axios.patch(
    "http://localhost:8080/users/update-password",
    { currentPassword, newPassword },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
}
