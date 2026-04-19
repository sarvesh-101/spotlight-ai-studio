# Spotlight AI Studio — Deployment Guide

## What this is
A fully functional AI Creative Studio with:
- 🎬 **Video generation** using Runway Gen-3 Turbo
- 🎨 **Image generation** using Google Imagen 3

---

## Step-by-Step Deployment to Vercel (FREE)

### Step 1 — Create a GitHub account (if you don't have one)
1. Go to https://github.com
2. Click **Sign up** and create a free account

### Step 2 — Create a new GitHub repository
1. Go to https://github.com/new
2. Repository name: `spotlight-ai-studio`
3. Set it to **Private**
4. Click **Create repository**

### Step 3 — Upload the project files
1. On the repository page, click **uploading an existing file**
2. Drag and drop ALL the files/folders from this zip:
   - `api/` folder (with generate-image.js, generate-video.js, poll-video.js)
   - `public/` folder (with index.html)
   - `vercel.json`
   - `package.json`
3. Click **Commit changes**

### Step 4 — Create a Vercel account
1. Go to https://vercel.com
2. Click **Sign Up** → choose **Continue with GitHub**
3. Authorize Vercel to access GitHub

### Step 5 — Deploy on Vercel
1. On Vercel dashboard, click **Add New Project**
2. Find `spotlight-ai-studio` in the list and click **Import**
3. Leave all settings as default
4. Click **Deploy**
5. Wait ~1 minute — Vercel will give you a live URL like `https://spotlight-ai-studio.vercel.app`

### Step 6 — Add your API keys (IMPORTANT!)
Your keys must be added as Environment Variables (never commit them to GitHub):

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add these two variables:

   | Name | Value |
   |------|-------|
   | `GEMINI_API_KEY` | your Gemini API key |
   | `RUNWAY_API_KEY` | your Runway API key |

3. Click **Save** for each
4. Go to **Deployments** → click the 3 dots on latest deployment → **Redeploy**

### Step 7 — Open your live app!
Your app is now live at your Vercel URL. Share it with anyone!

---

## Updating the app
Whenever you change files in GitHub, Vercel automatically redeploys. No extra steps needed.

---

## API Keys used
- **Gemini (Imagen 3)**: For image generation
- **Runway (Gen-3 Turbo)**: For video generation

Keep these keys private — never share the GitHub repo publicly if keys are in the code.
Your keys are stored safely as Vercel Environment Variables, not in the code.
