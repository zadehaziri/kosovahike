import mongoose from 'mongoose';
import EventModel from '../models/Event';
import TrailModel from '../models/Trail';
import UserModel from '../models/User';
import { config } from '../config';

async function seedEvents() {
  try {
    // Lidhu me MongoDB
    console.log('Duke u lidhur me MongoDB...');
    await mongoose.connect(config.mongo_uri);
    console.log('U lidh me sukses me MongoDB!');

    // Gjej trails dhe users
    const trails = await TrailModel.find({}).limit(10);
    const users = await UserModel.find({}).limit(2);

    if (trails.length === 0) {
      console.error('❌ Nuk ka trails në database! Ju lutem ekzekutoni seedDatabase.ts fillimisht.');
      await mongoose.connection.close();
      return;
    }

    if (users.length === 0) {
      console.error('❌ Nuk ka përdorues në database! Ju lutem ekzekutoni seedDatabase.ts fillimisht.');
      await mongoose.connection.close();
      return;
    }

    console.log(`✓ U gjetën ${trails.length} trails dhe ${users.length} përdorues`);

    // Krijo events në të ardhmen
    console.log('\nDuke krijuar events në të ardhmen...');
    const createdEvents = [];

    // Dates për të ardhmen (7, 14, 21, 30, 45, 60 ditë nga tani)
    const futureDates = [
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),   // 7 ditë
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),  // 14 ditë
      new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),  // 21 ditë
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),  // 30 ditë
      new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),  // 45 ditë
      new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),  // 60 ditë
    ];

    // Events për të ardhmen
    const upcomingEvents = [
      {
        title: 'Weekend Adventure at Rugova Canyon',
        description: 'Join us for an amazing weekend hike through the beautiful Rugova Canyon. Perfect for beginners and intermediate hikers. We\'ll explore waterfalls, rock formations, and enjoy the stunning nature.',
        location: 'Pejë',
        maxAttendees: 15,
        date: futureDates[0],
      },
      {
        title: 'Challenging Hike to Gjeravica Peak',
        description: 'Conquer Kosovo\'s highest peak! This is a challenging hike for experienced hikers. We\'ll start early morning and reach the summit to enjoy panoramic views. Bring your best gear!',
        location: 'Junik',
        maxAttendees: 10,
        date: futureDates[1],
      },
      {
        title: 'Relaxed Trail at Mirusha Waterfalls',
        description: 'A peaceful hike to the beautiful Mirusha Waterfalls. Great for families and those who want to enjoy nature at a relaxed pace. We\'ll have plenty of time for photos and swimming.',
        location: 'Rahovec',
        maxAttendees: 20,
        date: futureDates[2],
      },
      {
        title: 'Alpine Adventure in Bjeshkët e Nemuna',
        description: 'Experience the alpine meadows and mountain peaks of Bjeshkët e Nemuna. This moderate to hard trail offers incredible views and a chance to see local wildlife.',
        location: 'Junik',
        maxAttendees: 12,
        date: futureDates[3],
      },
      {
        title: 'Family-Friendly Hike at Gadime Cave',
        description: 'Perfect for families with children! Easy trail to Gadime Cave with lots of interesting rock formations to explore. Educational and fun for all ages.',
        location: 'Lipjan',
        maxAttendees: 25,
        date: futureDates[4],
      },
      {
        title: 'Sunset Hike at Rugova Canyon',
        description: 'Experience Rugova Canyon at sunset! A moderate evening hike that ends with a stunning sunset view. We\'ll bring headlamps for the return trip.',
        location: 'Pejë',
        maxAttendees: 18,
        date: futureDates[5],
      },
    ];

    // Krijo events
    for (let i = 0; i < upcomingEvents.length; i++) {
      const eventData = upcomingEvents[i];
      const trail = trails[i % trails.length];
      const creator = users[i % users.length];

      try {
        // Kontrollo nëse event ekziston tashmë (bazuar në trail, creator, dhe datë të ngjashme)
        const existingEvent = await EventModel.findOne({
          trail: trail._id,
          creator: creator._id,
          date: {
            $gte: new Date(eventData.date.getTime() - 24 * 60 * 60 * 1000),
            $lte: new Date(eventData.date.getTime() + 24 * 60 * 60 * 1000),
          },
        });

        if (existingEvent) {
          console.log(`⚠️  Event ekziston tashmë për "${eventData.title}"`);
          continue;
        }

        const event = new EventModel({
          trail: trail._id,
          creator: creator._id,
          date: eventData.date,
          location: eventData.location || trail.location,
          maxAttendees: eventData.maxAttendees,
          status: 'active',
          title: eventData.title,
          description: eventData.description,
        });

        await event.save();
        
        // Shto event në trail's events array
        await TrailModel.findByIdAndUpdate(trail._id, {
          $push: { events: event._id }
        });

        // Creator automatikisht shtohet si attendee nga pre-save hook
        createdEvents.push(event);
        console.log(`✓ Event u krijua: ${eventData.title} (${eventData.date.toLocaleDateString()})`);
      } catch (error: any) {
        console.error(`❌ Gabim gjatë krijimit të event "${eventData.title}":`, error.message);
      }
    }

    console.log('\n✅ Events u krijuan me sukses!');
    console.log(`\n📊 Statistikat:`);
    console.log(`   - Events të krijuar: ${createdEvents.length}/${upcomingEvents.length}`);

    console.log('\n📅 Events në të ardhmen:');
    createdEvents.forEach((event, index) => {
      console.log(`   ${index + 1}. ${event.title}`);
      console.log(`      Date: ${new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`);
      console.log(`      Location: ${event.location}`);
      console.log(`      Max Attendees: ${event.maxAttendees}`);
      console.log(`      ID: ${event._id}`);
    });

  } catch (error: any) {
    console.error('❌ Gabim gjatë krijimit të events:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Lidhja me MongoDB u mbyll.');
  }
}

// Ekzekuto skriptin
if (require.main === module) {
  seedEvents()
    .then(() => {
      console.log('\n✅ Skripta u ekzekutua me sukses!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Skripta dështoi:', error);
      process.exit(1);
    });
}

export { seedEvents };

