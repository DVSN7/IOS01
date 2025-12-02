# Complete Setup Guide - Shader Generator API

This guide will walk you through setting up, testing, and deploying your serverless shader generator API.

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [x] Node.js 18.x or higher installed (`node --version`)
- [x] npm installed (`npm --version`)
- [x] Dependencies installed in `serverless-structure` folder
- [x] Your shader files (`index.html`, `sketch.js`, `shader.frag`, `shader.vert`) in the parent directory

## 🚀 Step 1: Verify Installation

First, let's make sure everything is set up correctly:

```powershell
# Navigate to serverless-structure folder
cd serverless-structure

# Verify dependencies are installed
npm list --depth=0

# You should see:
# - puppeteer-core@21.x.x
# - @sparticuz/chromium@131.x.x
```

If you see any missing packages, run:
```powershell
npm install
```

## 🧪 Step 2: Test Locally (Option A - Simple Test Script)

The easiest way to test is using the provided test script:

```powershell
# Make sure you're in serverless-structure folder
cd serverless-structure

# Run the test script
npm test
```

**What this does:**
- Creates a mock API request with sample parameters
- Launches a headless browser
- Loads your `index.html` file
- Waits for the shader to render
- Captures a screenshot
- Saves it as `test-output.png` in the `serverless-structure` folder

**Expected output:**
```
Testing shader generator API...
Parameters: { seed: '0.5', theme: 'cosmic', ... }
HTML Path: D:\Work\...\index.html
✓ Success! Image generated
Content-Type: image/png
Image size: [size] bytes (base64)
✓ Image saved to: [path]\test-output.png
```

**If you get errors:**
- **"HTML file not found"**: Make sure `index.html` exists in the parent directory
- **"Timeout"**: Increase `waitTime` in `test-local.js` (line 10)
- **"Browser launch failed"**: Make sure you have Chrome/Chromium installed locally

## 🧪 Step 2: Test Locally (Option B - Serverless Offline)

For a more realistic serverless environment test:

```powershell
# Install serverless framework globally (if not already installed)
npm install -g serverless

# Install serverless-offline plugin (if not already installed)
npm install --save-dev serverless-offline

# Start local server
npm run dev
```

This will start a local server at `http://localhost:3000`

**Test the endpoint:**
```powershell
# In a new PowerShell window
curl "http://localhost:3000/generate?seed=0.5&theme=cosmic&width=800&height=1000" --output test-api.png
```

Or use a browser:
```
http://localhost:3000/generate?seed=0.5&theme=cosmic&width=800&height=1000
```

**Stop the server:** Press `Ctrl+C` in the terminal running the server.

## 📝 Step 3: Understanding API Parameters

The API accepts the following parameters (via query string or JSON body):

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `seed` | string | random | Random seed for deterministic generation |
| `theme` | string | `random` | Theme preset: `filament`, `bloom`, `cellular`, `vortex`, `crystal`, `organic`, `fractal`, `liquid`, `neural`, `cosmic`, `magnetic`, `wave`, `particle`, `random` |
| `width` | number | `1200` | Image width in pixels |
| `height` | number | `1500` | Image height in pixels |
| `format` | string | `png` | Image format: `png`, `jpeg`, `jpg` |
| `quality` | number | `90` | JPEG quality (1-100, only for JPEG) |
| `waitTime` | number | `3000` | Time to wait for shader render (milliseconds) |
| `scale` | number | `1.0` | Device scale factor (for higher DPI) |

**Example requests:**

**GET Request:**
```
GET /generate?seed=0.123&theme=cosmic&width=1920&height=2400&format=png
```

**POST Request (JSON):**
```json
POST /generate
Content-Type: application/json

{
  "seed": "0.123",
  "theme": "cosmic",
  "width": 1920,
  "height": 2400,
  "format": "png",
  "waitTime": 5000
}
```

## 🌐 Step 4: Deployment Options

### Option A: Deploy to Vercel (Recommended for Beginners)

Vercel is the easiest platform to deploy serverless functions.

**Prerequisites:**
- GitHub account (recommended) or Vercel account
- Vercel CLI installed

**Steps:**

1. **Install Vercel CLI:**
   ```powershell
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```powershell
   vercel login
   ```

3. **Important: Host your HTML files first**
   
   For Vercel to work, you need to host your `index.html` and assets somewhere accessible via URL. Options:
   
   **Option 1: Use Vercel's static hosting**
   - Create a separate Vercel project for your static files
   - Or use GitHub Pages, Netlify, or any static hosting
   
   **Option 2: Bundle assets (Advanced)**
   - Modify the function to serve HTML inline (more complex)

4. **Set environment variable:**
   ```powershell
   # Set HTML_PATH to your hosted HTML file URL
   vercel env add HTML_PATH
   # When prompted, enter: https://your-domain.com/index.html
   ```

5. **Deploy:**
   ```powershell
   cd serverless-structure
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No** (first time)
   - Project name? (Press Enter for default)
   - Directory? `./` (Press Enter)
   - Override settings? **No**

6. **Get your API URL:**
   After deployment, Vercel will give you a URL like:
   ```
   https://your-project.vercel.app/api/generate
   ```

7. **Test your deployed API:**
   ```powershell
   curl "https://your-project.vercel.app/api/generate?seed=0.5&theme=cosmic&width=800&height=1000" --output deployed-test.png
   ```

### Option B: Deploy to AWS Lambda (More Complex)

**Prerequisites:**
- AWS account
- AWS CLI installed and configured
- Serverless Framework installed globally

**Steps:**

1. **Install Serverless Framework:**
   ```powershell
   npm install -g serverless
   ```

2. **Configure AWS credentials:**
   ```powershell
   aws configure
   ```
   Enter your:
   - AWS Access Key ID
   - AWS Secret Access Key
   - Default region (e.g., `us-east-1`)
   - Default output format (e.g., `json`)

3. **Host your HTML files:**
   - Upload `index.html`, `sketch.js`, `shader.frag`, `shader.vert`, `p5.js` to S3
   - Make them publicly accessible
   - Or use CloudFront CDN
   - Note the URL (e.g., `https://your-bucket.s3.amazonaws.com/index.html`)

4. **Update serverless.yml:**
   Open `serverless-structure/serverless.yml` and update the environment variable:
   ```yaml
   environment:
     HTML_PATH: https://your-bucket.s3.amazonaws.com/index.html
   ```

5. **Deploy:**
   ```powershell
   cd serverless-structure
   npm run deploy
   ```

   This will:
   - Package your function
   - Create Lambda function
   - Create API Gateway endpoint
   - Output your API URL

6. **Get your API URL:**
   After deployment, you'll see output like:
   ```
   endpoints:
     GET - https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/generate
     POST - https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/generate
   ```

7. **Test:**
   ```powershell
   curl "https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/generate?seed=0.5&theme=cosmic" --output aws-test.png
   ```

## 🔧 Step 5: Troubleshooting Common Issues

### Issue: "HTML file not found"
**Solution:**
- For local testing: Ensure `index.html` is in the parent directory
- For deployment: Set `HTML_PATH` environment variable to a publicly accessible URL
- Verify the URL is accessible: `curl https://your-url.com/index.html`

### Issue: "Timeout errors"
**Solutions:**
- Increase `waitTime` parameter (try 5000-10000ms)
- Increase function timeout in `serverless.yml`:
  ```yaml
  timeout: 60  # Increase from 30 to 60 seconds
  ```

### Issue: "Memory errors"
**Solutions:**
- Increase Lambda memory allocation in `serverless.yml`:
  ```yaml
  memorySize: 3008  # Already set, but can increase if needed
  ```

### Issue: "Canvas not rendering"
**Solutions:**
- Increase `waitTime` parameter
- Check browser console logs (if accessible)
- Verify p5.js is loading correctly
- Ensure shader files are accessible

### Issue: "Browser launch failed" (Local testing)
**Solutions:**
- Install Chrome/Chromium browser
- Or use `puppeteer` instead of `puppeteer-core` (includes Chromium):
  ```powershell
   npm install puppeteer --save
   ```
  Then update `generate.js` to use `puppeteer` instead of `puppeteer-core`

### Issue: "Dependency conflicts"
**Solution:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- If issues persist, use `npm install --legacy-peer-deps`

## 📊 Step 6: Monitoring and Optimization

### Check Function Logs

**Vercel:**
- Go to your project dashboard
- Click on "Functions" tab
- View logs for each invocation

**AWS Lambda:**
```powershell
# View logs
aws logs tail /aws/lambda/shader-generator-api-dev-generate --follow
```

### Optimize Performance

1. **Reduce waitTime** if shader renders faster
2. **Use appropriate dimensions** - larger images take longer
3. **Cache responses** - same seed/theme combinations can be cached
4. **Monitor costs** - Lambda charges per invocation and duration

## 🎯 Next Steps

1. **Test thoroughly** with different parameters
2. **Set up monitoring** (CloudWatch for AWS, Vercel Analytics)
3. **Add error handling** for edge cases
4. **Implement caching** for frequently requested images
5. **Add authentication** if needed (API keys, etc.)
6. **Set up CI/CD** for automatic deployments

## 📚 Additional Resources

- [Vercel Serverless Functions Docs](https://vercel.com/docs/functions)
- [AWS Lambda Docs](https://docs.aws.amazon.com/lambda/)
- [Serverless Framework Docs](https://www.serverless.com/framework/docs)
- [Puppeteer Docs](https://pptr.dev/)

## 🆘 Getting Help

If you encounter issues:
1. Check the error logs (see Step 6)
2. Verify all prerequisites are met
3. Test locally first before deploying
4. Check that HTML files are accessible
5. Review the troubleshooting section above

---

**Ready to proceed?** Start with Step 1 to verify your installation!

