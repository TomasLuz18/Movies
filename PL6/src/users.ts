// users.ts
import * as path from "path";
const Datastore = require("nedb");
import bcrypt from "bcrypt";

// users.ts
export interface IUser {
  _id?: string;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  confirmationToken: string;
}

export class UserWorker {
  private db: Nedb;

  constructor() {
    this.db = new Datastore({
      filename: path.join(__dirname, "users.db"),
      autoload: true,
    });
  }

  public findUserByEmail(email: string): Promise<IUser | null> {
    return new Promise((resolve, reject) => {
      this.db.findOne({ email }, (err: Error | null, doc: IUser | null) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
  }

  public findUserById(id: string): Promise<IUser | null> {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: id }, (err: Error | null, doc: IUser | null) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
  }

  public createUser(user: IUser): Promise<IUser> {
    return new Promise((resolve, reject) => {
      this.db.insert(user, (err: Error | null, newDoc: IUser) => {
        if (err) reject(err);
        else resolve(newDoc);
      });
    });
  }

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