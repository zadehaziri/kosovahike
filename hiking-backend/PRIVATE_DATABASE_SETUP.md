# Konfigurimi i Database Private - Vetëm për Ty

Ky guide do të të ndihmojë të konfigurosh databazën tënde private që vetëm ti ta kesh akses.

## 🎯 Opsionet e Disponueshme

### Opsioni 1: MongoDB Lokal (Rekomanduar për siguri maksimale)

**Përparësitë:**
- ✅ 100% private - vetëm në kompjuterin tënd
- ✅ Nuk ka kosto
- ✅ Kontroll i plotë
- ✅ Nuk ka limit në përdorim

**Hapat:**

1. **Instalo MongoDB Community Edition:**
   - Windows: Shkarko nga https://www.mongodb.com/try/download/community
   - Ose përdor MongoDB via Docker (më e lehtë)

2. **Përdor Docker (Më e lehtë):**
   ```bash
   docker run -d -p 27017:27017 --name mongodb -e MONGO_INITDB_DATABASE=kosovahike mongo:latest
   ```

3. **Krijo `.env` file në `hiking-backend/`:**
   ```env
   MONGO_URI=mongodb://localhost:27017/kosovahike
   APP_SECRET=your_super_secret_key_here
   PORT=5000
   ```

4. **Ndrysho `src/config.ts`:**
   ```typescript
   mongo_uri: process.env.MONGO_URI || 'mongodb://localhost:27017/kosovahike',
   ```

5. **Seed database:**
   ```bash
   npm run seed
   ```

---

### Opsioni 2: MongoDB Atlas Private Cluster

**Përparësitë:**
- ✅ Private dhe secure
- ✅ Backup automatik
- ✅ Akses nga kudo
- ✅ Free tier disponueshëm

**Hapat:**

1. **Krijo MongoDB Atlas Account:**
   - Shko në https://www.mongodb.com/cloud/atlas
   - Krijo account të ri (ose përdor të vjetrin)

2. **Krijo Cluster të ri:**
   - Kliko "Build a Database"
   - Zgjidh "M0 FREE" tier (ose më të lartë)
   - Zgjidh region më afër teje
   - Krijo cluster-in

3. **Konfiguro Network Access:**
   - Shko te "Network Access"
   - Shto IP address tënd (ose përdor `0.0.0.0/0` për akses nga kudo - jo e sigurt për production)
   - Për siguri më të mirë, shto vetëm IP-të që do t'i përdorësh

4. **Krijo Database User:**
   - Shko te "Database Access"
   - Kliko "Add New Database User"
   - Zgjidh "Password" authentication
   - Krijo username dhe password të fortë
   - Zgjidh "Atlas admin" role
   - Kliko "Add User"

5. **Merr Connection String:**
   - Shko te "Database" → "Connect"
   - Zgjidh "Connect your application"
   - Kopjo connection string-un
   - Zëvendëso `<password>` me password-in që krijove
   - Zëvendëso `<dbname>` me `kosovahike` ose emrin që dëshiron

6. **Krijo `.env` file:**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/kosovahike?retryWrites=true&w=majority
   APP_SECRET=your_super_secret_key_here
   PORT=5000
   ```

7. **Ndrysho `src/config.ts`:**
   ```typescript
   mongo_uri: process.env.MONGO_URI || 'mongodb://localhost:27017/kosovahike',
   ```

8. **Seed database:**
   ```bash
   npm run seed
   ```

---

## 🔒 Siguria e Database-it

### Për MongoDB Lokal:
- ✅ Vetëm ti ke akses
- ✅ Nuk ka nevojë për internet
- ✅ Të dhënat janë në kompjuterin tënd

### Për MongoDB Atlas:
- ✅ Përdor password të fortë (min 12 karaktere, me numra, shkronja, simbole)
- ✅ Aktivizo MFA (Multi-Factor Authentication) nëse është e mundur
- ✅ Kufizo Network Access vetëm për IP-të që i përdor
- ✅ Përditëso password-in rregullisht
- ✅ Mos e ndaj connection string-un me askënd

---

## 📝 Si të Përdorësh .env File

1. **Krijo `.env` file në `hiking-backend/`:**
   - Kopjo `ENV_TEMPLATE.txt` dhe riemëroje në `.env`
   - Ose krijo manualisht:
   ```env
   MONGO_URI=mongodb://localhost:27017/kosovahike
   APP_SECRET=your_super_secret_key_change_this
   PORT=5000
   TOKEN_EXPIRE=24
   ```

2. **`.env` është tashmë në `.gitignore`** - nuk do të commit-ohet në Git ✅

3. **dotenv është tashmë instaluar dhe konfiguruar** ✅

4. **Plotëso `.env` file me credentials të tua:**
   - Për MongoDB lokal: `MONGO_URI=mongodb://localhost:27017/kosovahike`
   - Për MongoDB Atlas: `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kosovahike`
   - Ndrysho `APP_SECRET` me një secret key të fortë

---

## ✅ Verifikimi

Pas konfigurimit, starto backend-in:

```bash
npm run dev
```

Duhet të shohësh:
```
MongoDB connected to: mongodb://localhost:27017/kosovahike
Server running on port 5000
```

---

## 🚨 E Rëndësishme

- **MOS e commit `.env` file në Git!** - Ai përmban credentials të tua private
- **Përdor password të fortë** për database user
- **Backup-i i rregullt** - Krijo backup të databazës rregullisht
- **Ndrysho APP_SECRET** - Përdor një secret key të fortë dhe unik

---

## 📞 Nëse ke problem

1. Kontrollo që MongoDB është running (për lokal)
2. Kontrollo connection string-un (për Atlas)
3. Kontrollo që IP address është e shtuar në Network Access (për Atlas)
4. Kontrollo që username dhe password janë të sakta

