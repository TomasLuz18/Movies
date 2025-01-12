// modules/loginService.ts

import axios from "axios";

/**
 * Modela os dados do formulário de login.
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Faz a chamada HTTP para autenticar o utilizador e retorna o token.
 */
export async function doLogin(formData: LoginFormData) {
  const response = await axios.post("http://localhost:8080/login", formData);
  const { token } = response.data;
  return token as string;
}
