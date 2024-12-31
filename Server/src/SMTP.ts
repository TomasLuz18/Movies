import * as nodemailer from "nodemailer";
import { SendMailOptions, SentMessageInfo } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { IServerInfo } from "./serverInfo";

// Definição da classe Worker, responsável por enviar e-mails utilizando o nodemailer.
export class Worker {
    // Variável privada e estática que armazena as informações do servidor de e-mail (SMTP).
    private static serverInfo: IServerInfo;

    // Construtor que inicializa a classe com as informações do servidor de e-mail.
    constructor(inServerInfo: IServerInfo) {
        Worker.serverInfo = inServerInfo;
    }

    // Método para enviar uma mensagem de e-mail.
    // Recebe as opções de envio do e-mail (remetente, destinatário, assunto, etc.).
    public sendMessage(inOptions: SendMailOptions): Promise<void> {
        return new Promise((inResolve, inReject) => {
            // Cria um transportador SMTP usando as configurações fornecidas no serverInfo.
            const transport: Mail = nodemailer.createTransport(Worker.serverInfo.smtp);

            // Envia o e-mail utilizando as opções fornecidas.
            transport.sendMail(inOptions, (inError: Error | null, inInfo: SentMessageInfo) => {
                if (inError) {
                    inReject(inError);  // Rejeita a Promise em caso de erro durante o envio.
                } else {
                    inResolve();  // Resolve a Promise se o envio for bem-sucedido.
                }
            });
        });
    }
}
