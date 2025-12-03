# Fix 404 Error in Vercel

## The Problem

After deployment, you're getting:
```
404: NOT_FOUND
Code: NOT_FOUND
```

This means Vercel can't find your API function.

## Common Causes

### 1. Root Directory Not Set Correctly

**Check in Vercel:**
1. Go to your project → Settings → General
2. Look at "Root Directory"
3. Should be: `serverless-structure`
4. If it's wrong, change it and redeploy

### 2. Function File Not in Correct Location

**Verify file structure:**
```
serverless-structure/
  └── api/
      └── generate.js  ← Must be here
```

**If Root Directory is `serverless-structure`, then:**
- Vercel looks for `api/` folder inside `serverless-structure`
- Function should be at: `serverless-structure/api/generate.js` ✅

### 3. Function Export Format

**Check `api/generate.js`:**
- Line 15 should have: `module.exports = async (req, res) => {`
- This is the correct format for Vercel

### 4. Deployment Using Wrong Commit

**Check deployment:**
1. Go to Deployments tab
2. Check which commit was deployed
3. Make sure it has the latest code with the Vercel handler

## Step-by-Step Fix

### Step 1: Verify File Structure

1. **Check on GitHub:**
   - Go to: `https://github.com/YOUR_USERNAME/REPO/blob/main/serverless-structure/api/generate.js`
   - File should exist
   - Line 15 should have: `module.exports = async (req, res) => {`

### Step 2: Check Vercel Settings

1. **Go to Vercel Dashboard** → Your project
2. **Click "Settings"** → "General"
3. **Check "Root Directory":**
   - Should be: `serverless-structure`
   - If empty or wrong, change it
4. **Save changes**

### Step 3: Test with Simple Function

I've created `api/test.js` - a simple test function.

1. **Test it first:**
   ```
   https://your-project.vercel.app/api/test
   ```
2. **If this works**, the issue is with `generate.js`
3. **If this doesn't work**, the issue is with Vercel configuration

### Step 4: Check Deployment Logs

1. **Go to Deployments tab**
2. **Click on latest deployment**
3. **Click "View Function Logs"** or "Logs"
4. **Look for errors:**
   - "Function not found"
   - "Module not found"
   - "Syntax error"

### Step 5: Redeploy

1. **After fixing settings, redeploy:**
   - Go to Deployments
   - Click three dots (⋯)
   - Click "Redeploy"
   - Or create new deployment with latest commit

## Quick Checklist

- [ ] Root Directory is set to `serverless-structure` in Vercel
- [ ] File exists at `serverless-structure/api/generate.js` on GitHub
- [ ] Function exports: `module.exports = async (req, res) => {`
- [ ] Latest commit is deployed
- [ ] No errors in deployment logs
- [ ] Test function (`/api/test`) works (if created)

## Test URLs

After fixing, test these:

```
# Test function (if created)
https://your-project.vercel.app/api/test

# Main API
https://your-project.vercel.app/api/generate?seed=0.5&theme=cosmic
```

---

**Most common fix:** Make sure Root Directory is set to `serverless-structure` in Vercel settings!

