# Netlify Deployment Guide

This guide will help you deploy the REON AI PREP application to Netlify.

## Prerequisites

- A Netlify account ([Sign up here](https://app.netlify.com/signup))
- Git repository access (GitHub, GitLab, or Bitbucket)
- Node.js 24.x (Netlify will use this automatically)

## Deployment Steps

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   - Make sure all changes are committed and pushed to your repository

2. **Log in to Netlify**
   - Go to [https://app.netlify.com](https://app.netlify.com)
   - Sign in with your GitHub/GitLab/Bitbucket account

3. **Add a New Site**
   - Click "Add new site" → "Import an existing project"
   - Select your Git provider and authorize Netlify
   - Choose the `REON-AI-PREP` repository

4. **Configure Build Settings**
   - Netlify should auto-detect the settings from `netlify.toml`:
     - **Build command**: `npm run build`
     - **Publish directory**: `.next`
     - **Node version**: `24`
   - If not auto-detected, manually enter:
     - Build command: `npm run build`
     - Publish directory: `.next`

5. **Install Netlify Next.js Plugin**
   - The `@netlify/plugin-nextjs` plugin is configured in `netlify.toml`
   - Netlify will automatically install it during the build
   - If needed, you can install it manually:
     ```bash
     npm install --save-dev @netlify/plugin-nextjs
     ```

6. **Set Environment Variables (if needed)**
   - Go to Site settings → Environment variables
   - Add any required environment variables:
     - Firebase configuration (if using environment variables)
     - API keys for AI services (OpenRouter, etc.)
   - Note: Currently, Firebase config is hardcoded in `src/firebase/config.ts`

7. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your application
   - The first deployment may take a few minutes

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Netlify**
   ```bash
   netlify init
   ```
   - Follow the prompts to link your site
   - Choose "Create & configure a new site" or link to existing site

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Build Configuration

The project is configured with:
- **Framework**: Next.js 15 (App Router)
- **Node Version**: 24.x
- **Build Command**: `npm run build`
- **Publish Directory**: `.next`

## Important Notes

1. **Next.js Plugin**: The `@netlify/plugin-nextjs` plugin is required for proper Next.js support on Netlify. It's configured in `netlify.toml` and will be installed automatically.

2. **Firebase Configuration**: Currently, Firebase credentials are hardcoded in `src/firebase/config.ts`. For production, consider moving these to environment variables for better security.

3. **Environment Variables**: If you need to add environment variables:
   - Go to Site settings → Environment variables in Netlify dashboard
   - Add variables that your application needs
   - They will be available during build and runtime

4. **Custom Domain**: After deployment, you can add a custom domain:
   - Go to Site settings → Domain management
   - Add your custom domain and follow DNS configuration instructions

## Troubleshooting

### Build Fails
- Check the build logs in Netlify dashboard
- Ensure Node.js version is set to 24
- Verify all dependencies are listed in `package.json`

### Runtime Errors
- Check browser console for errors
- Verify Firebase configuration is correct
- Ensure all API keys are set in environment variables

### Plugin Issues
- Make sure `@netlify/plugin-nextjs` is installed
- Check `netlify.toml` configuration is correct

## Post-Deployment

After successful deployment:
1. Test all features on the live site
2. Set up continuous deployment (automatic deploys on git push)
3. Configure custom domain (optional)
4. Set up form handling or serverless functions if needed
5. Monitor site analytics and performance

## Support

For Netlify-specific issues, refer to:
- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js on Netlify Guide](https://docs.netlify.com/integrations/frameworks/next-js/)

