"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const MONGODB_URI = config_1.config.mongo_uri;
mongoose_1.default.connect(MONGODB_URI).then(() => {
    console.log('MongoDB connected to:', MONGODB_URI.replace(/\/\/.*@/, '//***@')); // Fshi credentials për siguri
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});
//# sourceMappingURL=mongo.js.map