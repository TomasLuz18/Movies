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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const path = __importStar(require("path"));
const Datastore = require("nedb");
// Classe Worker para manipulação dos contatos
class Worker {
    // Construtor que cria o banco de dados NeDB na localização especificada
    constructor() {
        this.db = new Datastore({
            filename: path.join(__dirname, "contacts.db"),
            autoload: true, // Carrega automaticamente o banco de dados ao iniciar
        });
    }
    // Método para listar todos os contatos
    listContacts() {
        return new Promise((inResolve, inReject) => {
            this.db.find({}, (inError, inDocs) => {
                if (inError) {
                    inReject(inError); // Rejeita a Promise em caso de erro
                }
                else {
                    inResolve(inDocs); // Resolve a Promise com a lista de contatos
                }
            });
        });
    }
    // Método para adicionar um novo contato
    addContact(inContact) {
        return new Promise((inResolve, inReject) => {
            this.db.insert(inContact, (inError, inNewDoc) => {
                if (inError) {
                    inReject(inError); // Rejeita a Promise em caso de erro
                }
                else {
                    inResolve(inNewDoc); // Resolve a Promise com o contato adicionado
                }
            });
        });
    }
    // Método para deletar um contato pelo ID
    deleteContact(inID) {
        return new Promise((inResolve, inReject) => {
            this.db.remove({ _id: inID }, {}, (inError, inNumRemoved) => {
                if (inError) {
                    inReject(inError); // Rejeita a Promise em caso de erro
                }
                else {
                    inResolve(); // Resolve a Promise se o contato for removido com sucesso
                }
            });
        });
    }
}
exports.Worker = Worker;
