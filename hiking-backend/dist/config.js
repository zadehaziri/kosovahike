"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// Import dotenv për të lexuar .env file
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Përdor environment variables nëse ekzistojnë, përndryshe përdor vlerat default
// IMPORTANT: Krijo .env file në hiking-backend/ me credentials të tua private
exports.config = {
    app_secret: process.env.APP_SECRET || 'dummy_secret_change_this_in_production',
    port: parseInt(process.env.PORT || '5000'),
    // Për database lokal: mongodb://localhost:27017/kosovahike
    // Për MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/kosovahike
    // KRIJO .env FILE dhe vendos MONGO_URI atje për siguri!
    mongo_uri: process.env.MONGO_URI || 'mongodb://localhost:27017/kosovahike',
    token_expire: process.env.TOKEN_EXPIRE || "24",
    apiUrl: process.env.API_URL || "http://127.0.0.1",
    token_prefix: process.env.TOKEN_PREFIX || "JWT ",
};
//# sourceMappingURL=config.js.map