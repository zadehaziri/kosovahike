"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const config_1 = require("../config");
/**
 * Skript për të listuar të gjithë përdoruesit me ID-të e tyre
 *
 * Përdorimi:
 * ts-node src/scripts/listUsers.ts
 */
function listUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Lidhu me MongoDB
            console.log('Duke u lidhur me MongoDB...');
            yield mongoose_1.default.connect(config_1.config.mongo_uri);
            console.log('✓ U lidh me sukses me MongoDB!\n');
            // Gjej të gjithë përdoruesit
            const users = yield User_1.default.find().select('_id firstName lastName email');
            if (users.length === 0) {
                console.log('📭 Nuk ka përdorues në database.');
            }
            else {
                console.log(`📋 Lista e përdoruesve (${users.length} total):\n`);
                console.log('─'.repeat(80));
                console.log(`${'ID'.padEnd(30)} ${'Emri'.padEnd(30)} ${'Email'.padEnd(30)}`);
                console.log('─'.repeat(80));
                users.forEach((user) => {
                    const fullName = `${user.firstName} ${user.lastName}`;
                    console.log(`${user._id.toString().padEnd(30)} ${fullName.padEnd(30)} ${user.email.padEnd(30)}`);
                });
                console.log('─'.repeat(80));
                console.log(`\n💡 Përdor ID-në për të ndryshuar kredencialet:`);
                console.log(`   npm run update-credentials <USER_ID> email <new_email>`);
                console.log(`   npm run update-credentials <USER_ID> password <new_password>`);
            }
        }
        catch (error) {
            console.error('❌ Gabim:', error.message);
            process.exit(1);
        }
        finally {
            yield mongoose_1.default.connection.close();
            console.log('\n🔌 Lidhja me MongoDB u mbyll.');
        }
    });
}
// Ekzekuto skriptin
if (require.main === module) {
    listUsers()
        .then(() => {
        console.log('\n✨ Procesi u përfundua me sukses!');
        process.exit(0);
    })
        .catch((error) => {
        console.error('\n💥 Procesi dështoi:', error);
        process.exit(1);
    });
}
exports.default = listUsers;
//# sourceMappingURL=listUsers.js.map