# 🚀 Konfigurim i Shpejtë i Database Private

## Hapi 1: Krijo .env File

Në `hiking-backend/` krijo një file me emrin `.env` dhe vendos:

```env
MONGO_URI=mongodb://localhost:27017/kosovahike
APP_SECRET=your_super_secret_key_here
PORT=5000
```

## Hapi 2: Zgjidh Opsionin tënd

### Opsioni A: MongoDB Lokal (Rekomanduar)

1. **Instalo MongoDB:**
   - Windows: https://www.mongodb.com/try/download/community
   - Ose përdor Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

2. **Në `.env` file:**
   ```env
   MONGO_URI=mongodb://localhost:27017/kosovahike
   ```

3. **Starto MongoDB:**
   ```bash
   # Windows
   net start MongoDB
   
   # Docker
   docker start mongodb
   ```

### Opsioni B: MongoDB Atlas (Cloud)

1. **Krijo cluster në MongoDB Atlas:**
   - Shko në https://www.mongodb.com/cloud/atlas
   - Krijo account dhe cluster të ri
   - Krijo database user
   - Shto IP address tënd në Network Access

2. **Merr connection string dhe vendos në `.env`:**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kosovahike?retryWrites=true&w=majority
   ```

## Hapi 3: Seed Database

```bash
cd hiking-backend
npm run seed
```

## Hapi 4: Starto Backend

```bash
npm run dev
```

## ✅ Gati!

Tani databaza është private dhe vetëm ti ke akses!

**E rëndësishme:**
- `.env` file nuk do të commit-ohet në Git (është në .gitignore)
- Mos e ndaj `.env` file me askënd
- Përdor password të fortë për database user

