# Email Service Setup Guide

## Si të konfigurosh Email Service për Gmail

### Hapi 1: Aktivizo 2-Step Verification
1. Shko te [Google Account Security](https://myaccount.google.com/security)
2. Aktivizo "2-Step Verification" nëse nuk është aktivizuar

### Hapi 2: Krijo App Password
1. Shko te [App Passwords](https://myaccount.google.com/apppasswords)
2. Zgjidh "Mail" si app
3. Zgjidh "Other (Custom name)" dhe shkruaj "KosovaHike Backend"
4. Kliko "Generate"
5. Kopjo password-in që të jepet (16 karaktere, me hapësira)

### Hapi 3: Konfiguro .env File
Shto në `hiking-backend/.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

**Shënim:** Nëse password ka hapësira, vendosini me hapësira ose pa (funksionon të dyja).

### Hapi 4: Restart Backend
Pas konfigurimit, restart backend server:

```bash
cd hiking-backend
npm run dev
```

## Testimi

Pas checkout, kontrollo console për:
- `Order confirmation email sent to: [email]` - nëse email u dërgua me sukses
- `Email service not configured...` - nëse email nuk është konfiguruar

## Troubleshooting

### Email nuk shkon?
1. **Kontrollo .env file**: Sigurohu që `EMAIL_USER` dhe `EMAIL_PASS` janë të shtuar
2. **Kontrollo App Password**: Sigurohu që ke përdorur App Password, jo password-in normal të Gmail
3. **Kontrollo Console**: Shiko error messages në backend console
4. **Test me Gmail**: Sigurohu që Gmail lejon "Less secure app access" ose përdor App Password

### Error: "Invalid login"
- Sigurohu që ke përdorur App Password, jo password-in normal
- Kontrollo që 2-Step Verification është aktivizuar

### Error: "Connection timeout"
- Kontrollo internet connection
- Gmail SMTP mund të jetë i bllokuar nga firewall

## Alternative: Përdor SMTP tjetër

Nëse nuk dëshiron të përdorësh Gmail, mund të ndryshosh konfigurimin në `src/services/emailService.ts`:

```typescript
return nodemailer.createTransport({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## Production

Për production, rekomandohet:
- Përdor një email service profesional (SendGrid, Mailgun, AWS SES)
- Mos përdor Gmail për production (ka limite)
- Përdor environment variables në server






