import * as path from "path";
const Datastore = require("nedb");

// Interface que descreve um contato
export interface IContact {
    _id?: string;  // O ID é opcional e será gerado pelo NeDB
    name: string;
    email: string;
}

// Classe Worker para manipulação dos contatos
export class Worker {
    private db: Nedb;

    // Construtor que cria o banco de dados NeDB na localização especificada
    constructor() {
        this.db = new Datastore({
            filename: path.join(__dirname, "contacts.db"),
            autoload: true,  // Carrega automaticamente o banco de dados ao iniciar
        });
    }

    // Método para listar todos os contatos
    public listContacts(): Promise<IContact[]> {
        return new Promise((inResolve, inReject) => {
            this.db.find({}, (inError: Error | null, inDocs: IContact[]) => {
                if (inError) {
                    inReject(inError);  // Rejeita a Promise em caso de erro
                } else {
                    inResolve(inDocs);  // Resolve a Promise com a lista de contatos
                }
            });
        });
    }

    // Método para adicionar um novo contato
    public addContact(inContact: IContact): Promise<IContact> {
        return new Promise((inResolve, inReject) => {
            this.db.insert(inContact, (inError: Error | null, inNewDoc: IContact) => {
                if (inError) {
                    inReject(inError);  // Rejeita a Promise em caso de erro
                } else {
                    inResolve(inNewDoc);  // Resolve a Promise com o contato adicionado
                }
            });
        });
    }

    // Método para deletar um contato pelo ID
    public deleteContact(inID: string): Promise<void> {
        return new Promise((inResolve, inReject) => {
            this.db.remove({ _id: inID }, {}, (inError: Error | null, inNumRemoved: number) => {
                if (inError) {
                    inReject(inError);  // Rejeita a Promise em caso de erro
                } else {
                    inResolve();  // Resolve a Promise se o contato for removido com sucesso
                }
            });
        });
    }
}