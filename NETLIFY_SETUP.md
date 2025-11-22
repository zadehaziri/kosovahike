# 🔗 Konfigurimi i Netlify për të lidhur me Backend

Backend është deployuar në **Render**: `https://kosovahike-1.onrender.com/`

## Hapat për të lidhur Frontend me Backend:

### 1️⃣ Konfiguro Environment Variables në Netlify

1. **Shko në Netlify Dashboard:**
   - Hap: https://app.netlify.com
   - Zgjidh site-in tënd (KosovaHike)

2. **Shko te Site Settings:**
   - Kliko në **"Site settings"** (ose **"Site configuration"**)
   - Në menynë e majtë, kliko **"Environment variables"**

3. **Shto Environment Variable:**
   - Kliko **"Add variable"**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://kosovahike-1.onrender.com`
   - **Scopes:** Zgjidh **"Production"**, **"Deploy previews"**, dhe **"Branch deploys"** (ose vetëm **"All scopes"**)
   - Kliko **"Save"**

### 2️⃣ Konfiguro Backend në Render për CORS

Në **Render Dashboard**, shko te backend service dhe shto/kontrollo këto Environment Variables:

- `NODE_ENV` = `production`
- `FRONTEND_URL` = URL-i i frontend-it në Netlify (p.sh. `https://kosovahike.netlify.app`)

**Si të merrsh URL-in e frontend-it:**
- Në Netlify Dashboard, URL-i shfaqet në krye të faqes si `https://your-site-name.netlify.app`

### 3️⃣ Redeploy Frontend

1. Në Netlify Dashboard:
   - Shko te **"Deploys"**
   - Kliko **"Trigger deploy"** → **"Clear cache and deploy site"**

2. Ose commit dhe push në GitHub:
   ```bash
   git add .
   git commit -m "Configure frontend to use Render backend"
   git push origin master
   ```
   Netlify do të deploy automatikisht.

### 4️⃣ Verifikimi

1. **Testo në browser:**
   - Hap URL-in e frontend-it në Netlify
   - Hap **Developer Tools** (F12)
   - Shko te **"Network"** tab
   - Provo të bësh login ose të shkosh në një faqe
   - Duhet të shohësh requests që shkojnë te `https://kosovahike-1.onrender.com`

2. **Kontrollo Console:**
   - Nëse ka errors në Console, shkruaji dhe do t'i rregullojmë.

### ⚠️ Problemet e Mundshme

**1. CORS Error:**
   - Sigurohu që `FRONTEND_URL` në Render është i saktë
   - Kontrollo që URL-i në Netlify është i saktë (pa trailing slash)

**2. 404 Error:**
   - Sigurohu që backend-i në Render është aktiv (jo në "sleep")
   - Render free tier hyn në "sleep" pas 15 minutash pa aktivitet

**3. Environment Variables nuk po përdoren:**
   - Në Netlify, sigurohu që i ke shtuar në **"Production"** scope
   - Redeploy pasi i shtove environment variables

### 📝 Shënime

- **Render Free Tier:** Backend-i hyn në "sleep" pas 15 minutash pa aktivitet. Kur bën request të parë pas sleep, mund të zgjasë 30-60 sekonda për të u "zgjuar".

- **Netlify Build Time:** Nëse build fail-on, kontrollo logs në Netlify Dashboard → Deploys → (zgjidh deploy-in) → Build log

---

**Gati!** Tani frontend-i duhet të jetë i lidhur me backend-in. 🎉

