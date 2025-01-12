"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const serverInfo_1 = require("./serverInfo");
const SMTP = __importStar(require("./SMTP"));
const users_1 = require("./users");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Permite parsing de JSON no body
app.use(express_1.default.json());
// Serve arquivos estáticos (front-end) — se você quiser
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../../Lab8_rest_api_client/dist")));
// Middleware de CORS (para permitir requisições de outras origens)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS, PATCH, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
// Função auxiliar para tratamento de rotas assíncronas (try/catch simplificado)
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
// ------------------- Rotas de Email e Contatos (exemplo) -------------------
app.post("/messages", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const smtpWorker = new SMTP.Worker(serverInfo_1.serverInfo);
    yield smtpWorker.sendMessage(req.body);
    res.send("ok");
})));
// ------------------- Rotas de Autenticação -------------------
const userWorker = new users_1.UserWorker();
/**
 * Registro de utilizador
 */
app.post("/register", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    // Validação básica
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Dados incompletos." });
    }
    // Verifica se o utilizador já existe
    const existingUser = yield userWorker.findUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: "utilizador já existe." });
    }
    // Hash da senha
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    // Geração de token de confirmação (se você for usar ativação por email)
    const confirmationToken = (0, uuid_1.v4)();
    // Criação do utilizador
    const newUser = {
        username,
        email,
        password: hashedPassword,
        isActive: false,
        confirmationToken,
        favorites: [], // inicia vazio
    };
    yield userWorker.createUser(newUser);
    // Exemplo de envio de e-mail de confirmação
    const smtpWorker = new SMTP.Worker(serverInfo_1.serverInfo);
    const confirmationLink = `http://localhost:8080/activate?token=${confirmationToken}`;
    const mailOptions = {
        from: serverInfo_1.serverInfo.smtp.auth.user,
        to: email,
        subject: "Confirme sua conta",
        text: `Olá ${username},\n\nPor favor, confirme sua conta clicando no link a seguir:\n${confirmationLink}\n\nObrigado!`,
    };
    yield smtpWorker.sendMessage(mailOptions);
    res.status(201).json({ message: "utilizador criado. Verifique seu e-mail para confirmação." });
})));
/**
 * Ativação de conta (caso use link enviado por email)
 */
app.get("/activate", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
        return res.status(400).send("Token inválido.");
    }
    const activatedUser = yield userWorker.activateUser(token);
    if (activatedUser) {
        res.send("Conta ativada com sucesso. Você pode agora fazer login.");
    }
    else {
        res.status(400).send("Token inválido ou conta já ativada.");
    }
})));
/**
 * Login de utilizador
 */
app.post("/login", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Dados incompletos." });
    }
    const user = yield userWorker.findUserByEmail(email);
    if (!user) {
        return res.status(400).json({ message: "utilizador não encontrado." });
    }
    if (!user.isActive) {
        return res.status(400).json({ message: "Conta não ativada. Verifique seu e-mail." });
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Senha incorreta." });
    }
    // Gera token JWT usando a mesma secret
    const token = jsonwebtoken_1.default.sign({
        userId: user._id,
        email: user.email,
        username: user.username,
    }, process.env.JWT_SECRET || "defaultsecret", { expiresIn: "1h" });
    res.json({ token, message: "Login bem-sucedido." });
})));
/**
 * Middleware de autenticação (valida token e popula req.user)
 */
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "defaultsecret", (err, decoded) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            if (typeof decoded === "object" &&
                decoded !== null &&
                "userId" in decoded &&
                "email" in decoded &&
                "username" in decoded) {
                req.user = {
                    userId: decoded.userId,
                    email: decoded.email,
                    username: decoded.username,
                };
                return next();
            }
            return res.sendStatus(403); // se não tiver as props adequadas
        });
    }
    else {
        res.sendStatus(401); // se não tiver o Authorization header
    }
};
// ------------------- Rotas de Exemplo de CRUD de utilizador -------------------
app.delete("/users/delete", authenticateJWT, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userWorker.findUserById(req.user.userId);
    if (!user) {
        return res.status(404).json({ message: "utilizador não encontrado." });
    }
    yield userWorker.deleteUser(req.user.userId);
    res.json({ message: "Conta apagada com sucesso." });
})));
app.patch("/users/update-name", authenticateJWT, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ message: "Nome inválido." });
    }
    const user = yield userWorker.findUserById(req.user.userId);
    if (!user) {
        return res.status(404).json({ message: "utilizador não encontrado." });
    }
    yield userWorker.updateUser(req.user.userId, { username });
    res.json({ message: "Nome atualizado com sucesso." });
})));
app.patch("/users/update-password", authenticateJWT, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Dados incompletos." });
    }
    const user = yield userWorker.findUserById(req.user.userId);
    if (!user) {
        return res.status(404).json({ message: "utilizador não encontrado." });
    }
    const isMatch = yield bcrypt_1.default.compare(currentPassword, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Senha atual incorreta." });
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    yield userWorker.updateUser(req.user.userId, { password: hashedPassword });
    res.json({ message: "Senha atualizada com sucesso." });
})));
// ------------------- Rotas de FAVORITOS -------------------
/**
 * Adiciona um favorito para o utilizador logado
 */
app.post("/favorites", authenticateJWT, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { movieId } = req.body;
    if (!movieId) {
        return res.status(400).json({ message: "movieId é obrigatório." });
    }
    // Busca o utilizador no banco
    const user = yield userWorker.findUserById(userId);
    if (!user) {
        return res.status(404).json({ message: "utilizador não encontrado." });
    }
    // Se favorites não existir, inicializa como []
    if (!user.favorites) {
        user.favorites = [];
    }
    // Verifica se já está favoritado
    if (!user.favorites.includes(movieId)) {
        user.favorites.push(movieId);
        yield userWorker.updateUser(userId, { favorites: user.favorites });
    }
    return res.status(200).json({
        message: "Favorito adicionado com sucesso.",
        favorites: user.favorites,
    });
})));
/**
 * Retorna todos os IDs de filmes favoritados pelo utilizador logado
 */
app.get("/favorites", authenticateJWT, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const user = yield userWorker.findUserById(userId);
    if (!user) {
        return res.status(404).json({ message: "utilizador não encontrado." });
    }
    const favorites = user.favorites || [];
    return res.json({ favorites });
})));
/**
 * Remove um favorito específico (por movieId)
 */
app.delete("/favorites/:movieId", authenticateJWT, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { movieId } = req.params;
    const user = yield userWorker.findUserById(userId);
    if (!user) {
        return res.status(404).json({ message: "utilizador não encontrado." });
    }
    if (!user.favorites) {
        user.favorites = [];
    }
    // Filtra fora o movieId que quer remover
    const newFavorites = user.favorites.filter((fav) => fav !== movieId);
    yield userWorker.updateUser(userId, { favorites: newFavorites });
    return res.status(200).json({
        message: "Favorito removido com sucesso.",
        favorites: newFavorites,
    });
})));
// ------------------- Exemplo de rota protegida genérica -------------------
app.get("/protected", authenticateJWT, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: "utilizador não autenticado." });
    }
    res.json({ message: "Você acessou uma rota protegida!", user: req.user });
})));
// ------------------- Middleware global de tratamento de erro -------------------
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Algo deu errado!" });
});
// ------------------- Inicializa o servidor -------------------
app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080");
});
