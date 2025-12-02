# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Verify Setup (2 minutes)

```powershell
# Navigate to serverless-structure folder
cd serverless-structure

# Check if dependencies are installed
npm list --depth=0
```

**Expected:** You should see `puppeteer-core` and `@sparticuz/chromium` listed.

**If missing:** Run `npm install`

---

### Step 2: Test Locally (5 minutes)

```powershell
# Make sure you're in serverless-structure folder
cd serverless-structure

# Run the test
npm test
```

**What happens:**
- Launches headless browser
- Loads your shader
- Generates an image
- Saves to `test-output.png`

**Success looks like:**
```
✓ Success! Image generated
✓ Image saved to: [path]\test-output.png
```

**Check the output:** Open `test-output.png` in the `serverless-structure` folder.

---

### Step 3: Choose Your Deployment Path

#### 🟢 Easy Path: Vercel (Recommended)
- **Time:** 10-15 minutes
- **Cost:** Free tier available
- **Difficulty:** ⭐⭐ (Easy)

**See:** `SETUP_GUIDE.md` → Step 4 → Option A

#### 🔵 Advanced Path: AWS Lambda
- **Time:** 30-45 minutes  
- **Cost:** Pay per use (very cheap)
- **Difficulty:** ⭐⭐⭐⭐ (Advanced)

**See:** `SETUP_GUIDE.md` → Step 4 → Option B

---

## 📋 Current Status Checklist

Use this to track your progress:

- [ ] Dependencies installed (`npm list` shows packages)
- [ ] Local test passes (`npm test` creates `test-output.png`)
- [ ] HTML files accessible (can open `../index.html` in browser)
- [ ] Chosen deployment platform (Vercel or AWS)
- [ ] Platform account created
- [ ] HTML files hosted (for production)
- [ ] Environment variables set
- [ ] Function deployed
- [ ] Deployed API tested

---

## 🆘 Quick Troubleshooting

| Problem | Quick Fix |
|---------|-----------|
| `npm test` fails | Check `index.html` exists in parent folder |
| "HTML file not found" | Verify path: `D:\Work\...\index.html` |
| Browser won't launch | Install Chrome or use `npm install puppeteer` |
| Timeout errors | Increase `waitTime` in test-local.js (line 10) |

---

## 📖 Full Documentation

For detailed instructions, see: **`SETUP_GUIDE.md`**

---

## 🎯 What's Next?

1. ✅ **Test locally first** - Make sure everything works
2. 🌐 **Host your HTML files** - Needed for production
3. 🚀 **Deploy** - Choose Vercel (easy) or AWS (advanced)
4. 🧪 **Test deployed API** - Verify it works in production
5. 🎨 **Start generating!** - Use your API to create shader art

---

**Ready?** Start with Step 1 above! 🚀

