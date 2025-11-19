<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1YoFzX11uA-qQhNWmwe4mIcUGjNOJSedd

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `API_KEY` in [.env.local](.env.local) to your OpenAI API key
3. Run the app:
   `npm run dev`

## Deployment Options

### Option 1: Vercel (Recommended)
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign in with GitHub
3. Import your repository
4. Add environment variable: `API_KEY` with your OpenAI API key
5. Deploy

### Option 2: Netlify
1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com) and sign in with GitHub
3. Add new site from Git
4. Add environment variable: `API_KEY` with your OpenAI API key
5. Deploy

### Option 3: GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. Update vite.config.ts with base URL
4. Run: `npm run deploy`

**Note:** For GitHub Pages, API calls may need a backend proxy to hide your API key securely.
