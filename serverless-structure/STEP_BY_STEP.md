# Step-by-Step Instructions

Follow these steps in order. Each step builds on the previous one.

## ✅ STEP 1: Verify Your Current Setup

**Location:** You should be in: `D:\Work\Division7\17_p5\Generator\IOS\v1 - rd radial v1 07 - v2\serverless-structure`

**Action:**
```powershell
# Check current directory
pwd

# Should show: D:\Work\Division7\17_p5\Generator\IOS\v1 - rd radial v1 07 - v2\serverless-structure

# Verify dependencies
npm list --depth=0
```

**Expected Output:**
```
shader-generator-api@1.0.0
├── @sparticuz/chromium@131.x.x
└── puppeteer-core@21.x.x
```

**If you see errors:**
```powershell
npm install
```

**✅ Checkpoint:** Dependencies installed ✓

---

## ✅ STEP 2: Verify HTML Files Exist

**Action:**
```powershell
# Check if index.html exists in parent directory
Test-Path "..\index.html"

# Should return: True
```

**If False:**
- Make sure you're in the `serverless-structure` folder
- Verify `index.html` exists in the parent directory
- The path should be: `D:\Work\Division7\17_p5\Generator\IOS\v1 - rd radial v1 07 - v2\index.html`

**Also verify these files exist:**
```powershell
Test-Path "..\sketch.js"      # Should be True
Test-Path "..\shader.frag"    # Should be True
Test-Path "..\shader.vert"    # Should be True
```

**✅ Checkpoint:** All required files exist ✓

---

## ✅ STEP 3: Run Your First Test

**Action:**
```powershell
# Make sure you're in serverless-structure folder
cd serverless-structure

# Run the test
npm test
```

**What to expect:**
1. Console will show: `Testing shader generator API...`
2. It will show the HTML path being used
3. Browser will launch (you might see a Chrome window briefly)
4. After 3-5 seconds, you should see:
   ```
   ✓ Success! Image generated
   Content-Type: image/png
   Image size: [number] bytes (base64)
   ✓ Image saved to: [path]\test-output.png
   ```

**If you see errors:**

**Error: "HTML file not found"**
- Solution: Make sure `index.html` is in the parent directory
- Check: `Test-Path "..\index.html"`

**Error: "Browser launch failed" or "executablePath"**
- Solution: Install Chrome browser, or use full Puppeteer:
  ```powershell
  npm install puppeteer --save
  ```
  Then I'll need to update the code (let me know if this happens)

**Error: "Timeout"**
- Solution: The shader might need more time. Edit `test-local.js` line 17:
  ```javascript
  waitTime: '5000'  // Change from '3000' to '5000' or higher
  ```

**✅ Checkpoint:** Test image generated successfully ✓

**Verify:** Open `serverless-structure\test-output.png` - you should see your shader art!

---

## ✅ STEP 4: Understand What Just Happened

**What the test did:**
1. ✅ Launched a headless Chrome browser
2. ✅ Loaded your `index.html` file
3. ✅ Waited for p5.js to initialize
4. ✅ Waited for the shader to render (3 seconds)
5. ✅ Captured a screenshot of the canvas
6. ✅ Saved it as `test-output.png`

**This is exactly what the serverless function will do in production!**

**✅ Checkpoint:** You understand the process ✓

---

## ✅ STEP 5: Test with Different Parameters

**Action:** Edit `test-local.js` to test different themes:

**Option 1: Test different theme**
Edit line 13 in `test-local.js`:
```javascript
theme: 'vortex',  // Try: filament, bloom, cellular, vortex, crystal, etc.
```

**Option 2: Test different size**
Edit lines 14-15:
```javascript
width: '1920',
height: '2400',
```

**Option 3: Test different seed**
Edit line 12:
```javascript
seed: '0.999',  // Try different numbers
```

**Then run again:**
```powershell
npm test
```

**✅ Checkpoint:** You can customize parameters ✓

---

## ✅ STEP 6: Choose Your Deployment Platform

You have two main options:

### Option A: Vercel (Easier) ⭐ Recommended for beginners

**Pros:**
- ✅ Very easy setup
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Great developer experience

**Cons:**
- ⚠️ Need to host HTML files separately
- ⚠️ Free tier has limits

**Time:** 15-20 minutes

---

### Option B: AWS Lambda (More control)

**Pros:**
- ✅ Very scalable
- ✅ Pay only for what you use
- ✅ Full AWS ecosystem

**Cons:**
- ⚠️ More complex setup
- ⚠️ Requires AWS account
- ⚠️ Need to configure credentials

**Time:** 30-45 minutes

---

## ✅ STEP 7A: Deploy to Vercel (If chosen)

**Prerequisites:**
- GitHub account (recommended) or Vercel account
- Your HTML files hosted somewhere (GitHub Pages, Netlify, etc.)

**Step 7A.1: Install Vercel CLI**
```powershell
npm install -g vercel
```

**Step 7A.2: Login**
```powershell
vercel login
```
- Follow the prompts
- Will open browser for authentication

**Step 7A.3: Create GitHub Repository**

**📖 See detailed guide:** `GITHUB_SETUP.md` (in project root)

**Quick steps:**
1. **Initialize git:** `git init`
2. **Add files:** `git add .`
3. **Commit:** `git commit -m "Initial commit"`
4. **Create repo on GitHub:** Go to https://github.com → New repository
5. **Connect:** `git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git`
6. **Push:** `git push -u origin main`

**Step 7A.4: Host Your HTML Files**

You need to make your HTML files accessible via URL. Options:

**Option 1: GitHub Pages (Recommended)**
1. Go to your GitHub repo → Settings → Pages
2. Source: Deploy from a branch → main → / (root) → Save
3. Wait 1-2 minutes, then your site will be at: `https://YOUR_USERNAME.github.io/REPO_NAME/index.html`

**Option 2: Netlify Drop**
1. Go to https://app.netlify.com/drop
2. Drag and drop your folder with HTML files
3. Note the URL (e.g., `https://random-name.netlify.app/index.html`)

**Option 3: Vercel Static Hosting**
1. Create a separate Vercel project for static files
2. Deploy your HTML files there
3. Note the URL

**Step 7A.5: Set Environment Variable**
```powershell
# Set the HTML_PATH to your hosted HTML file
vercel env add HTML_PATH production
# When prompted, enter: https://your-url.com/index.html
```

**Step 7A.6: Deploy to Vercel**
```powershell
# Make sure you're in serverless-structure folder
cd serverless-structure

# Deploy
vercel
```

**Follow prompts:**
- Set up and deploy? → **Yes**
- Which scope? → Select your account
- Link to existing project? → **No** (first time)
- Project name? → Press Enter (default)
- Directory? → Press Enter (`.`)
- Override settings? → **No**

**Step 7A.7: Get Your API URL**

After deployment, Vercel will show:
```
🔗  https://your-project-name.vercel.app/api/generate
```

**Step 7A.8: Test Your Deployed API**
```powershell
# Test with curl
curl "https://your-project-name.vercel.app/api/generate?seed=0.5&theme=cosmic&width=800&height=1000" --output deployed-test.png

# Or open in browser:
# https://your-project-name.vercel.app/api/generate?seed=0.5&theme=cosmic&width=800&height=1000
```

**✅ Checkpoint:** API deployed and working ✓

---

## ✅ STEP 7B: Deploy to AWS Lambda (If chosen)

**Prerequisites:**
- AWS account
- AWS CLI installed
- Serverless Framework installed

**Step 7B.1: Install Serverless Framework**
```powershell
npm install -g serverless
```

**Step 7B.2: Configure AWS Credentials**
```powershell
aws configure
```

Enter:
- **AWS Access Key ID:** (Get from AWS Console → IAM → Users → Security Credentials)
- **AWS Secret Access Key:** (Same place)
- **Default region:** `us-east-1` (or your preferred region)
- **Default output format:** `json`

**Step 7B.3: Host Your HTML Files on S3**

1. **Create S3 bucket:**
   ```powershell
   aws s3 mb s3://your-shader-assets-bucket
   ```

2. **Upload files:**
   ```powershell
   aws s3 cp ..\index.html s3://your-shader-assets-bucket/
   aws s3 cp ..\sketch.js s3://your-shader-assets-bucket/
   aws s3 cp ..\shader.frag s3://your-shader-assets-bucket/
   aws s3 cp ..\shader.vert s3://your-shader-assets-bucket/
   aws s3 cp ..\p5.js s3://your-shader-assets-bucket/  # If you have it locally
   ```

3. **Make bucket public:**
   - Go to AWS Console → S3 → Your bucket
   - Permissions → Block public access → Edit → Uncheck all → Save
   - Bucket Policy → Add:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Sid": "PublicReadGetObject",
           "Effect": "Allow",
           "Principal": "*",
           "Action": "s3:GetObject",
           "Resource": "arn:aws:s3:::your-shader-assets-bucket/*"
         }
       ]
     }
     ```

4. **Get the URL:**
   ```
   https://your-shader-assets-bucket.s3.amazonaws.com/index.html
   ```

**Step 7B.4: Update serverless.yml**

Edit `serverless-structure/serverless.yml`, line 8:
```yaml
environment:
  HTML_PATH: https://your-shader-assets-bucket.s3.amazonaws.com/index.html
```

**Step 7B.5: Deploy**
```powershell
cd serverless-structure
npm run deploy
```

**This will take 2-5 minutes.** You'll see:
```
Serverless: Packaging service...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
...
endpoints:
  GET - https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/generate
  POST - https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/generate
```

**Step 7B.6: Test Your Deployed API**
```powershell
curl "https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/generate?seed=0.5&theme=cosmic" --output aws-test.png
```

**✅ Checkpoint:** API deployed and working ✓

---

## ✅ STEP 8: Start Using Your API!

**Your API is now live!** You can:

1. **Generate images programmatically:**
   ```javascript
   const response = await fetch('https://your-api-url/generate?seed=0.5&theme=cosmic');
   const blob = await response.blob();
   // Use the image blob
   ```

2. **Use in web applications:**
   ```html
   <img src="https://your-api-url/generate?seed=0.5&theme=cosmic" />
   ```

3. **Batch generate:**
   ```powershell
   # Generate multiple images with different seeds
   for ($i=0; $i -lt 10; $i++) {
       $seed = $i / 10
       curl "https://your-api-url/generate?seed=$seed&theme=cosmic" --output "image-$i.png"
   }
   ```

**✅ Checkpoint:** You're generating shader art via API! 🎨

---

## 🎉 Congratulations!

You've successfully:
- ✅ Set up the serverless structure
- ✅ Tested locally
- ✅ Deployed to production
- ✅ Created a working API

**Next steps:**
- Monitor usage and costs
- Add caching for performance
- Add authentication if needed
- Scale as needed

---

## 🆘 Need Help?

1. Check `SETUP_GUIDE.md` for detailed troubleshooting
2. Check `QUICK_START.md` for quick reference
3. Review error messages carefully
4. Test locally first before deploying

**Common issues are covered in the troubleshooting sections of the guides.**

---

**Ready to start?** Begin with STEP 1! 🚀

