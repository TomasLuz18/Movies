import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        username: string; // Adiciona o campo username
      };
    }
  }
}
