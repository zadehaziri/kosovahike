"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
class TokenService {
    constructor() {
        this.generatePasswordResetToken = (email) => {
            return jsonwebtoken_1.default.sign({ email: email }, config_1.config.app_secret, {
                expiresIn: config_1.config.token_expire,
            });
        };
        this.generateVerifyEmailToken = (email) => {
            return jsonwebtoken_1.default.sign({ email: email }, config_1.config.app_secret, {
                expiresIn: config_1.config.token_expire,
            });
        };
        this.generateLoginToken = (userId) => {
            return jsonwebtoken_1.default.sign({ userId: userId }, config_1.config.app_secret, {
                expiresIn: config_1.config.token_expire,
            });
        };
        this.verifyToken = (token) => {
            return new Promise((resolve, reject) => {
                jsonwebtoken_1.default.verify(token, config_1.config.app_secret, (err, decoded) => {
                    if (err)
                        resolve(false);
                    else
                        resolve(decoded);
                });
            });
        };
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=tokenService.js.map