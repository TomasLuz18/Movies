import path from "path";
import fs from "fs";

// Define a interface que descreve o formato das informações do servidor de e-mail.
// Este formato corresponde ao conteúdo esperado no arquivo serverInfo.json.
export interface IServerInfo {
    smtp: {
        host: string;       // Endereço do servidor SMTP.
        port: number;       // Porta usada pelo servidor SMTP.
        auth: {
            user: string;   // Nome de utilizador para autenticação no servidor SMTP.
            pass: string;   // Palavra-passe para autenticação no servidor SMTP.
        };
    };
}

// Variável exportada que armazenará as informações do servidor de e-mail,
// tornando-as acessíveis para outras partes da aplicação.
export let serverInfo: IServerInfo;

// Lê o arquivo serverInfo.json do sistema de ficheiros para obter as configurações do servidor SMTP.
// O caminho relativo é resolvido com base no diretório atual.
const rawInfo: string = fs.readFileSync(path.join(__dirname, "../server/serverInfo.json"), "utf8");

// Converte a string JSON lida do arquivo em um objeto JavaScript e armazena em serverInfo.
serverInfo = JSON.parse(rawInfo);
