// users.ts
import * as path from "path";
const Datastore = require("nedb");
import bcrypt from "bcrypt";

// Interface que define a estrutura de um utilizador no sistema.
export interface IUser {
  _id?: string;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  confirmationToken: string;
  favorites?: string[]; // array de IDs de filmes favoritados
}

export class UserWorker {
  private db: Nedb;

  // Construtor que inicializa a base de dados NeDB e define o ficheiro onde os dados serão armazenados.
  constructor() {
    this.db = new Datastore({
      filename: path.join(__dirname, "users.db"),
      autoload: true,
    });
  }

  // Procura um utilizador pelo email. Retorna o utilizador correspondente ou null se não existir.
  public findUserByEmail(email: string): Promise<IUser | null> {
    return new Promise((resolve, reject) => {
      this.db.findOne({ email }, (err: Error | null, doc: IUser | null) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
  }

  // Procura um utilizador pelo ID. Retorna o utilizador correspondente ou null se não existir.
  public findUserById(id: string): Promise<IUser | null> {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: id }, (err: Error | null, doc: IUser | null) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
  }

  // Cria um novo utilizador na base de dados e retorna o utilizador criado.
  public createUser(user: IUser): Promise<IUser> {
    return new Promise((resolve, reject) => {
      this.db.insert(user, (err: Error | null, newDoc: IUser) => {
        if (err) reject(err);
        else resolve(newDoc);
      });
    });
  }

  // Atualiza as informações de um utilizador existente na base de dados com base no seu ID.
  public updateUser(userId: string, updates: Partial<IUser>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: userId },
        { $set: updates },
        {},
        (err: Error | null) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  // Remove um utilizador da base de dados com base no seu ID.
  public deleteUser(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: userId }, {}, (err: Error | null, numRemoved: number) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Ativa um utilizador utilizando o token de confirmação, definindo o estado `isActive` como true.
  public activateUser(token: string): Promise<IUser | null> {
    return new Promise((resolve, reject) => {
      this.db.findOne({ confirmationToken: token }, (err: Error | null, doc: IUser | null) => {
        if (err) reject(err);
        else if (doc) {
          this.db.update({ _id: doc._id }, { $set: { isActive: true, confirmationToken: "" } }, {}, (updateErr: Error | null) => {
            if (updateErr) reject(updateErr);
            else resolve(doc);
          });
        } else {
          resolve(null);
        }
      });
    });
  }
}
