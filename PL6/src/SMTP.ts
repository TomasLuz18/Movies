import * as nodemailer from "nodemailer";
import { SendMailOptions, SentMessageInfo } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { IServerInfo } from "./serverInfo";

// Definição da classe Worker
export class Worker {
    // Variável privada para armazenar as informações do servidor
    private static serverInfo: IServerInfo;

    // Construtor que recebe um objeto IServerInfo e o armazena
    constructor(inServerInfo: IServerInfo) {
        Worker.serverInfo = inServerInfo;
    }

    // Método para enviar uma mensagem usando o nodemailer
    public sendMessage(inOptions: SendMailOptions): Promise<void> {
        return new Promise((inResolve, inReject) => {
            // Cria o transportador SMTP com as configurações do serverInfo
            const transport: Mail = nodemailer.createTransport(Worker.serverInfo.smtp);

            // Envia o e-mail
            transport.sendMail(inOptions, (inError: Error | null, inInfo: SentMessageInfo) => {
                if (inError) {
                    inReject(inError);  // Rejeita a Promise em caso de erro
                } else {
                    inResolve();  // Resolve a Promise em caso de sucesso
                }
            });
        });
    }
}