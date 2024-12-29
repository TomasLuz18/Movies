import path from "path";
import express, { Express, NextFunction, Request, Response } from "express";
import { serverInfo } from "./serverInfo";
import * as SMTP from "./SMTP";
import * as Contacts from "./contacts";
import { IContact } from "./contacts";
import { UserWorker, IUser } from "./users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "../../Lab8_rest_api_client/dist")));

// Middleware para CORS
app.use(function (req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS, PATCH, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});




// Função auxiliar para tratamento de rotas assíncronas
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Rotas de E-mail e Contatos
app.post("/messages", asyncHandler(async (req: Request, res: Response) => {
  const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
  await smtpWorker.sendMessage(req.body);
  res.send("ok");
}));

app.get("/contacts", asyncHandler(async (req: Request, res: Response) => {
  const contactsWorker: Contacts.Worker = new Contacts.Worker();
  const contacts: IContact[] = await contactsWorker.listContacts();
  res.json(contacts);
}));

app.post("/contacts", asyncHandler(async (req: Request, res: Response) => {
  const contactsWorker: Contacts.Worker = new Contacts.Worker();
  const contact: IContact = await contactsWorker.addContact(req.body);
  res.json(contact);
}));

app.delete("/contacts/:id", asyncHandler(async (req: Request, res: Response) => {
  const contactsWorker: Contacts.Worker = new Contacts.Worker();
  await contactsWorker.deleteContact(req.params.id);
  res.send("ok");
}));

// Rotas de Autenticação
const userWorker = new UserWorker();

// Registro de Usuário
app.post("/register", asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, age } = req.body;

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

  // Geração de token de confirmação
  const confirmationToken = uuidv4();

  // Criação do usuário
  const newUser: IUser = {
    username,
    email,
    password: hashedPassword,
    isActive: false,
    confirmationToken,
  };

  await userWorker.createUser(newUser);

  // Envio do e-mail de confirmação
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

// Ativação de Conta
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

  // Incluímos o `username` no token
  const token = jwt.sign(
    { userId: user._id, email: user.email, username: user.username },
    process.env.JWT_SECRET || "defaultsecret",
    { expiresIn: "1h" }
  );

  res.json({ token, message: "Login bem-sucedido." });
}));


const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET || "defaultsecret", (err, decoded) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      // Inclui `username` no objeto user do request
      if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded && 'email' in decoded && 'username' in decoded) {
        req.user = {
          userId: decoded.userId as string,
          email: decoded.email as string,
          username: decoded.username as string,
        };
        next();
      } else {
        return res.sendStatus(403); // Forbidden
      }
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};
app.delete(
  "/users/delete",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    // Verifica se o usuário existe
    const user = await userWorker.findUserById(req.user!.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Apaga do banco de dados
    await userWorker.deleteUser(req.user!.userId);

    // Retorna sucesso
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


// Rota Protegida
app.get("/protected", authenticateJWT, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  res.json({ message: "Você acessou uma rota protegida!", user: req.user });
}));

// Middleware de erro global
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Algo deu errado!" });
});

app.listen(8080, () => {
  console.log("Servidor rodando na porta 8080");
});
