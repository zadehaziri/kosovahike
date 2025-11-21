# Test Email Service

## Si të testosh Email Service

### Hapi 1: Restart Backend
Pas shtimit të password-it në `.env`, restart backend:

```bash
cd hiking-backend
npm run dev
```

### Hapi 2: Bëj një Order
1. Shko te Gear page
2. Shto produkte në cart
3. Shko te Cart page
4. Kliko "Proceed to Checkout"
5. Plotëso formën dhe bëj checkout

### Hapi 3: Kontrollo Console
Pas checkout, shiko backend console për:

**✅ Sukses:**
```
📧 Attempting to send email to: [email]
✅ Order confirmation email sent successfully to: [email]
```

**❌ Error:**
```
❌ Error sending order confirmation email: [error message]
🔐 Authentication failed...
```

### Hapi 4: Kontrollo Email
Shiko inbox-in e email-it që ke dhënë në checkout form. Duhet të marrësh një email me:
- Order ID
- Order Details
- Items Ordered
- Shipping Address

## Troubleshooting

### Nëse email nuk shkon:

1. **Kontrollo .env file:**
   - Sigurohu që `EMAIL_USER` dhe `EMAIL_PASS` janë të shtuar
   - Mos ka hapësira shtesë ose karaktere speciale

2. **Kontrollo App Password:**
   - Sigurohu që ke përdorur App Password, jo password-in normal
   - App Password duhet të jetë 16 karaktere (me ose pa hapësira)

3. **Kontrollo 2-Step Verification:**
   - Duhet të jetë aktivizuar në Google Account

4. **Kontrollo Console Errors:**
   - Shiko backend console për error messages specifike
   - Error "EAUTH" = problem me credentials
   - Error "ECONNECTION" = problem me internet ose Gmail SMTP

5. **Test manual:**
   - Mund të testosh manualisht duke dërguar një email test nga terminal

## Nëse vazhdon të mos funksionojë:

1. Kontrollo që backend server është restartuar pas ndryshimit të .env
2. Kontrollo që .env file është në `hiking-backend/` directory
3. Sigurohu që nuk ka typo në EMAIL_USER ose EMAIL_PASS
4. Provo të gjenerosh një App Password të ri nëse problemi vazhdon

