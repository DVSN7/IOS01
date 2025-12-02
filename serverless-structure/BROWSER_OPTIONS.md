# Browser Options for Local Testing

## Understanding the Requirements

**Important:** You don't need Chrome installed to **manually view** your shader in a browser. However, **Puppeteer** (the automation tool) needs a Chromium-based browser to automatically generate images.

## Two Different Use Cases

### 1. Manual Testing (Any Browser Works)
- You can open the local server URL in **any browser** (Chrome, Edge, Firefox, Safari, etc.)
- This is just for viewing/testing your shader manually
- The local server URL shown in console (e.g., `http://127.0.0.1:54683/`) can be opened in your preferred browser

### 2. Automated Image Generation (Needs Chromium-Based Browser)
- Puppeteer needs a Chromium-based browser to automate screenshot capture
- This is what `npm test` uses to generate `test-output.png`
- Options: Chrome, Edge, Chromium, or full Puppeteer (includes Chromium)

---

## Option 1: Use Microsoft Edge (Recommended if you have Windows)

Edge is Chromium-based and works with Puppeteer. If you have Windows, you likely already have Edge installed!

**The code now automatically detects Edge.** Just run:
```powershell
npm test
```

If Edge is found, it will use it automatically.

---

## Option 2: Use Full Puppeteer (No Browser Installation Needed)

Full Puppeteer includes its own Chromium browser, so you don't need to install anything.

**Steps:**

1. **Install full Puppeteer:**
   ```powershell
   cd serverless-structure
   npm install puppeteer --save
   ```

2. **Update the code to use Puppeteer instead of puppeteer-core:**
   
   Edit `api/generate.js` line 1:
   ```javascript
   // Change from:
   const puppeteer = require('puppeteer-core');
   
   // To:
   const puppeteer = require('puppeteer');
   ```

3. **Update the browser launch code:**
   
   In `api/generate.js`, find the local development section (around line 42) and replace it with:
   ```javascript
   } else {
       // Local development: Use full Puppeteer (includes Chromium)
       browserOptions = {
           headless: true,
           args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
       };
   }
   ```

4. **Test:**
   ```powershell
   npm test
   ```

**Pros:**
- ✅ No browser installation needed
- ✅ Always uses compatible Chromium version
- ✅ Works on any system

**Cons:**
- ⚠️ Downloads ~170MB Chromium on first install
- ⚠️ Slightly larger package size

---

## Option 3: Install Chrome (Traditional Approach)

If you prefer to install Chrome:

1. Download Chrome from: https://www.google.com/chrome/
2. Install it
3. Run `npm test` - it will be detected automatically

---

## Option 4: Set Custom Browser Path

If you have a Chromium-based browser in a non-standard location:

**PowerShell:**
```powershell
$env:CHROME_PATH = "C:\Path\To\Your\Browser.exe"
npm test
```

**Or set permanently:**
```powershell
[System.Environment]::SetEnvironmentVariable('CHROME_PATH', 'C:\Path\To\Your\Browser.exe', 'User')
```

---

## Which Option Should You Choose?

| Option | Best For | Installation Required |
|--------|----------|----------------------|
| **Edge** | Windows users who have Edge | ✅ Already installed |
| **Full Puppeteer** | Anyone who doesn't want to install browsers | ❌ No (downloads Chromium) |
| **Chrome** | Users who want Chrome anyway | ✅ Yes |
| **Custom Path** | Users with custom browser setup | ✅ Yes |

---

## Testing Your Setup

After choosing an option, test it:

```powershell
npm test
```

**Expected output:**
```
✓ Success! Image generated
✓ Image saved to: [path]\test-output.png
```

---

## Manual Browser Testing (Separate from Automation)

You can always test your shader manually in any browser:

1. **Start the local server** (it starts automatically during `npm test`)
2. **Copy the URL** shown in console: `http://127.0.0.1:XXXXX/`
3. **Open it in your preferred browser** (Chrome, Edge, Firefox, Safari, etc.)
4. **View your shader** - this is just for manual testing/viewing

**Note:** The local server only runs during `npm test`. If you want to keep it running for manual testing, you'd need a separate server (like `python -m http.server` or `npx http-server`).

---

## Troubleshooting

### "Browser not found" error

**Solution 1:** Use full Puppeteer (see Option 2 above)

**Solution 2:** Install Edge or Chrome

**Solution 3:** Set CHROME_PATH environment variable

### "Browser launch failed"

- Make sure the browser executable path is correct
- Try running with `--no-sandbox` flag (already included in code)
- Check browser permissions

### Want to use a different browser?

Puppeteer only works with Chromium-based browsers (Chrome, Edge, Chromium, Brave, etc.). Firefox and Safari are not supported by Puppeteer.

---

## Summary

- **For automation (npm test):** Needs Chromium-based browser (Chrome, Edge, or full Puppeteer)
- **For manual viewing:** Any browser works - just open the local server URL
- **Recommended:** Use Edge (if on Windows) or full Puppeteer (if you don't want to install anything)

