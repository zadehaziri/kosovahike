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
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const config_1 = require("../config");
/**
 * Skript për të ndryshuar email ose password të një përdoruesi
 *
 * Përdorimi:
 * ts-node src/scripts/updateUserCredentials.ts <userId> <email|password> <newValue>
 *
 * Shembuj:
 * ts-node src/scripts/updateUserCredentials.ts 507f1f77bcf86cd799439011 email newemail@example.com
 * ts-node src/scripts/updateUserCredentials.ts 507f1f77bcf86cd799439011 password newpassword123
 */
function updateUserCredentials() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Marr argumentet nga command line
            const args = process.argv.slice(2);
            if (args.length < 3) {
                console.error('❌ Gabim: Mungojnë argumentet!');
                console.log('\n📖 Përdorimi:');
                console.log('   ts-node src/scripts/updateUserCredentials.ts <userId> <email|password> <newValue>');
                console.log('\n💡 Shembuj:');
                console.log('   ts-node src/scripts/updateUserCredentials.ts 507f1f77bcf86cd799439011 email newemail@example.com');
                console.log('   ts-node src/scripts/updateUserCredentials.ts 507f1f77bcf86cd799439011 password newpassword123');
                process.exit(1);
            }
            const [userId, field, newValue] = args;
            // Lidhu me MongoDB
            console.log('Duke u lidhur me MongoDB...');
            yield mongoose_1.default.connect(config_1.config.mongo_uri);
            console.log('✓ U lidh me sukses me MongoDB!\n');
            // Gjej përdoruesin
            const user = yield User_1.default.findById(userId);
            if (!user) {
                console.error(`❌ Përdoruesi me ID ${userId} nuk u gjet!`);
                yield mongoose_1.default.connection.close();
                process.exit(1);
            }
            console.log(`📋 Përdoruesi aktual:`);
            console.log(`   Emri: ${user.firstName} ${user.lastName}`);
            console.log(`   Email: ${user.email}`);
            console.log('');
            // Përditëso fushën e specifikuar
            if (field === 'email') {
                // Kontrollo nëse email-i është i vlefshëm
                const emailRegex = /\S+@\S+\.\S+/;
                if (!emailRegex.test(newValue)) {
                    console.error('❌ Email-i nuk është i vlefshëm!');
                    yield mongoose_1.default.connection.close();
                    process.exit(1);
                }
                // Kontrollo nëse email-i tashmë ekziston
                const existingUser = yield User_1.default.findOne({ email: newValue, _id: { $ne: userId } });
                if (existingUser) {
                    console.error(`❌ Email-i ${newValue} tashmë është i regjistruar për një përdorues tjetër!`);
                    yield mongoose_1.default.connection.close();
                    process.exit(1);
                }
                user.email = newValue;
                yield user.save();
                console.log(`✅ Email-i u përditësua me sukses!`);
                console.log(`   Email i ri: ${newValue}`);
            }
            else if (field === 'password') {
                // Kontrollo gjatësinë e password-it
                if (newValue.length < 8) {
                    console.error('❌ Password-i duhet të jetë të paktën 8 karaktere!');
                    yield mongoose_1.default.connection.close();
                    process.exit(1);
                }
                // Hash password-in e ri
                const hashedPassword = yield bcrypt_1.default.hash(newValue, 10);
                user.password = hashedPassword;
                yield user.save();
                console.log(`✅ Password-i u përditësua me sukses!`);
                console.log(`   Password i ri: ${newValue}`);
            }
            else {
                console.error(`❌ Fusha "${field}" nuk është e vlefshme!`);
                console.log('   Fushat e vlefshme: email, password');
                yield mongoose_1.default.connection.close();
                process.exit(1);
            }
            console.log('\n📋 Të dhënat e përditësuara:');
            console.log(`   Emri: ${user.firstName} ${user.lastName}`);
            console.log(`   Email: ${user.email}`);
            console.log('');
        }
        catch (error) {
            console.error('❌ Gabim:', error.message);
            process.exit(1);
        }
        finally {
            yield mongoose_1.default.connection.close();
            console.log('🔌 Lidhja me MongoDB u mbyll.');
        }
    });
}
// Ekzekuto skriptin
if (require.main === module) {
    updateUserCredentials()
        .then(() => {
        console.log('\n✨ Procesi u përfundua me sukses!');
        process.exit(0);
    })
        .catch((error) => {
        console.error('\n💥 Procesi dështoi:', error);
        process.exit(1);
    });
}
exports.default = updateUserCredentials;
//# sourceMappingURL=updateUserCredentials.js.map