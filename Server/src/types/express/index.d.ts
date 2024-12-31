import { JwtPayload } from "jsonwebtoken";

// Declaração global para estender o tipo Request do Express.
// Essa declaração permite adicionar a propriedade `user` ao objeto Request,
// facilitando o uso de informações do usuário autenticado ao longo da aplicação.
declare global {
  namespace Express {
    interface Request {
      // Adiciona a propriedade opcional `user` com os campos relacionados ao usuário autenticado.
      user?: {
        userId: string; // ID do usuário.
        email: string;  // E-mail do usuário.
        username: string; // Nome de usuário.
      };
    }
  }
}
