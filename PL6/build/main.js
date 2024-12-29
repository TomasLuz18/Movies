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
const Contacts = __importStar(require("./contacts"));
const users_1 = require("./users");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../../Lab8_rest_api_client/dist")));
// Middleware para CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
// Função auxiliar para tratamento de rotas assíncronas
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
// Rotas de E-mail e Contatos
app.post("/messages", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const smtpWorker = new SMTP.Worker(serverInfo_1.serverInfo);
    yield smtpWorker.sendMessage(req.body);
    res.send("ok");
})));
app.get("/contacts", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contactsWorker = new Contacts.Worker();
    const contacts = yield contactsWorker.listContacts();
    res.json(contacts);
})));
app.post("/contacts", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contactsWorker = new Contacts.Worker();
    const contact = yield contactsWorker.addContact(req.body);
    res.json(contact);
})));
app.delete("/contacts/:id", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contactsWorker = new Contacts.Worker();
    yield contactsWorker.deleteContact(req.params.id);
    res.send("ok");
})));
// Rotas de Autenticação
const userWorker = new users_1.UserWorker();
// Registro de Usuário
app.post("/register", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, age } = req.body;
    // Validação básica
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Dados incompletos." });
    }
    // Verifica se o usuário já existe
    const existingUser = yield userWorker.findUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: "Usuário já existe." });
    }
    // Hash da senha
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    // Geração de token de confirmação
    const confirmationToken = (0, uuid_1.v4)();
    // Criação do usuário
    const newUser = {
        username,
        email,
        password: hashedPassword,
        isActive: false,
        confirmationToken,
    };
    yield userWorker.createUser(newUser);
    // Envio do e-mail de confirmação
    const smtpWorker = new SMTP.Worker(serverInfo_1.serverInfo);
    const confirmationLink = `http://localhost:8080/activate?token=${confirmationToken}`;
    const mailOptions = {
        from: serverInfo_1.serverInfo.smtp.auth.user,
        to: email,
        subject: "Confirme sua conta",
        text: `Olá ${username},\n\nPor favor, confirme sua conta clicando no link a seguir:\n${confirmationLink}\n\nObrigado!`,
    };
    yield smtpWorker.sendMessage(mailOptions);
    res.status(201).json({ message: "Usuário criado. Verifique seu e-mail para confirmação." });
})));
// Ativação de Conta
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
// Login de Usuário
app.post("/login", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Validação básica
    if (!email || !password) {
        return res.status(400).json({ message: "Dados incompletos." });
    }
    const user = yield userWorker.findUserByEmail(email);
    if (!user) {
        return res.status(400).json({ message: "Usuário não encontrado." });
    }
    if (!user.isActive) {
        return res.status(400).json({ message: "Conta não ativada. Verifique seu e-mail." });
    }
    // Verifica a senha
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Senha incorreta." });
    }
    // Geração do Token JWT
    const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || "defaultsecret", { expiresIn: "1h" });
    res.json({ token, message: "Login bem-sucedido." });
})));
// Middleware para Verificar Token JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "defaultsecret", (err, decoded) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            // Verifica se o payload contém as propriedades esperadas
            if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded && 'email' in decoded) {
                req.user = {
                    userId: decoded.userId,
                    email: decoded.email,
                };
                next();
            }
            else {
                return res.sendStatus(403); // Forbidden se o payload não tiver as propriedades esperadas
            }
        });
    }
    else {
        res.sendStatus(401); // Unauthorized
    }
};
// Rota Protegida
app.get("/protected", authenticateJWT, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: "Usuário não autenticado." });
    }
    res.json({ message: "Você acessou uma rota protegida!", user: req.user });
})));
// Middleware de erro global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Algo deu errado!" });
});
app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080");
});
