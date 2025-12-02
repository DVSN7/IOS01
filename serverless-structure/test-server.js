/**
 * Standalone local server for manual testing
 * Keeps the server running so you can open it in your browser
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

const htmlDir = path.resolve(__dirname, '..');
const htmlFile = path.join(htmlDir, 'index.html');

if (!fs.existsSync(htmlFile)) {
    console.error('ERROR: HTML file not found at:', htmlFile);
    console.log('Please ensure index.html exists in the parent directory');
    process.exit(1);
}

// Create HTTP server
const server = http.createServer((req, res) => {
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

// Start server on port 8080 (or specified port)
const PORT = process.env.PORT || 8080;

server.listen(PORT, '127.0.0.1', () => {
    const url = `http://127.0.0.1:${PORT}/`;
    console.log('═══════════════════════════════════════════════════════');
    console.log('  Local Shader Test Server');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('  Server running at:');
    console.log(`  ${url}`);
    console.log('');
    console.log('  Open this URL in your browser to view your shader!');
    console.log('');
    console.log('  Press Ctrl+C to stop the server');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\nStopping server...');
    server.close(() => {
        console.log('Server stopped. Goodbye!');
        process.exit(0);
    });
});

