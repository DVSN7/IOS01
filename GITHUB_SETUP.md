# GitHub Repository Setup Guide

This guide will help you create a GitHub repository and push your shader generator project to it, so you can deploy to Vercel.

## 📋 Prerequisites

- [x] GitHub account (you mentioned you have one)
- [ ] Git installed on your computer
- [ ] Your project files ready

---

## ✅ STEP 1: Check if Git is Installed

**Action:**
```powershell
git --version
```

**Expected output:** Something like `git version 2.x.x`

**If you see an error:**
- Download Git from: https://git-scm.com/download/win
- Install it
- Restart PowerShell
- Run `git --version` again

---

## ✅ STEP 2: Initialize Git Repository

**Action:**
```powershell
# Make sure you're in the project root directory
cd "D:\Work\Division7\17_p5\Generator\IOS\v1 - rd radial v1 07 - v2"

# Initialize git repository
git init
```

**Expected output:** `Initialized empty Git repository in ...`

---

## ✅ STEP 3: Check What Files Will Be Committed

**Action:**
```powershell
git status
```

**You should see:**
- Your project files listed as "untracked"
- `node_modules/` should NOT appear (it's in .gitignore)

**If you see `node_modules/` listed:**
- Make sure `.gitignore` exists in the root directory
- Run `git status` again

---

## ✅ STEP 4: Add Files to Git

**Action:**
```powershell
# Add all files (respecting .gitignore)
git add .

# Verify what was added
git status
```

**Expected:** You should see your files listed as "Changes to be committed", but NOT:
- `node_modules/`
- `test-output.png`
- `.vercel/`
- `.serverless/`

---

## ✅ STEP 5: Create Your First Commit

**Action:**
```powershell
git commit -m "Initial commit: Shader generator with serverless API"
```

**Expected output:** `[main (root-commit) xxxxx] Initial commit...`

---

## ✅ STEP 6: Create GitHub Repository

### Option A: Using GitHub Website (Recommended for Beginners)

1. **Go to GitHub:** https://github.com
2. **Sign in** to your account
3. **Click the "+" icon** (top right) → **"New repository"**
4. **Fill in the form:**
   - **Repository name:** `shader-generator` (or any name you like)
   - **Description:** `Serverless API for generating shader art images`
   - **Visibility:** Choose **Public** (free) or **Private** (if you have GitHub Pro)
   - **DO NOT** check "Initialize with README" (we already have files)
   - **DO NOT** add .gitignore or license (we already have them)
5. **Click "Create repository"**

6. **Copy the repository URL:**
   - You'll see a page with setup instructions
   - Copy the URL shown (looks like: `https://github.com/yourusername/shader-generator.git`)

### Option B: Using GitHub CLI (Advanced)

If you have GitHub CLI installed:
```powershell
gh repo create shader-generator --public --source=. --remote=origin --push
```

---

## ✅ STEP 7: Connect Local Repository to GitHub

**Action:**
```powershell
# Replace YOUR_USERNAME and REPO_NAME with your actual values
# Example: git remote add origin https://github.com/johndoe/shader-generator.git
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Verify the remote was added
git remote -v
```

**Expected output:**
```
origin  https://github.com/YOUR_USERNAME/REPO_NAME.git (fetch)
origin  https://github.com/YOUR_USERNAME/REPO_NAME.git (push)
```

---

## ✅ STEP 8: Push Your Code to GitHub

**Action:**
```powershell
# Push to GitHub (first time)
git branch -M main
git push -u origin main
```

**You may be prompted to authenticate:**
- **If using HTTPS:** GitHub will ask for username and password
  - **Note:** You'll need a Personal Access Token instead of password
  - See "Authentication Setup" below if needed

- **If using SSH:** Make sure your SSH key is set up

**Expected output:**
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
To https://github.com/YOUR_USERNAME/REPO_NAME.git
 * [new branch]      main -> main
Branch 'main' set up to track 'remote branch 'main' from 'origin'.
```

---

## ✅ STEP 9: Verify on GitHub

1. **Go to your repository on GitHub:** `https://github.com/YOUR_USERNAME/REPO_NAME`
2. **You should see:**
   - All your files listed
   - Your commit message
   - Project structure

**✅ Checkpoint:** Code is on GitHub! ✓

---

## 🔐 Authentication Setup (If Needed)

If `git push` asks for credentials:

### Option 1: Personal Access Token (Recommended)

1. **Go to GitHub:** https://github.com/settings/tokens
2. **Click "Generate new token"** → **"Generate new token (classic)"**
3. **Fill in:**
   - **Note:** `Shader Generator Project`
   - **Expiration:** Choose your preference (90 days, 1 year, etc.)
   - **Scopes:** Check `repo` (full control of private repositories)
4. **Click "Generate token"**
5. **Copy the token** (you'll only see it once!)
6. **When pushing, use:**
   - **Username:** Your GitHub username
   - **Password:** Paste the token (not your actual password)

### Option 2: GitHub CLI (Easier)

```powershell
# Install GitHub CLI if not installed
# Download from: https://cli.github.com/

# Authenticate
gh auth login

# Then push normally
git push -u origin main
```

---

## 📁 What Files Are Included?

Your repository should include:

✅ **Included:**
- `index.html`
- `sketch.js`
- `shader.frag`
- `shader.vert`
- `style.css`
- `p5.js` (if you have it locally)
- `serverless-structure/` folder (with all config files)
- `.gitignore`
- Documentation files

❌ **Excluded (via .gitignore):**
- `node_modules/` (dependencies - will be installed on Vercel)
- `test-output.png` (test files)
- `.vercel/` (Vercel cache)
- `.serverless/` (AWS Lambda cache)
- `.env` files (sensitive data)

---

## 🚀 Next Steps: Deploy to Vercel

Once your code is on GitHub:

1. **Go to Vercel:** https://vercel.com
2. **Sign in** with your GitHub account
3. **Click "Add New Project"**
4. **Import your repository:**
   - Select `shader-generator` (or your repo name)
   - Click "Import"
5. **Configure project:**
   - **Framework Preset:** Other
   - **Root Directory:** `serverless-structure` (important!)
   - **Build Command:** Leave empty
   - **Output Directory:** Leave empty
6. **Add Environment Variable:**
   - **Name:** `HTML_PATH`
   - **Value:** We'll set this after deployment (see below)
7. **Click "Deploy"**

**After deployment:**
- Vercel will give you a URL like: `https://your-project.vercel.app`
- Your API will be at: `https://your-project.vercel.app/api/generate`

---

## 🔧 Setting HTML_PATH After Deployment

After Vercel deploys, you need to host your HTML files and set the `HTML_PATH`:

### Option 1: Host HTML on Vercel (Recommended)

1. **Create a separate Vercel project** for static files
2. **Or add a public folder** in your repo
3. **Set HTML_PATH** to: `https://your-static-site.vercel.app/index.html`

### Option 2: Use GitHub Pages

1. **Enable GitHub Pages** in your repo settings
2. **Set HTML_PATH** to: `https://YOUR_USERNAME.github.io/REPO_NAME/index.html`

### Option 3: Use Netlify Drop

1. **Go to:** https://app.netlify.com/drop
2. **Drag and drop** your project folder
3. **Get the URL** and set it as `HTML_PATH`

---

## 🆘 Troubleshooting

### "Repository not found"
- Check the repository URL is correct
- Make sure the repository exists on GitHub
- Verify you have access to it

### "Authentication failed"
- Use Personal Access Token instead of password
- Or set up SSH keys
- Or use GitHub CLI

### "Permission denied"
- Make sure you're pushing to the correct repository
- Check you have write access to the repo

### "Files not showing on GitHub"
- Make sure you ran `git add .` and `git commit`
- Check `.gitignore` isn't excluding important files
- Verify you pushed with `git push -u origin main`

---

## ✅ Quick Reference Commands

```powershell
# Initialize repository
git init

# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Your message"

# Add remote
git remote add origin https://github.com/USERNAME/REPO.git

# Push to GitHub
git push -u origin main

# Check remote
git remote -v
```

---

## 🎯 Summary

1. ✅ Initialize git: `git init`
2. ✅ Add files: `git add .`
3. ✅ Commit: `git commit -m "Initial commit"`
4. ✅ Create repo on GitHub website
5. ✅ Connect: `git remote add origin [URL]`
6. ✅ Push: `git push -u origin main`
7. ✅ Deploy to Vercel

**Ready?** Start with STEP 1! 🚀

