import { JwtPayload } from "jsonwebtoken";

// Declaração global para estender o tipo Request do Express.
// Essa declaração permite adicionar a propriedade `user` ao objeto Request,
// facilitando o uso de informações do utilizador autenticado ao longo da aplicação.
declare global {
  namespace Express {
    interface Request {
      // Adiciona a propriedade opcional `user` com os campos relacionados ao utilizador autenticado.
      user?: {
        userId: string; // ID do utilizador.
        email: string;  // E-mail do utilizador.
        username: string; // Nome de utilizador.
      };
    }
  }
}
