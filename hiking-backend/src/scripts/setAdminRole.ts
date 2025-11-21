import mongoose from 'mongoose';
import UserModel from '../models/User';
import { config } from '../config';

async function setAdminRole(email: string) {
  try {
    console.log('Duke u lidhur me MongoDB...');
    await mongoose.connect(config.mongo_uri);
    console.log('U lidh me sukses me MongoDB!');

    const user = await UserModel.findOne({ email });
    
    if (!user) {
      console.error(`❌ Përdorues me email "${email}" nuk u gjet.`);
      await mongoose.connection.close();
      return;
    }

    if (user.role === 'admin') {
      console.log(`ℹ️  Përdoruesi "${email}" tashmë ka role "admin".`);
      await mongoose.connection.close();
      return;
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ Role "admin" u vendos me sukses për përdoruesin: ${user.firstName} ${user.lastName} (${email})`);
    
  } catch (error: any) {
    console.error('❌ Gabim gjatë vendosjes së admin role:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Lidhja me MongoDB u mbyll.');
  }
}

// Ekzekuto skriptin
if (require.main === module) {
  const email = process.argv[2];
  
  if (!email) {
    console.error('❌ Ju lutem jepni email-in e përdoruesit:');
    console.log('   Përdorimi: npm run set-admin <email>');
    console.log('   Shembull: npm run set-admin zade.haziri13@gmail.com');
    process.exit(1);
  }

  setAdminRole(email)
    .then(() => {
      console.log('\n✅ Skripta u ekzekutua me sukses!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Skripta dështoi:', error);
      process.exit(1);
    });
}

export { setAdminRole };

