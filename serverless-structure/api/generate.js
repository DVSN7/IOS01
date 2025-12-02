const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

/**
 * Serverless function to generate shader art images
 * Compatible with AWS Lambda, Vercel, and other serverless platforms
 */
exports.handler = async (event, context) => {
    let browser = null;
    let localServer = null;
    
    try {
        // Parse request parameters
        const params = event.queryStringParameters || event.body || {};
        const parsedBody = typeof params === 'string' ? JSON.parse(params) : params;
        
        const {
            seed = Math.random().toString(),
            theme = 'random',
            width = 1200,
            height = 1500,
            format = 'png',
            quality = 90,
            waitTime = 3000, // Time to wait for shader to render (ms)
            scale = 1.0
        } = parsedBody;
        
        // Launch browser with appropriate options for serverless
        const isProduction = process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL;
        
        let browserOptions;
        
        if (isProduction) {
            // Production: Use @sparticuz/chromium
            browserOptions = {
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            };
        } else {
            // Local development: Find Chrome executable
            const fs = require('fs');
            const path = require('path');
            const os = require('os');
            
            let chromePath = null;
            
            // Common Chrome/Chromium-based browser installation paths on Windows
            const possiblePaths = [
                // Chrome
                'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
                path.join(os.homedir(), 'AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'),
                // Microsoft Edge (Chromium-based, works with Puppeteer)
                'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
                'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
                path.join(os.homedir(), 'AppData\\Local\\Microsoft\\Edge\\Application\\msedge.exe'),
                // Chromium
                'C:\\Program Files\\Chromium\\Application\\chrome.exe',
                path.join(os.homedir(), 'AppData\\Local\\Chromium\\Application\\chrome.exe'),
                // Environment variable override (highest priority)
                process.env.CHROME_PATH,
            ];
            
            // Find first existing Chrome path
            for (const possiblePath of possiblePaths) {
                if (possiblePath && fs.existsSync(possiblePath)) {
                    chromePath = possiblePath;
                    break;
                }
            }
            
            if (!chromePath) {
                throw new Error(
                    'Chrome/Chromium-based browser not found.\n\n' +
                    'OPTIONS:\n' +
                    '1. Install Chrome, Edge, or Chromium\n' +
                    '2. Use full Puppeteer (includes Chromium): npm install puppeteer --save\n' +
                    '3. Set CHROME_PATH environment variable to your browser executable\n\n' +
                    'Common locations:\n' +
                    '  Chrome: C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe\n' +
                    '  Edge:   C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe\n' +
                    '  Or set: $env:CHROME_PATH = "C:\\path\\to\\browser.exe"'
                );
            }
            
            browserOptions = {
                executablePath: chromePath,
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            };
        }
        
        browser = await puppeteer.launch(browserOptions);
        const page = await browser.newPage();
        
        // Set viewport size
        await page.setViewport({
            width: parseInt(width),
            height: parseInt(height),
            deviceScaleFactor: parseFloat(scale) || 1.0,
        });
        
        // Get the path to the HTML file
        // In serverless, we need to construct the full URL or use file:// protocol
        const htmlPath = process.env.HTML_PATH || './index.html';
        const isUrl = htmlPath.startsWith('http://') || htmlPath.startsWith('https://');
        
        let localServer = null;
        
        if (isUrl) {
            await page.goto(htmlPath, { waitUntil: 'networkidle0' });
        } else {
            // For local testing, start a simple HTTP server to avoid CORS issues with file://
            const path = require('path');
            const fs = require('fs');
            const http = require('http');
            
            const htmlDir = path.resolve(process.cwd(), '..');
            const htmlFile = path.join(htmlDir, 'index.html');
            
            if (!fs.existsSync(htmlFile)) {
                throw new Error(`HTML file not found at: ${htmlFile}`);
            }
            
            // Start a local HTTP server
            localServer = http.createServer((req, res) => {
                let filePath = path.join(htmlDir, req.url === '/' ? 'index.html' : req.url);
                
                // Security: ensure file is within htmlDir
                if (!filePath.startsWith(htmlDir)) {
                    res.writeHead(403);
                    res.end('Forbidden');
                    return;
                }
                
                // Default to index.html if file doesn't exist
                if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
                    filePath = htmlFile;
                }
                
                const ext = path.extname(filePath).toLowerCase();
                const contentTypes = {
                    '.html': 'text/html',
                    '.js': 'application/javascript',
                    '.css': 'text/css',
                    '.frag': 'text/plain',
                    '.vert': 'text/plain',
                    '.json': 'application/json',
                };
                
                const contentType = contentTypes[ext] || 'application/octet-stream';
                
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        res.writeHead(404);
                        res.end('Not found');
                    } else {
                        res.writeHead(200, { 'Content-Type': contentType });
                        res.end(data);
                    }
                });
            });
            
            // Start server on a random port
            await new Promise((resolve, reject) => {
                localServer.listen(0, '127.0.0.1', () => {
                    const port = localServer.address().port;
                    const localUrl = `http://127.0.0.1:${port}/`;
                    console.log(`Local server started at: ${localUrl}`);
                    resolve(localUrl);
                });
                localServer.on('error', reject);
            }).then(async (localUrl) => {
                await page.goto(localUrl, { waitUntil: 'networkidle0' });
            });
        }
        
        // Inject seed and theme parameters into the page
        await page.evaluate((params) => {
            window.GENERATION_PARAMS = {
                seed: params.seed,
                theme: params.theme,
                width: params.width,
                height: params.height
            };
            
            // Override Math.random to use the seed
            if (params.seed) {
                let seedValue = parseFloat(params.seed) || 0;
                // Simple seeded random number generator
                let seed = seedValue;
                Math.random = function() {
                    seed = (seed * 9301 + 49297) % 233280;
                    return seed / 233280;
                };
            }
        }, { seed, theme, width, height });
        
        // Wait for p5.js and shader to load
        try {
            // Wait for p5.js to be available
            await page.waitForFunction(() => {
                return typeof window.p5 !== 'undefined' || typeof p5 !== 'undefined';
            }, { timeout: 10000 });
            
            // Wait for canvas to exist and have content
            await page.waitForFunction(() => {
                const canvas = document.querySelector('canvas');
                if (!canvas) return false;
                
                // Check if canvas has been drawn on (not just black)
                // We'll check if the canvas has non-zero pixel data
                const ctx = canvas.getContext('2d');
                if (!ctx) return false;
                
                // Sample a few pixels to see if canvas has content
                const imageData = ctx.getImageData(0, 0, Math.min(10, canvas.width), Math.min(10, canvas.height));
                const data = imageData.data;
                
                // Check if any pixel is not black (has some color)
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    // If any pixel is not pure black, canvas has content
                    if (r > 0 || g > 0 || b > 0) {
                        return true;
                    }
                }
                
                return false; // All pixels are black, might still be loading
            }, { timeout: 15000, polling: 500 });
            
            console.log('Canvas content detected, waiting for shader to fully render...');
        } catch (error) {
            console.log('Canvas content check timeout, waiting additional time for shader...');
        }
        
        // Additional wait time for shader to fully render
        await page.waitForTimeout(parseInt(waitTime));
        
        // Final check - wait a bit more if canvas is still black
        try {
            await page.waitForFunction(() => {
                const canvas = document.querySelector('canvas');
                if (!canvas) return false;
                const ctx = canvas.getContext('2d');
                if (!ctx) return false;
                
                // Sample center pixels
                const centerX = Math.floor(canvas.width / 2);
                const centerY = Math.floor(canvas.height / 2);
                const imageData = ctx.getImageData(centerX - 5, centerY - 5, 10, 10);
                const data = imageData.data;
                
                // Check if center has non-black content
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i] > 10 || data[i + 1] > 10 || data[i + 2] > 10) {
                        return true;
                    }
                }
                return false;
            }, { timeout: 5000, polling: 200 });
        } catch (error) {
            console.log('Final canvas check timeout, proceeding with screenshot anyway...');
        }
        
        // Capture screenshot
        const screenshotOptions = {
            type: format === 'jpeg' || format === 'jpg' ? 'jpeg' : 'png',
            quality: format === 'jpeg' || format === 'jpg' ? parseInt(quality) : undefined,
            fullPage: false,
        };
        
        const screenshot = await page.screenshot(screenshotOptions);
        
        // Close browser
        await browser.close();
        browser = null;
        
        // Close local server if it was started
        if (localServer) {
            await new Promise((resolve) => {
                localServer.close(() => resolve());
            });
            localServer = null;
        }
        
        // Return response
        const contentType = format === 'jpeg' || format === 'jpg' 
            ? 'image/jpeg' 
            : 'image/png';
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
            },
            body: screenshot.toString('base64'),
            isBase64Encoded: true,
        };
        
    } catch (error) {
        console.error('Error generating shader image:', error);
        
        // Ensure browser is closed on error
        if (browser) {
            await browser.close().catch(() => {});
        }
        
        // Close local server if it was started
        if (localServer) {
            await new Promise((resolve) => {
                localServer.close(() => resolve());
            }).catch(() => {});
        }
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                error: 'Failed to generate shader image',
                message: error.message,
            }),
        };
    }
};

// For Vercel serverless functions
module.exports = exports.handler;

