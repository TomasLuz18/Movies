"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformationOne = transformationOne;
function transformationOne(user) {
    return {
        Id: user.id,
        Nome_Completo: user.name,
        Email_Ualg: user.email.replace(/@.*$/, '@ualg.pt'),
    };
}
