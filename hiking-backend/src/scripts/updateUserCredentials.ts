import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UserModel from '../models/User';
import { config } from '../config';

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

async function updateUserCredentials() {
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
    await mongoose.connect(config.mongo_uri);
    console.log('✓ U lidh me sukses me MongoDB!\n');

    // Gjej përdoruesin
    const user = await UserModel.findById(userId);
    if (!user) {
      console.error(`❌ Përdoruesi me ID ${userId} nuk u gjet!`);
      await mongoose.connection.close();
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
        await mongoose.connection.close();
        process.exit(1);
      }

      // Kontrollo nëse email-i tashmë ekziston
      const existingUser = await UserModel.findOne({ email: newValue, _id: { $ne: userId } });
      if (existingUser) {
        console.error(`❌ Email-i ${newValue} tashmë është i regjistruar për një përdorues tjetër!`);
        await mongoose.connection.close();
        process.exit(1);
      }

      user.email = newValue;
      await user.save();
      console.log(`✅ Email-i u përditësua me sukses!`);
      console.log(`   Email i ri: ${newValue}`);

    } else if (field === 'password') {
      // Kontrollo gjatësinë e password-it
      if (newValue.length < 8) {
        console.error('❌ Password-i duhet të jetë të paktën 8 karaktere!');
        await mongoose.connection.close();
        process.exit(1);
      }

      // Hash password-in e ri
      const hashedPassword = await bcrypt.hash(newValue, 10);
      user.password = hashedPassword;
      await user.save();
      console.log(`✅ Password-i u përditësua me sukses!`);
      console.log(`   Password i ri: ${newValue}`);

    } else {
      console.error(`❌ Fusha "${field}" nuk është e vlefshme!`);
      console.log('   Fushat e vlefshme: email, password');
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log('\n📋 Të dhënat e përditësuara:');
    console.log(`   Emri: ${user.firstName} ${user.lastName}`);
    console.log(`   Email: ${user.email}`);
    console.log('');

  } catch (error: any) {
    console.error('❌ Gabim:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Lidhja me MongoDB u mbyll.');
  }
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

export default updateUserCredentials;

