# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the HACKTOLIVE platform.

## Prerequisites

- A Google Cloud Platform account
- Access to the Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "HACKTOLIVE")
5. Click "Create"

## Step 2: Enable Google+ API

1. In your project, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace)
3. Click "Create"
4. Fill in the required information:
   - App name: HACKTOLIVE
   - User support email: your email
   - Developer contact information: your email
5. Click "Save and Continue"
6. On the Scopes page, click "Add or Remove Scopes"
7. Add these scopes:
   - `userinfo.email`
   - `userinfo.profile`
8. Click "Save and Continue"
9. Add test users if needed (during development)
10. Click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application" as the application type
4. Set the name: "HACKTOLIVE Web Client"
5. Add Authorized JavaScript origins:
   - `http://localhost:3000` (for local development)
   - `https://yourdomain.com` (for production)
6. Add Authorized redirect URIs:
   - `http://localhost:3001/auth/google/callback` (for local development)
   - `https://api.yourdomain.com/auth/google/callback` (for production)
7. Click "Create"
8. Copy the Client ID and Client Secret

## Step 5: Update Environment Variables

### Backend (.env)

Create or update your backend `.env` file with:

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)

Create or update your frontend `.env.local` file with:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Step 6: Test the Integration

1. Start your backend server:
   ```bash
   cd backend
   npm run start:dev
   ```

2. Start your frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to `http://localhost:3000/login`
4. Click "Continue with Google"
5. Sign in with your Google account
6. You should be redirected to the dashboard

## Production Deployment

When deploying to production:

1. Update the OAuth consent screen with production URLs
2. Add production domains to Authorized JavaScript origins
3. Add production callback URL to Authorized redirect URIs
4. Update environment variables in your production environment
5. Consider moving OAuth consent screen from "Testing" to "In Production"

## Troubleshooting

### "redirect_uri_mismatch" Error

- Make sure the redirect URI in Google Console exactly matches the one in your code
- Check that you're using the correct protocol (http vs https)
- Verify there are no trailing slashes

### "Access Blocked" Error

- Make sure you've added your email as a test user in the OAuth consent screen
- Check that the required scopes are added

### User Not Redirected After Login

- Verify FRONTEND_URL is set correctly in backend .env
- Check browser console for errors
- Verify the callback page exists at `/auth/google/callback`

## Security Notes

- Never commit `.env` files to version control
- Use different OAuth clients for development and production
- Rotate client secrets periodically
- Enable 2FA on your Google Cloud account
- Monitor OAuth usage in Google Cloud Console
