import mongoose from 'mongoose';
import BlogsModel from '../models/Blogs';
import UserModel from '../models/User';
import { config } from '../config';

// Blog posts që duhen krijuar me ID-të specifike
const BLOG_POSTS = [
  {
    _id: new mongoose.Types.ObjectId('660eaf4c8a8485b530a4ce74'),
    title: 'Best Backpacking Gear of 2024',
    authorName: 'KosovaHike Team',
    content: `Planning your next backpacking adventure? Here's our comprehensive guide to the best backpacking gear of 2024. From lightweight tents to durable sleeping bags, we've tested and reviewed the top products on the market.

**Backpacks:**
- Osprey Atmos AG 65 - Best Overall
- REI Co-op Flash 55 - Best Value
- Hyperlite Mountain Gear Southwest 3400 - Best Ultralight

**Sleeping Systems:**
- Big Agnes Copper Spur HV UL2 Tent - Lightweight and spacious
- Therm-a-Rest NeoAir XTherm Sleeping Pad - Superior insulation
- Western Mountaineering Versalite Sleeping Bag - Perfect 3-season bag

**Cooking Gear:**
- Jetboil Flash Cooking System - Fast and efficient
- MSR PocketRocket 2 Stove - Compact and reliable
- Sea to Summit Alpha Light Spork - Lightweight eating utensil

**Clothing:**
- Patagonia Capilene Cool Daily Shirt - Moisture-wicking base layer
- Arc'teryx Beta AR Jacket - Weather protection
- Darn Tough Socks - Durable and comfortable

Each piece of gear has been carefully selected based on durability, weight, and performance in real-world conditions. Whether you're planning a weekend trip or a multi-week adventure, this gear will serve you well.`,
    images: [
      {
        name: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=800&fit=crop',
        type: 'image/jpeg'
      },
      {
        name: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1200&h=800&fit=crop',
        type: 'image/jpeg'
      }
    ],
    seenCount: 0
  },
  {
    _id: new mongoose.Types.ObjectId('660eb12a8a8485b530a4d1ae'),
    title: 'How to Choose Hiking Shoes',
    authorName: 'KosovaHike Team',
    content: `Choosing the right hiking shoes is crucial for a comfortable and safe hiking experience. Here's everything you need to know to find the perfect pair.

**Types of Hiking Footwear:**
1. **Trail Running Shoes** - Lightweight, flexible, great for day hikes
2. **Hiking Shoes** - Mid-weight, good ankle support, versatile
3. **Hiking Boots** - Heavy-duty, maximum support, best for challenging terrain
4. **Mountaineering Boots** - Rigid, insulated, for technical climbs

**Key Factors to Consider:**
- **Terrain Type**: Rocky trails need more support than smooth paths
- **Distance**: Longer hikes require more cushioning
- **Weather Conditions**: Waterproofing for wet climates
- **Fit**: Most important factor - shoes should fit snugly but not tight

**Sizing Tips:**
- Try on shoes at the end of the day when feet are swollen
- Wear the same socks you'll hike in
- Leave thumb-width space at the toe
- Walk around the store to test comfort

**Break-in Period:**
Most hiking shoes require a break-in period. Start with short walks and gradually increase distance. Properly broken-in shoes will prevent blisters and discomfort on longer hikes.

Remember: The best hiking shoes are the ones that fit YOUR feet perfectly!`,
    images: [
      {
        name: 'https://d1nymbkeomeoqg.cloudfront.net/photos/15/51/276634_24231_M2.jpg',
        type: 'image/jpeg'
      },
      {
        name: 'https://images.unsplash.com/photo-1544966503-7d5883586b30?w=1200&h=800&fit=crop',
        type: 'image/jpeg'
      }
    ],
    seenCount: 0
  },
  {
    _id: new mongoose.Types.ObjectId('660eb3798a8485b530a4d406'),
    title: '10 Best Trail Running Shoes',
    authorName: 'KosovaHike Team',
    content: `Trail running combines the joy of running with the beauty of nature. Here are the top 10 trail running shoes for 2024 that offer the perfect balance of comfort, protection, and performance.

**Top Picks:**
1. **Salomon Speedcross 6** - Best for aggressive trails
2. **Hoka Speedgoat 5** - Best cushioning
3. **Brooks Cascadia 17** - Most durable
4. **Altra Lone Peak 7** - Best zero-drop option
5. **Saucony Peregrine 13** - Best for technical terrain
6. **New Balance Fresh Foam X More Trail v3** - Best for long distances
7. **Merrell MTL Long Sky 2** - Lightweight and fast
8. **The North Face VECTIV Enduris 3** - Best value
9. **La Sportiva Bushido II** - Best grip
10. **Inov-8 Trailfly G 270 V2** - Best for speed

**Key Features to Look For:**
- Aggressive lugs for traction on muddy and rocky trails
- Rock plate protection for technical terrain
- Cushioning appropriate for your distance
- Breathable yet protective upper
- Secure fit that prevents foot movement

**Our Testing Process:**
Each shoe was tested on various trail conditions including mud, rocks, roots, and smooth paths. We evaluated comfort, durability, traction, and overall performance over multiple runs.`,
    images: [
      {
        name: 'https://d1nymbkeomeoqg.cloudfront.net/photos/28/53/406866_25193_M2.jpg',
        type: 'image/jpeg'
      },
      {
        name: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&h=800&fit=crop',
        type: 'image/jpeg'
      }
    ],
    seenCount: 0
  },
  {
    _id: new mongoose.Types.ObjectId('660eb5fd8a8485b530a4d9d0'),
    title: '10 Best Hiking Boots of 2024',
    authorName: 'KosovaHike Team',
    content: `When it comes to serious hiking, nothing beats a good pair of hiking boots. We've tested dozens of boots to bring you the 10 best hiking boots of 2024.

**Top Hiking Boots:**
1. **Salomon Quest 4 GTX** - Best Overall
   - Excellent ankle support
   - Waterproof and breathable
   - Durable construction

2. **Merrell Moab 3 Mid Waterproof** - Best Value
   - Comfortable right out of the box
   - Great for day hikes
   - Affordable price point

3. **Lowa Renegade GTX Mid** - Best for Long Hikes
   - Superior comfort
   - Excellent durability
   - Great arch support

4. **Keen Targhee III Mid Waterproof** - Best Wide Fit
   - Roomy toe box
   - Excellent traction
   - Great for wide feet

5. **Oboz Bridger B-Dry** - Best Waterproofing
   - Superior water protection
   - Excellent traction
   - Durable construction

6. **Vasque Breeze AT Mid GTX** - Best Breathability
   - Lightweight design
   - Excellent ventilation
   - Quick drying

7. **Asolo Fugitive GTX** - Best for Technical Terrain
   - Rigid support
   - Excellent grip
   - Durable sole

8. **Danner Mountain 600** - Best Versatility
   - Works for hiking and daily wear
   - Comfortable fit
   - Stylish design

9. **Scarpa Zodiac Plus GTX** - Best for Alpine Terrain
   - Technical performance
   - Excellent support
   - Durable materials

10. **La Sportiva Nucleo High GTX** - Best Lightweight Boot
    - Lightweight yet protective
    - Excellent fit
    - Great for fast hiking

**What Makes a Great Hiking Boot:**
- Proper ankle support
- Waterproof protection
- Durable outsole with good traction
- Comfortable fit
- Breathable materials

**Sizing and Fit:**
Always try boots on with hiking socks and at the end of the day. Look for a snug heel, roomy toe box, and no pressure points.`,
    images: [
      {
        name: 'https://d1nymbkeomeoqg.cloudfront.net/photos/27/50/396478_2910_M2.jpg',
        type: 'image/jpeg'
      },
      {
        name: 'https://images.unsplash.com/photo-1544966503-7d5883586b30?w=1200&h=800&fit=crop',
        type: 'image/jpeg'
      }
    ],
    seenCount: 0
  },
  {
    _id: new mongoose.Types.ObjectId('660eb80f8a8485b530a4dab6'),
    title: 'Best Hiking Shoes for Women of 2024',
    authorName: 'KosovaHike Team',
    content: `Women's hiking shoes are designed with different needs in mind. Here are the best hiking shoes specifically designed for women in 2024.

**Top Women's Hiking Shoes:**
1. **Salomon X Ultra 4 GTX W** - Best Overall
   - Lightweight and comfortable
   - Excellent traction
   - Waterproof protection

2. **Merrell Moab 3 Waterproof** - Best Value
   - Comfortable fit
   - Great for beginners
   - Affordable price

3. **Hoka Speedgoat 5** - Best for Trail Running
   - Excellent cushioning
   - Lightweight design
   - Great for fast hikes

4. **Keen Targhee III Waterproof** - Best Wide Fit
   - Roomy toe box
   - Excellent for wider feet
   - Durable construction

5. **Adidas Terrex Swift R3 GTX** - Best Style
   - Modern design
   - Great performance
   - Versatile for hiking and daily wear

6. **La Sportiva Spire GTX** - Best Lightweight Boot
   - Incredibly light
   - Excellent protection
   - Great for long hikes

**What Makes Women's Hiking Shoes Different:**
- Narrower heel design
- Softer midsole for lighter weight
- Different last shape
- Shorter lacing system
- Color options

**Fit Considerations for Women:**
- Women's feet are typically narrower
- Lower volume in the forefoot
- Different arch height
- Consider width options (regular vs wide)

**Our Recommendations:**
- For day hikes: Lightweight hiking shoes
- For multi-day trips: Mid-weight boots with good support
- For wet conditions: Waterproof options essential
- For hot climates: Breathable, non-waterproof versions

Remember to try on multiple brands and models to find the perfect fit for your unique foot shape!`,
    images: [
      {
        name: 'https://d1nymbkeomeoqg.cloudfront.net/photos/27/82/399751_31740_M2.jpg',
        type: 'image/jpeg'
      },
      {
        name: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200&h=800&fit=crop',
        type: 'image/jpeg'
      }
    ],
    seenCount: 0
  },
  {
    _id: new mongoose.Types.ObjectId('660eb9818a8485b530a4dba8'),
    title: 'Best Trekking Poles of 2024',
    authorName: 'KosovaHike Team',
    content: `Trekking poles are essential gear for serious hikers. They reduce impact on your knees, improve balance, and help you maintain a steady pace. Here are the best trekking poles of 2024.

**Top Trekking Poles:**
1. **Black Diamond Trail Ergo Cork** - Best Overall
   - Ergonomic grip
   - Cork handles reduce sweat
   - Excellent shock absorption

2. **Leki Micro Vario Carbon** - Best Lightweight
   - Ultra-lightweight carbon construction
   - Compact when folded
   - Great for long-distance hikes

3. **Cascade Mountain Tech Carbon Fiber** - Best Value
   - Affordable price
   - Good quality
   - Great for beginners

4. **Komperdell Carbon Powerlock Pro** - Best Durability
   - Extremely durable
   - Reliable locking mechanism
   - Excellent for tough terrain

5. **REI Co-op Flash Carbon** - Best for Budget
   - Carbon fiber at great price
   - Lightweight and durable
   - Good customer support

**Types of Trekking Poles:**
- **Fixed Length**: Lightest and most durable, but less versatile
- **Telescoping**: Adjustable length, most common type
- **Folding (Z-Poles)**: Most compact, great for travel

**Key Features:**
- **Grip Material**: Cork, foam, or rubber
- **Shaft Material**: Aluminum (durable) or Carbon (lightweight)
- **Locking Mechanism**: Twist lock vs lever lock
- **Basket Size**: Small for summer, large for snow

**Benefits of Using Trekking Poles:**
- Reduce stress on knees by up to 25%
- Improve balance on difficult terrain
- Help maintain rhythm and pace
- Provide stability on stream crossings
- Can be used to pitch ultralight tents

**Proper Technique:**
- Adjust height so elbow forms 90-degree angle
- Use straps correctly for maximum efficiency
- Plant poles ahead of your feet going uphill
- Plant poles behind going downhill
- Use both poles for maximum benefit

**Our Recommendation:**
Start with adjustable aluminum poles for versatility and durability. As you gain experience, you may want to invest in lightweight carbon fiber poles for long-distance hikes.`,
    images: [
      {
        name: 'https://d1nymbkeomeoqg.cloudfront.net/photos/26/87/390249_4047_M2.jpg',
        type: 'image/jpeg'
      },
      {
        name: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=800&fit=crop',
        type: 'image/jpeg'
      }
    ],
    seenCount: 0
  },
  {
    _id: new mongoose.Types.ObjectId('660ea9d78a8485b530a4cd5e'),
    title: 'Best Hiking Shorts',
    authorName: 'KosovaHike Team',
    content: `Hiking shorts are an essential part of your gear, especially for warm-weather adventures. Here's our guide to the best hiking shorts of 2024.

**Top Hiking Shorts:**
1. **Patagonia Baggies 5"** - Best Overall
   - Quick-drying fabric
   - Built-in briefs
   - Durable construction

2. **Outdoor Research Ferrosi Shorts** - Best Versatility
   - Great for hiking and climbing
   - Stretch fabric for mobility
   - Multiple pockets

3. **Prana Stretch Zion Shorts** - Best Durability
   - Extremely durable
   - Great fit
   - Quick-drying

4. **Arc'teryx Palisade Shorts** - Best Lightweight
   - Ultra-lightweight
   - Excellent breathability
   - Minimalist design

5. **Kuhl Renegade Shorts** - Best Features
   - Multiple pockets
   - Great fit
   - Durable construction

**Key Features to Look For:**
- **Fabric**: Quick-drying, moisture-wicking material
- **Fit**: Comfortable waistband, roomy enough for movement
- **Length**: 5-7 inches for optimal mobility
- **Pockets**: At least one secure pocket for essentials
- **Durability**: Reinforced seams and abrasion-resistant fabric

**Types of Hiking Shorts:**
- **Traditional Shorts**: Most common, zippered pockets
- **Swim/Hike Hybrid**: Can be used for both activities
- **Convertible Pants**: Zip-off legs for versatility
- **Tight/Compression**: For trail running and fast hiking

**Sizing Tips:**
- Try on shorts while wearing a belt
- Ensure enough room in the thighs
- Check length doesn't restrict movement
- Consider sizing up for layered clothing underneath

**Best Practices:**
- Choose moisture-wicking fabrics for hot weather
- Consider longer shorts (7-9") for sun protection
- Look for UPF protection in sunny climates
- Quick-dry is essential for stream crossings

**Our Recommendation:**
For most hikers, we recommend the Patagonia Baggies or similar - they're comfortable, quick-drying, and versatile enough for most hiking conditions.`,
    images: [
      {
        name: 'hiking-shorts-1.jpg',
        type: 'image/jpeg'
      }
    ],
    seenCount: 0
  },
  {
    _id: new mongoose.Types.ObjectId('660eba7c8a8485b530a4de1a'),
    title: 'Best Windbreakers',
    authorName: 'KosovaHike Team',
    content: `A good windbreaker is essential for protecting against wind and light rain while maintaining breathability. Here are the best windbreakers for hiking in 2024.

**Top Windbreakers:**
1. **Arc'teryx Squamish Hoody** - Best Overall
   - Ultralight and packable
   - Excellent wind protection
   - Great breathability

2. **Patagonia Houdini Air** - Best Breathability
   - Superior airflow
   - Lightweight design
   - Packable

3. **Mountain Hardwear Kor Airshell** - Best Value
   - Great performance
   - Affordable price
   - Durable construction

4. **Rab Boreas Pull-On** - Best for Running
   - Lightweight
   - Excellent fit
   - Great for active pursuits

5. **The North Face HyperAir GTX** - Best Water Protection
   - Waterproof and breathable
   - Lightweight
   - Excellent performance

**What Makes a Great Windbreaker:**
- **Weight**: Should be lightweight and packable
- **Breathability**: Prevents overheating during activity
- **Wind Resistance**: Blocks wind effectively
- **Water Resistance**: Light rain protection
- **Packability**: Should pack down small

**When to Use a Windbreaker:**
- Windy conditions on exposed ridges
- Light rain protection
- As a lightweight layer over base layer
- For fast-paced hiking to prevent chill
- As an emergency layer in your pack

**Layering with Windbreakers:**
- Base layer + Windbreaker for mild conditions
- Base layer + Fleece + Windbreaker for cooler weather
- Can be worn over down jackets for wind protection
- Works well as a mid-layer under rain jackets

**Key Differences from Rain Jackets:**
- Windbreakers are more breathable
- Lighter weight and more packable
- Less waterproof protection
- Better for active pursuits
- More affordable

**Our Recommendation:**
The Arc'teryx Squamish Hoody offers the best balance of protection, breathability, and packability. For budget-conscious hikers, the Mountain Hardwear Kor Airshell is an excellent choice.`,
    images: [
      {
        name: 'https://d1nymbkeomeoqg.cloudfront.net/photos/27/35/394994_3131_M2.jpg',
        type: 'image/jpeg'
      },
      {
        name: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        type: 'image/jpeg'
      }
    ],
    seenCount: 0
  },
  {
    _id: new mongoose.Types.ObjectId('660ebc638a8485b530a4e0d2'),
    title: 'Best Hiking Pants of 2024',
    authorName: 'KosovaHike Team',
    content: `Hiking pants are essential gear that protects your legs while providing comfort and mobility. Here's our comprehensive guide to the best hiking pants of 2024.

**Top Hiking Pants:**
1. **Prana Stretch Zion Pants** - Best Overall
   - Excellent durability
   - Great fit and mobility
   - Quick-drying fabric

2. **Outdoor Research Ferrosi Pants** - Best Versatility
   - Great for hiking and climbing
   - Stretch fabric
   - Excellent mobility

3. **Arc'teryx Gamma LT Pants** - Best Lightweight
   - Ultra-lightweight
   - Excellent breathability
   - Durable materials

4. **Patagonia Quandary Pants** - Best Value
   - Comfortable fit
   - Good features
   - Affordable price

5. **Kuhl Renegade Pants** - Best Durability
   - Extremely durable
   - Great fit
   - Multiple pockets

**Key Features to Look For:**
- **Fabric**: Stretch, quick-drying, and durable
- **Fit**: Comfortable waistband, roomy in thighs
- **Ventilation**: Zippered vents for temperature regulation
- **Pockets**: Secure pockets for essentials
- **Durability**: Reinforced knees and seat area

**Types of Hiking Pants:**
- **Standard Pants**: Full-length, most common
- **Convertible Pants**: Zip-off legs become shorts
- **Tight Pants**: For trail running and fast hiking
- **Waterproof Pants**: For wet conditions

**Sizing Tips:**
- Try on pants with hiking boots
- Ensure enough room in the knees and thighs
- Check length allows for movement
- Consider different inseam lengths

**Best Practices:**
- Choose pants with stretch for mobility
- Look for UPF protection in sunny climates
- Quick-dry fabric for stream crossings
- Consider convertible options for versatility
- Reinforced areas for durability

**Our Recommendation:**
The Prana Stretch Zion Pants offer the best combination of durability, comfort, and performance. They're suitable for a wide range of conditions and hold up well over time.`,
    images: [
      {
        name: 'https://d1nymbkeomeoqg.cloudfront.net/photos/28/79/409424_24227_M2.jpg',
        type: 'image/jpeg'
      },
      {
        name: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=800&fit=crop',
        type: 'image/jpeg'
      }
    ],
    seenCount: 0
  }
];

async function seedBlogPosts() {
  try {
    // Lidhu me MongoDB
    console.log('Duke u lidhur me MongoDB...');
    await mongoose.connect(config.mongo_uri);
    console.log('U lidh me sukses me MongoDB!');

    // Gjej një përdorues për author
    const user = await UserModel.findOne({ email: 'zade.haziri13@gmail.com' });
    
    if (!user) {
      console.error('❌ Përdorues nuk u gjet! Ju lutem ekzekutoni seedDatabase.ts fillimisht.');
      await mongoose.connection.close();
      return;
    }

    console.log(`✓ Përdorues u gjet: ${user.firstName} ${user.lastName}`);

    // Krijo blog posts
    console.log('\nDuke krijuar blog posts...');
    const createdBlogs = [];

    for (const blogData of BLOG_POSTS) {
      try {
        // Kontrollo nëse blog post ekziston tashmë
        const existingBlog = await BlogsModel.findById(blogData._id);
        
        if (existingBlog) {
          console.log(`⚠️  Blog post me ID ${blogData._id} ekziston tashmë. Duke e përditësuar...`);
          // Përditëso blog post ekzistues duke përdorur findOneAndUpdate
          const updatedBlog = await BlogsModel.findOneAndUpdate(
            { _id: blogData._id },
            {
              title: blogData.title,
              authorName: blogData.authorName,
              content: blogData.content,
              images: blogData.images || []
            },
            { new: true }
          );
          if (updatedBlog) {
            createdBlogs.push(updatedBlog);
            console.log(`✓ Blog post u përditësua: ${blogData.title}`);
          }
        } else {
          // Krijo blog post të ri duke përdorur create për të shmangur type errors
          const blogDataToSave = {
            _id: blogData._id,
            author: user._id,
            authorName: blogData.authorName,
            title: blogData.title,
            content: blogData.content,
            images: blogData.images || [],
            seenCount: blogData.seenCount || 0,
            date: new Date()
          };
          
          const savedBlog = await BlogsModel.create(blogDataToSave);
          
          // Shto blog post në user's blogPosts array
          await UserModel.findByIdAndUpdate(user._id, {
            $push: { blogPosts: savedBlog._id }
          });
          
          createdBlogs.push(savedBlog);
          console.log(`✓ Blog post u krijua: ${blogData.title} (ID: ${blogData._id})`);
        }
      } catch (error: any) {
        console.error(`❌ Gabim gjatë krijimit të blog post "${blogData.title}":`, error.message);
      }
    }

    console.log('\n✅ Blog posts u krijuan me sukses!');
    console.log(`\n📊 Statistikat:`);
    console.log(`   - Blog posts të krijuar: ${createdBlogs.length}/${BLOG_POSTS.length}`);

    console.log('\n📝 Blog Posts IDs:');
    createdBlogs.forEach((blog, index) => {
      console.log(`   ${index + 1}. ${blog.title}`);
      console.log(`      ID: ${blog._id}`);
      console.log(`      Link: /blog-posts/${blog._id}`);
    });

  } catch (error: any) {
    console.error('❌ Gabim gjatë krijimit të blog posts:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Lidhja me MongoDB u mbyll.');
  }
}

// Ekzekuto skriptin
if (require.main === module) {
  seedBlogPosts()
    .then(() => {
      console.log('\n✅ Skripta u ekzekutua me sukses!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Skripta dështoi:', error);
      process.exit(1);
    });
}

export { seedBlogPosts, BLOG_POSTS };

