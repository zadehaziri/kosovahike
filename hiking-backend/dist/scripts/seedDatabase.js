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
exports.TEST_USERS = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const Trail_1 = __importDefault(require("../models/Trail"));
const Event_1 = __importDefault(require("../models/Event"));
const Blogs_1 = __importDefault(require("../models/Blogs"));
const config_1 = require("../config");
// Kredencialet e login-it
exports.TEST_USERS = [
    {
        firstName: 'Admin',
        lastName: 'User',
        email: 'zade.haziri13@gmail.com',
        password: 'admin1212.!',
        age: 30,
        gender: 'male',
        location: 'Prishtinë',
        skillLevel: 'advanced',
        hikeBuddy: true,
        description: 'Administrator i platformës KosovaHike',
    },
    {
        firstName: 'User',
        lastName: 'Account',
        email: 'zadehaziri@hotmail.com',
        password: 'admin1212.!',
        age: 25,
        gender: 'male',
        location: 'Prishtinë',
        skillLevel: 'intermediate',
        hikeBuddy: true,
        description: 'Përdorues i rregullt i platformës KosovaHike',
        interests: ['hiking', 'nature', 'adventure'],
        equipment: ['backpack', 'hiking boots', 'water bottle'],
    },
];
const SAMPLE_TRAILS = [
    {
        name: 'Rugova Canyon',
        location: 'Pejë',
        difficulty: 'moderate',
        length: '8 km',
        elevationGain: 450,
        duration: 4,
        routeType: 'out and back',
        description: 'Një nga kanionet më të bukura në Kosovë me pamje spektakolare.',
        photos: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            'https://images.unsplash.com/photo-1464822759844-d150ad6d0f87?w=800',
        ],
        keyFeatures: ['Waterfall', 'Canyon views', 'Rock formations'],
        tags: ['nature', 'canyon', 'moderate'],
        status: true,
    },
    {
        name: 'Bjeshkët e Nemuna',
        location: 'Junik',
        difficulty: 'hard',
        length: '15 km',
        elevationGain: 1200,
        duration: 7,
        routeType: 'loop',
        description: 'Ecje e vështirë përmes Bjeshkëve të Nemuna me pamje panoramike.',
        photos: [
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        ],
        keyFeatures: ['Mountain peaks', 'Alpine meadows', 'Wildlife'],
        tags: ['mountain', 'hard', 'alpine'],
        status: true,
    },
    {
        name: 'Gadime Cave Trail',
        location: 'Lipjan',
        difficulty: 'easy',
        length: '3 km',
        elevationGain: 100,
        duration: 1.5,
        routeType: 'out and back',
        description: 'Ecje e lehtë drejt shpellës së Gadimës, perfekte për fillestarë.',
        photos: [
            'https://images.unsplash.com/photo-1511497584788-876760111969?w=800',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        ],
        keyFeatures: ['Cave exploration', 'Easy trail', 'Family friendly'],
        tags: ['cave', 'easy', 'family'],
        status: true,
    },
    {
        name: 'Mirusha Waterfalls',
        location: 'Rahovec',
        difficulty: 'moderate',
        length: '6 km',
        elevationGain: 300,
        duration: 3,
        routeType: 'loop',
        description: 'Udhëtim përmes ujëvarave spektakolare të Mirushës.',
        photos: [
            'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        ],
        keyFeatures: ['Waterfalls', 'Swimming spots', 'Rock pools'],
        tags: ['waterfall', 'swimming', 'moderate'],
        status: true,
    },
    {
        name: 'Gjeravica Peak',
        location: 'Junik',
        difficulty: 'hard',
        length: '20 km',
        elevationGain: 1800,
        duration: 10,
        routeType: 'out and back',
        description: 'Ngjitje në majën më të lartë të Kosovës - Gjeravicën (2656m).',
        photos: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1464822759844-d150ad6d0f87?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=800&fit=crop',
        ],
        keyFeatures: ['Highest peak', 'Panoramic views', 'Challenging'],
        tags: ['peak', 'hard', 'summit'],
        status: true,
    },
];
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Lidhu me MongoDB
            console.log('Duke u lidhur me MongoDB...');
            yield mongoose_1.default.connect(config_1.config.mongo_uri);
            console.log('U lidh me sukses me MongoDB!');
            // Pastro koleksionet ekzistuese
            console.log('Duke pastruar të dhënat e vjetra...');
            yield User_1.default.deleteMany({});
            yield Trail_1.default.deleteMany({});
            yield Event_1.default.deleteMany({});
            yield Blogs_1.default.deleteMany({});
            console.log('Të dhënat e vjetra u pastruan!');
            // Krijo përdoruesit
            console.log('Duke krijuar përdoruesit...');
            const createdUsers = [];
            for (const userData of exports.TEST_USERS) {
                const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
                const user = new User_1.default(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
                const savedUser = yield user.save();
                createdUsers.push(savedUser);
                console.log(`✓ Përdoruesi u krijua: ${userData.email}`);
            }
            // Krijo trails
            console.log('Duke krijuar trails...');
            const createdTrails = [];
            for (const trailData of SAMPLE_TRAILS) {
                const trail = new Trail_1.default(trailData);
                const savedTrail = yield trail.save();
                createdTrails.push(savedTrail);
                console.log(`✓ Trail u krijua: ${trailData.name}`);
            }
            // Krijo disa events
            console.log('Duke krijuar events...');
            if (createdTrails.length > 0 && createdUsers.length > 0) {
                try {
                    const event1 = new Event_1.default({
                        trail: createdTrails[0]._id,
                        creator: createdUsers[0]._id,
                        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ditë nga tani
                        location: createdTrails[0].location,
                        maxAttendees: 10,
                        status: 'active',
                        title: `Ecje në ${createdTrails[0].name}`,
                        description: `Join us for an amazing hike at ${createdTrails[0].name}!`,
                    });
                    yield event1.save();
                    console.log(`✓ Event u krijua: ${event1.title}`);
                    const event2 = new Event_1.default({
                        trail: createdTrails[1]._id,
                        creator: createdUsers[1]._id,
                        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 ditë nga tani
                        location: createdTrails[1].location,
                        maxAttendees: 8,
                        status: 'active',
                        title: `Aventure në ${createdTrails[1].name}`,
                        description: `Challenging hike for experienced hikers!`,
                    });
                    yield event2.save();
                    console.log(`✓ Event u krijua: ${event2.title}`);
                }
                catch (error) {
                    console.warn('⚠️ Gabim gjatë krijimit të events (mund të jetë për shkak të hook-ut):', error);
                }
            }
            // Krijo disa blogs
            console.log('Duke krijuar blogs...');
            if (createdUsers.length > 0) {
                const blog1 = new Blogs_1.default({
                    author: createdUsers[0]._id,
                    authorName: `${createdUsers[0].firstName} ${createdUsers[0].lastName}`,
                    title: 'Udhëtimi im i parë në Rugova Canyon',
                    content: 'Rugova Canyon është një nga vendet më të bukura që kam vizituar në Kosovë. Pamjet janë spektakolare dhe ecja është e moderuar, perfekte për fillestarë që duan të provojnë diçka pak më të vështirë.',
                    seenCount: 0,
                });
                yield blog1.save();
                console.log(`✓ Blog u krijua: ${blog1.title}`);
                const blog2 = new Blogs_1.default({
                    author: createdUsers[1]._id,
                    authorName: `${createdUsers[1].firstName} ${createdUsers[1].lastName}`,
                    title: 'Këshilla për fillestarë në ecje',
                    content: 'Nëse je fillestar në botën e ecjeve, këtu janë disa këshilla të rëndësishme: 1) Përgatitu me pajisje të duhura, 2) Filloni me ecje të lehta, 3) Merreni ujë dhe ushqim të mjaftueshëm, 4) Ecni me shoqëri për siguri.',
                    seenCount: 0,
                });
                yield blog2.save();
                console.log(`✓ Blog u krijua: ${blog2.title}`);
            }
            console.log('\n✅ Database u krijua me sukses!');
            console.log(`\n📊 Statistikat:`);
            console.log(`   - Përdorues: ${createdUsers.length}`);
            console.log(`   - Trails: ${createdTrails.length}`);
            console.log(`   - Events: 2`);
            console.log(`   - Blogs: 2`);
        }
        catch (error) {
            console.error('❌ Gabim gjatë krijimit të database:', error);
            throw error;
        }
        finally {
            yield mongoose_1.default.connection.close();
            console.log('\n🔌 Lidhja me MongoDB u mbyll.');
        }
    });
}
// Ekzekuto skriptin
if (require.main === module) {
    seedDatabase()
        .then(() => {
        console.log('\n✨ Procesi u përfundua me sukses!');
        process.exit(0);
    })
        .catch((error) => {
        console.error('\n💥 Procesi dështoi:', error);
        process.exit(1);
    });
}
exports.default = seedDatabase;
//# sourceMappingURL=seedDatabase.js.map