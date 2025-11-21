import mongoose from 'mongoose';
import UserModel from '../models/User';
import { config } from '../config';

/**
 * Skript për të listuar të gjithë përdoruesit me ID-të e tyre
 * 
 * Përdorimi:
 * ts-node src/scripts/listUsers.ts
 */

async function listUsers() {
  try {
    // Lidhu me MongoDB
    console.log('Duke u lidhur me MongoDB...');
    await mongoose.connect(config.mongo_uri);
    console.log('✓ U lidh me sukses me MongoDB!\n');

    // Gjej të gjithë përdoruesit
    const users = await UserModel.find().select('_id firstName lastName email');

    if (users.length === 0) {
      console.log('📭 Nuk ka përdorues në database.');
    } else {
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

  } catch (error: any) {
    console.error('❌ Gabim:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Lidhja me MongoDB u mbyll.');
  }
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

export default listUsers;

