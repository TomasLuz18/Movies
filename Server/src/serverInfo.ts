import path from "path";
import fs from "fs";

// Define a interface que representa o conteúdo do arquivo serverInfo.json
export interface IServerInfo {
    smtp: {
        host: string;
        port: number;
        auth: {
            user: string;
            pass: string;
        };
    };
}

// Variável exportada que armazenará as informações do servidor
export let serverInfo: IServerInfo;

// Lê o arquivo serverInfo.json e inicializa a variável serverInfo
const rawInfo: string = fs.readFileSync(path.join(__dirname, "../server/serverInfo.json"), "utf8");
serverInfo = JSON.parse(rawInfo); // converte a string em um objeto