# 🚀 Konfigurim i MongoDB Atlas - Database Private

## Hapi 1: Krijo MongoDB Atlas Account

1. **Shko në MongoDB Atlas:**
   - Hap https://www.mongodb.com/cloud/atlas
   - Kliko "Try Free" ose "Sign Up" nëse nuk ke account

2. **Krijo Account:**
   - Plotëso të dhënat e tua
   - Verifiko email-in

---

## Hapi 2: Krijo Cluster të ri

1. **Pas login, kliko "Build a Database"**

2. **Zgjidh Plan:**
   - **M0 FREE** - Falas, mjafton për development
   - Ose zgjidh plan më të lartë për production

3. **Zgjidh Cloud Provider dhe Region:**
   - AWS, Google Cloud, ose Azure
   - Zgjidh region më afër teje (p.sh. Europe për Kosovë)

4. **Emërto Cluster-in:**
   - Jep një emër (p.sh. "KosovaHike-Cluster")

5. **Kliko "Create"** dhe prit 3-5 minuta që cluster-i të krijohet

---

## Hapi 3: Konfiguro Network Access

1. **Shko te "Network Access" (në sidebar)**

2. **Kliko "Add IP Address"**

3. **Zgjidh një opsion:**
   - **"Add Current IP Address"** - Shton IP-në tënde aktuale (rekomanduar)
   - **"Allow Access from Anywhere"** - `0.0.0.0/0` (më pak i sigurt, por më i lehtë për development)
   
   ⚠️ **Për siguri më të mirë, përdor "Add Current IP Address"**

4. **Kliko "Confirm"**

---

## Hapi 4: Krijo Database User

1. **Shko te "Database Access" (në sidebar)**

2. **Kliko "Add New Database User"**

3. **Zgjidh Authentication Method:**
   - **"Password"** (rekomanduar)

4. **Krijo Username dhe Password:**
   - **Username:** (p.sh. `kosovahike-admin`)
   - **Password:** Kliko "Autogenerate Secure Password" ose krijoni një password të fortë
   - ⚠️ **KOPJO PASSWORD-IN!** - Nuk do ta shohësh më pas

5. **Zgjidh Database User Privileges:**
   - **"Atlas admin"** - Akses i plotë (rekomanduar për development)

6. **Kliko "Add User"**

---

## Hapi 5: Merr Connection String

1. **Shko te "Database" (në sidebar)**

2. **Kliko "Connect" në cluster-in tënd**

3. **Zgjidh "Connect your application"**

4. **Zgjidh Driver dhe Version:**
   - Driver: **Node.js**
   - Version: **5.5 or later**

5. **Kopjo Connection String:**
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Zëvendëso në Connection String:**
   - `<username>` → Username që krijove (p.sh. `kosovahike-admin`)
   - `<password>` → Password që krijove
   - Pas `.net/` shto emrin e database: `kosovahike`
   
   **Shembull final:**
   ```
   mongodb+srv://kosovahike-admin:YourPassword123@cluster0.xxxxx.mongodb.net/kosovahike?retryWrites=true&w=majority
   ```

---

## Hapi 6: Konfiguro .env File

1. **Hap `.env` file në `hiking-backend/`**

2. **Ndrysho `MONGO_URI`:**
   ```env
   MONGO_URI=mongodb+srv://kosovahike-admin:YourPassword123@cluster0.xxxxx.mongodb.net/kosovahike?retryWrites=true&w=majority
   ```

3. **Ndrysho `APP_SECRET`:**
   ```env
   APP_SECRET=your_super_secret_key_change_this_to_something_strong
   ```

4. **Ruaj file-in**

---

## Hapi 7: Testo Connection

1. **Starto backend:**
   ```bash
   cd hiking-backend
   npm run dev
   ```

2. **Duhet të shohësh:**
   ```
   MongoDB connected to: mongodb+srv://***@cluster0.xxxxx.mongodb.net/kosovahike
   Server running on port 5000
   ```

3. **Nëse ka error:**
   - Kontrollo që IP address është e shtuar në Network Access
   - Kontrollo që username dhe password janë të sakta
   - Kontrollo që connection string është i plotë

---

## Hapi 8: Seed Database

1. **Pas që backend është connected, seed database:**
   ```bash
   npm run seed
   ```

2. **Duhet të shohësh:**
   ```
   Database seeded successfully!
   ```

---

## ✅ Gati!

Tani databaza është private dhe vetëm ti ke akses!

**E rëndësishme:**
- ✅ `.env` file nuk do të commit-ohet në Git
- ✅ Vetëm IP-të që i shtove kanë akses
- ✅ Password-i është i sigurt dhe privat
- ✅ Database është në cloud dhe ka backup automatik

---

## 🔒 Siguria

1. **Mos e ndaj connection string-un** me askënd
2. **Përditëso password-in** rregullisht
3. **Kufizo Network Access** vetëm për IP-të që i përdor
4. **Aktivizo MFA** (Multi-Factor Authentication) nëse është e mundur

---

## 📝 Ndryshimi i Password-it

Nëse harron password-in ose dëshiron ta ndryshosh:

1. Shko te "Database Access"
2. Kliko në user-in tënd
3. Kliko "Edit" dhe "Update Password"
4. Kopjo password-in e ri dhe përditëso në `.env` file

