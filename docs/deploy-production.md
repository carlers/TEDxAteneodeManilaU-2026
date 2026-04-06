# Production Deployment Guide

This guide covers deploying both:

- Next.js frontend
- Convex backend (with Convex Auth + Google OAuth)

Follow the steps in order.

## 1) Pre-deploy checks

Run locally from repo root:

```bash
npm run lint
npx next build --webpack
```

## 2) Deploy Convex backend (production)

Deploy Convex functions/schema:

```bash
npx convex deploy
```

Get your production Convex URLs in dashboard:

- Convex Cloud URL: `https://<deployment>.convex.cloud`
- Convex Site URL: `https://<deployment>.convex.site`

## 3) Generate production JWT keys (one-time)

Run:

```bash
node -e "const { generateKeyPairSync } = require('node:crypto'); const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 }); const pem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString().trim().replace(/\n/g, ' '); const jwk = publicKey.export({ format: 'jwk' }); const jwks = JSON.stringify({ keys: [{ use: 'sig', ...jwk }] }); console.log('JWT_PRIVATE_KEY=' + pem); console.log('JWKS=' + jwks);"
```

Copy both printed values for the next step.

## 4) Set Convex production env vars

Use exact commands below (replace placeholder values):

```bash
npx convex env set --prod AUTH_GOOGLE_ID "YOUR_GOOGLE_CLIENT_ID"
npx convex env set --prod AUTH_GOOGLE_SECRET "YOUR_GOOGLE_CLIENT_SECRET"
npx convex env set --prod ADMIN_EMAILS "admin1@example.com,admin2@example.com"
npx convex env set --prod SITE_URL "https://your-frontend-domain.com"
npx convex env set --prod JWT_PRIVATE_KEY "PASTE_GENERATED_JWT_PRIVATE_KEY"
npx convex env set --prod JWKS 'PASTE_GENERATED_JWKS_JSON'
```

## 5) Configure Google OAuth client

In Google Cloud Console, update your OAuth client with:

- Authorized JavaScript origins:
  - `https://your-frontend-domain.com`
- Authorized redirect URIs:
  - `https://<deployment>.convex.site/api/auth/callback/google`

Important: callback must be the Convex `.site` URL.

## 6) Sync admins table from env

The project includes a sync mutation that reads `ADMIN_EMAILS`.
Run this after `ADMIN_EMAILS` is set in production:

```bash
npx convex run --prod admins:syncAdminEmails "{}"
```

## 7) Set frontend (hosting platform) env vars

Set these in Vercel (or your host):

```bash
NEXT_PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://<deployment>.convex.site
```

Then deploy frontend:

```bash
npm run build
```

## 8) Post-deploy verification

1. Open `/admin/login`
2. Sign in with a whitelisted admin email
3. Confirm `/admin/registrations` loads
4. Submit a test registration in `/register`
5. Confirm it appears in admin dashboard
6. Confirm status updates (`submitted` / `verified`) work

## 9) Ongoing admin updates

Whenever you update `ADMIN_EMAILS` in production:

```bash
npx convex env set --prod ADMIN_EMAILS "newlist@example.com,another@example.com"
npx convex run --prod admins:syncAdminEmails "{}"
```
