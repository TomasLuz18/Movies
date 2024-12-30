import path from "path";
import express, { Express, NextFunction, Request, Response } from "express";
import { serverInfo } from "./serverInfo";
import * as SMTP from "./SMTP";
import { UserWorker, IUser } from "./users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app: Express = express();

// Permite parsing de JSON no body
app.use(express.json());

// Serve arquivos estáticos (front-end) — se você quiser
app.use("/", express.static(path.join(__dirname, "../../Lab8_rest_api_client/dist")));

// Middleware de CORS (para permitir requisições de outras origens)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS, PATCH, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Função auxiliar para tratamento de rotas assíncronas (try/catch simplificado)
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// ------------------- Rotas de Email e Contatos (exemplo) -------------------
app.post("/messages", asyncHandler(async (req: Request, res: Response) => {
  const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
  await smtpWorker.sendMessage(req.body);
  res.send("ok");
}));



// ------------------- Rotas de Autenticação -------------------
const userWorker = new UserWorker();

/**
 * Registro de usuário
 */
app.post("/register", asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // Validação básica
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Dados incompletos." });
  }

  // Verifica se o usuário já existe
  const existingUser = await userWorker.findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: "Usuário já existe." });
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Geração de token de confirmação (se você for usar ativação por email)
  const confirmationToken = uuidv4();

  // Criação do usuário
  const newUser: IUser = {
    username,
    email,
    password: hashedPassword,
    isActive: false,
    confirmationToken,
    favorites: [], // inicia vazio
  };

  await userWorker.createUser(newUser);

  // Exemplo de envio de e-mail de confirmação
  const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
  const confirmationLink = `http://localhost:8080/activate?token=${confirmationToken}`;
  const mailOptions = {
    from: serverInfo.smtp.auth.user,
    to: email,
    subject: "Confirme sua conta",
    text: `Olá ${username},\n\nPor favor, confirme sua conta clicando no link a seguir:\n${confirmationLink}\n\nObrigado!`,
  };
  await smtpWorker.sendMessage(mailOptions);

  res.status(201).json({ message: "Usuário criado. Verifique seu e-mail para confirmação." });
}));

/**
 * Ativação de conta (caso use link enviado por email)
 */
app.get("/activate", asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).send("Token inválido.");
  }

  const activatedUser = await userWorker.activateUser(token);
  if (activatedUser) {
    res.send("Conta ativada com sucesso. Você pode agora fazer login.");
  } else {
    res.status(400).send("Token inválido ou conta já ativada.");
  }
}));

/**
 * Login de usuário
 */
app.post("/login", asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Dados incompletos." });
  }

  const user = await userWorker.findUserByEmail(email);
  if (!user) {
    return res.status(400).json({ message: "Usuário não encontrado." });
  }

  if (!user.isActive) {
    return res.status(400).json({ message: "Conta não ativada. Verifique seu e-mail." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Senha incorreta." });
  }

  // Gera token JWT usando a mesma secret
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET || "defaultsecret",
    { expiresIn: "1h" }
  );

  res.json({ token, message: "Login bem-sucedido." });
}));

/**
 * Middleware de autenticação (valida token e popula req.user)
 */
const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultsecret",
      (err, decoded) => {
        if (err) {
          return res.sendStatus(403); // Forbidden
        }
        if (
          typeof decoded === "object" &&
          decoded !== null &&
          "userId" in decoded &&
          "email" in decoded &&
          "username" in decoded
        ) {
          req.user = {
            userId: decoded.userId as string,
            email: decoded.email as string,
            username: decoded.username as string,
          };
          return next();
        }
        return res.sendStatus(403); // se não tiver as props adequadas
      }
    );
  } else {
    res.sendStatus(401); // se não tiver o Authorization header
  }
};

// ------------------- Rotas de Exemplo de CRUD de Usuário -------------------
app.delete(
  "/users/delete",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await userWorker.findUserById(req.user!.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    await userWorker.deleteUser(req.user!.userId);
    res.json({ message: "Conta apagada com sucesso." });
  })
);

app.patch(
  "/users/update-name",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Nome inválido." });
    }
    const user = await userWorker.findUserById(req.user!.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    await userWorker.updateUser(req.user!.userId, { username });
    res.json({ message: "Nome atualizado com sucesso." });
  })
);

app.patch(
  "/users/update-password",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Dados incompletos." });
    }
    const user = await userWorker.findUserById(req.user!.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Senha atual incorreta." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userWorker.updateUser(req.user!.userId, { password: hashedPassword });
    res.json({ message: "Senha atualizada com sucesso." });
  })
);

// ------------------- Rotas de FAVORITOS -------------------

/**
 * Adiciona um favorito para o usuário logado
 */
app.post(
  "/favorites",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({ message: "movieId é obrigatório." });
    }

    // Busca o usuário no banco
    const user = await userWorker.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Se favorites não existir, inicializa como []
    if (!user.favorites) {
      user.favorites = [];
    }

    // Verifica se já está favoritado
    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
      await userWorker.updateUser(userId, { favorites: user.favorites });
    }

    return res.status(200).json({
      message: "Favorito adicionado com sucesso.",
      favorites: user.favorites,
    });
  })
);

/**
 * Retorna todos os IDs de filmes favoritados pelo usuário logado
 */
app.get(
  "/favorites",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const user = await userWorker.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const favorites = user.favorites || [];
    return res.json({ favorites });
  })
);

/**
 * Remove um favorito específico (por movieId)
 */
app.delete(
  "/favorites/:movieId",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { movieId } = req.params;

    const user = await userWorker.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    if (!user.favorites) {
      user.favorites = [];
    }

    // Filtra fora o movieId que quer remover
    const newFavorites = user.favorites.filter((fav) => fav !== movieId);
    await userWorker.updateUser(userId, { favorites: newFavorites });

    return res.status(200).json({
      message: "Favorito removido com sucesso.",
      favorites: newFavorites,
    });
  })
);

// ------------------- Exemplo de rota protegida genérica -------------------
app.get(
  "/protected",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }
    res.json({ message: "Você acessou uma rota protegida!", user: req.user });
  })
);

// ------------------- Middleware global de tratamento de erro -------------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Algo deu errado!" });
});

// ------------------- Inicializa o servidor -------------------
app.listen(8080, () => {
  console.log("Servidor rodando na porta 8080");
});
