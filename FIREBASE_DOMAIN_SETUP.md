# Firebase Domain Authorization Setup

## Issue
You're seeing the error: `Firebase: Error (auth/unauthorized-domain)` when trying to use Google Sign-In on Netlify.

This happens because Firebase requires you to explicitly authorize domains that can use authentication.

## Solution: Add Netlify Domain to Firebase

### Step 1: Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **studio-6821515882-cca40**

### Step 2: Navigate to Authentication Settings
1. Click on **Authentication** in the left sidebar
2. Click on the **Settings** tab (gear icon)
3. Scroll down to **Authorized domains**

### Step 3: Add Netlify Domains
Click **Add domain** and add these domains:

1. **reon-ai-prep.netlify.app** (Your production domain)
2. **localhost** (if not already there, for local development)
3. **127.0.0.1** (if not already there, for local development)

### Step 4: Save Changes
- Click **Add** after entering each domain
- Changes take effect immediately (no need to redeploy)

## Current Firebase Configuration

- **Project ID**: `studio-6821515882-cca40`
- **Auth Domain**: `studio-6821515882-cca40.firebaseapp.com`
- **API Key**: `AIzaSyAPARJD5xPtBVdOLoqsxOXj8fkObc_jh2g`

## Verification

After adding the domain:
1. Try Google Sign-In on your Netlify site
2. The error should be resolved
3. Authentication should work normally

## Additional Notes

- You can add multiple Netlify preview domains if needed (e.g., `deploy-preview-123--reon-ai-prep.netlify.app`)
- For production, make sure `reon-ai-prep.netlify.app` is added
- Local development domains (`localhost`, `127.0.0.1`) should already be there by default

## Troubleshooting

If you still see the error after adding the domain:
1. Clear your browser cache
2. Try in an incognito/private window
3. Verify the domain is exactly `reon-ai-prep.netlify.app` (no typos)
4. Check that you're logged into the correct Firebase project

