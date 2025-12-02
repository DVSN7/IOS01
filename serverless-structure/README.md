# Shader Generator API

Serverless API for generating shader art images using Puppeteer and headless Chrome.

## Features

- Generate high-quality shader art images via API
- Support for custom seeds, themes, dimensions, and formats
- Compatible with AWS Lambda and Vercel
- Headless browser rendering with Puppeteer

## API Endpoint

### GET/POST `/api/generate` or `/generate`

#### Query Parameters / Body

- `seed` (string, optional): Random seed for deterministic generation. Default: random
- `theme` (string, optional): Theme preset name. Options: `filament`, `bloom`, `cellular`, `vortex`, `crystal`, `organic`, `fractal`, `liquid`, `neural`, `cosmic`, `magnetic`, `wave`, `particle`, `random`. Default: `random`
- `width` (number, optional): Image width in pixels. Default: `1200`
- `height` (number, optional): Image height in pixels. Default: `1500`
- `format` (string, optional): Image format. Options: `png`, `jpeg`, `jpg`. Default: `png`
- `quality` (number, optional): JPEG quality (1-100). Default: `90`
- `waitTime` (number, optional): Time to wait for shader to render in milliseconds. Default: `3000`
- `scale` (number, optional): Device scale factor. Default: `1.0`

#### Response

Returns the generated image as binary data with appropriate content-type header.

#### Example Requests

**GET Request:**
```
GET /api/generate?seed=0.123&theme=cosmic&width=1920&height=2400&format=png
```

**POST Request:**
```json
POST /api/generate
Content-Type: application/json

{
  "seed": "0.123",
  "theme": "cosmic",
  "width": 1920,
  "height": 2400,
  "format": "png"
}
```

## Local Development

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. For AWS Lambda local testing:
```bash
npm run dev
```

This starts a local server at `http://localhost:3000`

3. Test the endpoint:
```bash
curl "http://localhost:3000/generate?seed=0.5&theme=cosmic&width=800&height=1000" --output test.png
```

## Deployment

### AWS Lambda (Serverless Framework)

1. Install Serverless Framework globally (if not already installed):
```bash
npm install -g serverless
```

2. Configure AWS credentials:
```bash
aws configure
```

3. Deploy:
```bash
npm run deploy
```

### Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
npm run deploy:vercel
```

Or use the Vercel dashboard to connect your repository.

## Environment Variables

- `HTML_PATH`: Path or URL to the HTML file containing the shader. For serverless deployments, you may need to host the HTML file separately or bundle it.

## Notes

- The function requires access to the `index.html` file and associated assets (shader files, p5.js, etc.)
- For production deployments, consider hosting the HTML and assets on a CDN and passing the URL via `HTML_PATH`
- The function uses `@sparticuz/chromium` for AWS Lambda compatibility, which includes a pre-compiled Chromium binary
- Memory allocation should be at least 3008MB for optimal performance

## Troubleshooting

- **Timeout errors**: Increase the `waitTime` parameter or function timeout
- **Memory errors**: Increase the function memory allocation
- **HTML file not found**: Ensure `HTML_PATH` is correctly set or the file is accessible
- **Canvas not rendering**: Increase `waitTime` to allow more time for shader initialization

