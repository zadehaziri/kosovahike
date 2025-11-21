import mongoose from 'mongoose';
import EventModel from '../models/Event';
import TrailModel from '../models/Trail';
import UserModel from '../models/User';
import { config } from '../config';

async function deleteFirstTwoEvents() {
  try {
    // Lidhu me MongoDB
    console.log('Duke u lidhur me MongoDB...');
    await mongoose.connect(config.mongo_uri);
    console.log('U lidh me sukses me MongoDB!');

    // Gjej të gjitha events dhe renditi sipas datës
    const events = await EventModel.find().sort({ date: 1 }).limit(2);
    
    if (events.length === 0) {
      console.log('⚠️  Nuk ka events për të fshirë.');
      await mongoose.connection.close();
      return;
    }

    console.log(`\nDuke fshirë ${events.length} eventet e para...`);

    for (const event of events) {
      try {
        // Fshi event ID nga trail's events array
        if (event.trail) {
          await TrailModel.findByIdAndUpdate(event.trail, {
            $pull: { events: event._id }
          });
        }

        // Fshi event ID nga user's eventsAttending array për të gjithë attendees
        if (event.attendees && Array.isArray(event.attendees)) {
          for (const attendee of event.attendees) {
            if (attendee._id) {
              await UserModel.findByIdAndUpdate(attendee._id, {
                $pull: { eventsAttending: event._id }
              });
            }
          }
        }

        // Fshi event
        await EventModel.findByIdAndDelete(event._id);
        console.log(`✓ Event u fshi: "${event.title}" (ID: ${event._id})`);
      } catch (error: any) {
        console.error(`❌ Gabim gjatë fshirjes së event "${event.title}":`, error.message);
      }
    }

    console.log('\n✅ Events u fshinë me sukses!');
    
    // Shfaq events e mbetura
    const remainingEvents = await EventModel.find().sort({ date: 1 });
    console.log(`\n📊 Events e mbetura: ${remainingEvents.length}`);
    
    if (remainingEvents.length > 0) {
      console.log('\n📅 Events e mbetura:');
      remainingEvents.forEach((event, index) => {
        console.log(`   ${index + 1}. ${event.title}`);
        console.log(`      Date: ${new Date(event.date).toLocaleDateString()}`);
        console.log(`      ID: ${event._id}`);
      });
    }

  } catch (error: any) {
    console.error('❌ Gabim gjatë fshirjes së events:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Lidhja me MongoDB u mbyll.');
  }
}

// Ekzekuto skriptin
if (require.main === module) {
  deleteFirstTwoEvents()
    .then(() => {
      console.log('\n✅ Skripta u ekzekutua me sukses!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Skripta dështoi:', error);
      process.exit(1);
    });
}

export { deleteFirstTwoEvents };

