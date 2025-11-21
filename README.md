# 🏔️ KosovaHike

**KosovaHike** is a comprehensive full-stack hiking trail management platform designed to connect passionate hikers, organize exciting outdoor events, and provide comprehensive resources for hiking adventures in Kosovo. Whether you're a beginner or an experienced trekker, join our community to discover hidden gems, share experiences, and create unforgettable memories in the heart of nature.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

---

## ✨ Features

### 🥾 Trail Management
- Browse and discover hiking trails in Kosovo
- Detailed trail information with difficulty levels
- Interactive maps with Leaflet integration
- Trail reviews and ratings
- Track your completed trails
- User trail statistics and progress

### 👥 User Management
- User authentication (Login/Signup)
- User profiles with customizable information
- Profile image upload
- User roles (Admin, User)
- Secure password hashing with bcrypt
- JWT-based authentication

### 📝 Blog System
- Create and share hiking blog posts
- Browse community blog posts
- Rich content support

### 📅 Events
- Discover upcoming hiking events
- Create and manage events
- Join community events

### 👋 Hiking Buddy
- Find hiking companions
- Connect with fellow hikers
- Plan group hikes

### ⏰ Reminders
- Set hiking reminders
- Never miss an important hike or event

### 🎒 Gear & Equipment
- Comprehensive gear guides
- Equipment recommendations by difficulty level
- Easy, Moderate, and Hard trail gear guides

### 🛒 E-Commerce
- Browse and purchase hiking gear
- Shopping cart functionality
- Order management

### 🌤️ Weather Integration
- Weather forecasts for hiking locations
- Plan your hikes based on weather conditions

### 💬 Chat Helper
- Interactive chatbot for hiking FAQs
- Quick answers to common questions

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **Redux Toolkit** - State management
- **React Router DOM** - Routing
- **Leaflet & React-Leaflet** - Interactive maps
- **Axios** - HTTP client
- **SCSS/Sass** - Styling
- **Ant Design** - UI components
- **React Icons** - Icon library
- **Moment.js** - Date manipulation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT (jsonwebtoken)** - Authentication
- **Bcrypt** - Password hashing
- **Multer & GridFS** - File uploads
- **Nodemailer** - Email service
- **CORS** - Cross-origin resource sharing

### Database
- **MongoDB Atlas** - Cloud database service

### Deployment
- **Render** - Backend hosting
- **Netlify** - Frontend hosting

---

## 📁 Project Structure

```
KosovaHike/
│
├── hiking-backend/          # Backend API (Node.js/Express/TypeScript)
│   ├── src/
│   │   ├── apis/           # API route definitions
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # MongoDB models
│   │   ├── services/       # Service layer (email, token)
│   │   ├── middleware/     # Express middleware
│   │   ├── db/             # Database configuration
│   │   └── scripts/        # Utility scripts
│   ├── dist/               # Compiled JavaScript
│   └── package.json
│
├── hiking-frontend/         # Frontend Application (React)
│   └── hiking-app/
│       ├── src/
│       │   ├── components/ # Reusable components
│       │   ├── pages/      # Page components
│       │   ├── redux/      # Redux store and slices
│       │   ├── routes/     # Route definitions
│       │   ├── services/   # API services
│       │   └── styles/     # Global styles
│       └── package.json
│
├── DEPLOY.md               # Deployment guide
├── GITHUB_SETUP.md         # GitHub repository setup
├── GIT_UPLOAD_COMMANDS.md  # Git commands reference
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB Atlas account** (or local MongoDB)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zadehaziri/kosovahike.git
   cd KosovaHike
   ```

2. **Install Backend Dependencies**
   ```bash
   cd hiking-backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../hiking-frontend/hiking-app
   npm install
   ```

---

## ⚙️ Environment Variables

### Backend (.env in `hiking-backend/`)

Create a `.env` file in the `hiking-backend` directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kosovahike
APP_SECRET=your_super_secret_jwt_key_minimum_32_characters
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3001

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend (.env in `hiking-frontend/hiking-app/`)

Create a `.env` file in the `hiking-frontend/hiking-app` directory:

```env
REACT_APP_API_URL=http://localhost:5000
NODE_ENV=development
```

> **Note:** See `hiking-backend/ENV_TEMPLATE.txt` for a complete environment variable template.

---

## 🏃 Running the Project

### Development Mode

1. **Start the Backend Server**
   ```bash
   cd hiking-backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Application**
   ```bash
   cd hiking-frontend/hiking-app
   npm start
   ```
   The frontend will run on `http://localhost:3001`

### Production Build

1. **Build the Backend**
   ```bash
   cd hiking-backend
   npm run build
   npm start
   ```

2. **Build the Frontend**
   ```bash
   cd hiking-frontend/hiking-app
   npm run build
   ```

---

## 📚 Available Scripts

### Backend Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
npm run seed         # Seed database with sample data
npm run seed-blogs   # Seed blog posts
npm run seed-events  # Seed events
npm run list-users   # List all users
npm run set-admin    # Set user as admin
```

### Frontend Scripts

```bash
npm start            # Start development server
npm run build        # Create production build
npm test             # Run tests
npm run eject        # Eject from Create React App
```

---

## 🗄️ Database Setup

### MongoDB Atlas Setup

1. Create a free MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or allow from anywhere for development)
5. Get your connection string and add it to `.env` as `MONGO_URI`

For detailed instructions, see:
- `hiking-backend/MONGODB_ATLAS_SETUP.md`
- `hiking-backend/QUICK_DATABASE_SETUP.md`
- `hiking-backend/CONFIG_DATABASE.md`

---

## 🚢 Deployment

This project can be deployed on:
- **Backend:** Render, Railway, Heroku, or any Node.js hosting service
- **Frontend:** Netlify, Vercel, or any static hosting service
- **Database:** MongoDB Atlas (cloud)

For detailed deployment instructions, see [DEPLOY.md](./DEPLOY.md)

### Quick Deployment Checklist

- [ ] Set up MongoDB Atlas database
- [ ] Configure environment variables on hosting platform
- [ ] Update CORS settings with production frontend URL
- [ ] Build and deploy backend
- [ ] Build and deploy frontend
- [ ] Test all features in production

---

## 📖 API Endpoints

### Authentication
- `POST /api/users/signup` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (Protected)

### Trails
- `GET /api/trails` - Get all trails
- `GET /api/trails/:id` - Get trail by ID
- `POST /api/trails` - Create trail (Protected)
- `PUT /api/trails/:id` - Update trail (Protected)
- `DELETE /api/trails/:id` - Delete trail (Protected)

### Blogs
- `GET /api/blogs` - Get all blog posts
- `GET /api/blogs/:id` - Get blog post by ID
- `POST /api/blogs` - Create blog post (Protected)

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (Protected)

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create review (Protected)

For more API documentation, explore the `hiking-backend/src/apis/` directory.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Authors

- **Project Team** - [GitHub Repository](https://github.com/zadehaziri/kosovahike)

---

## 🙏 Acknowledgments

- All the passionate hikers who contribute to the Kosovo hiking community
- The open-source libraries that make this project possible
- MongoDB Atlas for providing free cloud database hosting

---

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

## 🗺️ Roadmap

- [ ] Mobile app version
- [ ] Real-time chat features
- [ ] Advanced trail filtering
- [ ] Social sharing features
- [ ] Integration with fitness tracking apps
- [ ] Multi-language support

---

**Happy Hiking! 🥾🏔️**

