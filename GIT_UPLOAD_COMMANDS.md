# 📤 Komandat për Upload në GitHub

## ✅ Status Aktual:
- **Remote:** `https://github.com/zadehaziri/kosovahike.git`
- **Branch:** `master`

---

## 🚀 Komandat për Upload:

### 1. Kontrollo statusin e ndryshimeve:
```bash
git status
```

### 2. Shto të gjitha ndryshimet:
```bash
git add .
```

### 3. Krijo commit:
```bash
git commit -m "Update: KosovaHike full stack project"
```
*(Ose përdor një mesazh commit më përshkrues për ndryshimet që ke bërë)*

### 4. Upload në GitHub:
```bash
git push -u origin master
```

---

## 📝 Nëse ke probleme:

### Nëse remote nuk funksionon:
```bash
# Heq remote ekzistues
git remote remove origin

# Shto remote të re (zëvendëso me URL-n tënde)
git remote add origin https://github.com/YOUR_USERNAME/kosovahike.git

# Verifiko
git remote -v
```

### Nëse branch-i është `main` në vend të `master`:
```bash
git push -u origin main
```

### Nëse ke konflikt dhe duhet ta forcojsh:
```bash
git push -u origin master --force
```
⚠️ **KUJDES:** Kjo do të fshijë ndryshimet në GitHub që nuk janë në kompjuterin tënd!

---

## ⚡ Komandat e Shkurtra (të gjitha njëherësh):

```bash
git add .
git commit -m "Update: KosovaHike project"
git push -u origin master
```

---

## 🔍 Para se të pushosh, verifiko:

1. ✅ `.gitignore` ekziston dhe ka `node_modules/` brenda
2. ✅ Nuk ke `.env` files që do të pushohen
3. ✅ `node_modules/` NUK është në listën e files për commit

**Për të kontrolluar çfarë do të pushohet:**
```bash
git status
```

**Për të parë listën e files që do të commitohen:**
```bash
git diff --cached --name-only
```

---

## 🎯 Komanda për push në të ardhmen (pas commit-it të parë):

```bash
# Shto ndryshimet
git add .

# Commit
git commit -m "Mesazhi për ndryshimet"

# Push
git push
```
*(Pas push-it të parë me `-u origin master`, thjesht përdor `git push`)*

---

**Perfekt! Tani thjesht ekzekuto këto komanda në terminal! 🚀**

