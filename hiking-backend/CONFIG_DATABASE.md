# Konfigurimi i Database-it Tënd

## ⚡ Konfigurim i Shpejtë

### Për Database Lokal (MongoDB në kompjuterin tënd):

1. **Instalo MongoDB** (nëse nuk e ke):
   - Windows: https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: `sudo apt-get install mongodb`

2. **Ndrysho në `src/config.ts`:**
   ```typescript
   mongo_uri: 'mongodb://localhost:27017/kosovahike',
   ```

3. **Starto MongoDB:**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   brew services start mongodb-community
   # ose
   sudo systemctl start mongodb
   ```

4. **Krijo database-in:**
   ```bash
   npm run seed
   ```

### Për MongoDB Atlas (Cloud):

1. **Krijo një cluster në MongoDB Atlas:**
   - Shko në https://www.mongodb.com/cloud/atlas
   - Krijo account dhe cluster të ri
   - Kopjo connection string-un

2. **Ndrysho në `src/config.ts`:**
   ```typescript
   mongo_uri: 'mongodb+srv://username:password@cluster.mongodb.net/kosovahike',
   ```

3. **Krijo database-in:**
   ```bash
   npm run seed
   ```

---

## 📝 Vlera Aktuale

Tani projekti është konfiguruar për të përdorur **database lokal** si default:
- **Connection:** `mongodb://localhost:27017/kosovahike`
- **Database Name:** `kosovahike`

Nëse MongoDB lokal nuk është instaluar, ndrysho në `src/config.ts` për të përdorur MongoDB Atlas.

---

## 🔄 Si të Ndryshosh Database-in

Hap `hiking-backend/src/config.ts` dhe ndrysho vlerën e `mongo_uri`:

```typescript
// Për lokal
mongo_uri: 'mongodb://localhost:27017/kosovahike',

// Për Atlas
mongo_uri: 'mongodb+srv://user:pass@cluster.mongodb.net/kosovahike',
```

---

## ✅ Verifikimi

Pas konfigurimit, starto backend-in:

```bash
npm run dev
```

Duhet të shohësh:
```
MongoDB connected to: mongodb://localhost:27017/kosovahike
Server running
```

