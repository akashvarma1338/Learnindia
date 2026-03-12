# Vercel Deployment Guide

## Quick Deploy

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

## Environment Variables Required

Add these in Vercel Dashboard (Settings → Environment Variables):

### Client Variables:
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

### Server Variables:
- `HUGGINGFACE_API_KEY`

## Manual Deploy via Vercel Dashboard

1. Go to https://vercel.com
2. Import GitHub repository: `akashvarma1338/Learnindia`
3. Configure:
   - Framework: Create React App
   - Root Directory: `./`
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/build`
4. Add environment variables
5. Deploy

Your app will be live at: `https://learnindia.vercel.app`
