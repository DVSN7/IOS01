/**
 * Simple test script for local development
 * Tests the generate function with sample parameters
 */

const fs = require('fs');
const path = require('path');

// Mock event object for local testing
const mockEvent = {
    queryStringParameters: {
        seed: '0.5',
        theme: 'cosmic',
        width: '800',
        height: '1000',
        format: 'png',
        waitTime: '8000'  // Increased to allow shader to fully render
    }
};

const mockContext = {};

async function test() {
    try {
        console.log('Testing shader generator API...');
        console.log('Parameters:', mockEvent.queryStringParameters);
        
        // Import the handler
        const handler = require('./api/generate.js');
        
        // Set HTML_PATH to point to parent directory
        process.env.HTML_PATH = path.resolve(__dirname, '..', 'index.html');
        console.log('HTML Path:', process.env.HTML_PATH);
        
        // Check if HTML file exists
        if (!fs.existsSync(process.env.HTML_PATH)) {
            console.error('ERROR: HTML file not found at:', process.env.HTML_PATH);
            console.log('Please ensure index.html exists in the parent directory');
            process.exit(1);
        }
        
        // Call the handler
        const result = await handler(mockEvent, mockContext);
        
        if (result.statusCode === 200) {
            console.log('✓ Success! Image generated');
            console.log('Content-Type:', result.headers['Content-Type']);
            console.log('Image size:', (result.body.length * 3) / 4, 'bytes (base64)');
            
            // Save the image
            const outputPath = path.join(__dirname, 'test-output.png');
            const imageBuffer = Buffer.from(result.body, 'base64');
            fs.writeFileSync(outputPath, imageBuffer);
            console.log('✓ Image saved to:', outputPath);
        } else {
            console.error('✗ Error:', result.statusCode);
            console.error('Response:', result.body);
        }
    } catch (error) {
        console.error('✗ Test failed:', error);
        process.exit(1);
    }
}

test();

