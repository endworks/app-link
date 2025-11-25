# App Link - Smart App Store Redirect

An Express.js server that redirects iOS devices to the App Store and all other devices to the Play Store.

## Features

- 🍎 Automatic iOS detection → App Store redirect
- 🤖 All other devices → Play Store redirect
- 🔍 Device detection endpoint for testing
- ❤️ Health check endpoint

## Installation

1. Install dependencies:
```bash
yarn install
```

## Configuration

Before running the server, set the required environment variables. You can either:

1. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

2. Or export them directly:

**Option A - Using App ID and Package Name (recommended):**
```bash
export APP_STORE_APP_ID="your-app-id"
export PLAY_STORE_PACKAGE_NAME="your.package.name"
```

**Option B - Using full URLs:**
```bash
export APP_STORE_URL="https://apps.apple.com/app/idyour-app-id"
export PLAY_STORE_URL="https://play.google.com/store/apps/details?id=your.package.name"
```

Replace:
- `your-app-id` with your actual App Store app ID (numeric ID)
- `your.package.name` with your Android package name

## Usage

### Start the server:
```bash
yarn start
```

### Development mode (with auto-reload):
```bash
yarn dev
```

The server will run on `http://localhost:3000` by default (or the port specified in the `PORT` environment variable).

## Docker

### Using pre-built image from GitHub Container Registry:
```bash
docker run -p 3000:3000 \
  -e APP_STORE_APP_ID="your-app-id" \
  -e PLAY_STORE_PACKAGE_NAME="your.package.name" \
  ghcr.io/endworks/app-link:latest
```

### Build the image locally:
```bash
docker build -t app-link .
```

### Run the container:
```bash
docker run -p 3000:3000 \
  -e APP_STORE_APP_ID="your-app-id" \
  -e PLAY_STORE_PACKAGE_NAME="your.package.name" \
  app-link
```

Or using full URLs:
```bash
docker run -p 3000:3000 \
  -e APP_STORE_URL="https://apps.apple.com/app/idyour-app-id" \
  -e PLAY_STORE_URL="https://play.google.com/store/apps/details?id=your.package.name" \
  app-link
```

### Run with environment file:
```bash
docker run -p 3000:3000 --env-file .env app-link
```

### GitHub Actions
The repository includes a GitHub Actions workflow that automatically builds and pushes Docker images to GitHub Container Registry on every push to the main branch. The image is available at `ghcr.io/endworks/app-link`.

## Endpoints

- `GET /` - Main redirect endpoint. Automatically redirects based on device.
- `GET /health` - Health check endpoint. Returns server status.
- `GET /detect` - Device detection endpoint. Returns detected device type (useful for testing).

## Testing

### Test device detection:
```bash
curl http://localhost:3000/detect
```

### Test with specific user agent (iOS):
```bash
curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" http://localhost:3000/detect
```

### Test with specific user agent (Android):
```bash
curl -H "User-Agent: Mozilla/5.0 (Linux; Android 10; SM-G973F)" http://localhost:3000/detect
```

## How It Works

The server uses User-Agent detection to identify the device type:
- **iOS**: Detects iPhone, iPad, or iPod → redirects to App Store
- **All other devices**: Desktop browsers, Android, or any other device → redirects to Play Store

## Environment Variables

Required (choose one option for each store):

**App Store (iOS):**
- `APP_STORE_APP_ID` - App Store app ID (numeric ID). If provided, URL will be constructed automatically.
- `APP_STORE_URL` - Full App Store URL. Use this if you need a custom URL format.

**Play Store (Android/Other):**
- `PLAY_STORE_PACKAGE_NAME` - Android package name (e.g., `com.example.app`). If provided, URL will be constructed automatically.
- `PLAY_STORE_URL` - Full Play Store URL. Use this if you need a custom URL format.

Optional:
- `PORT` - Server port (default: 3000)

**Note:** You must provide either the ID/package name OR the full URL for each store. The ID/package name takes precedence if both are provided.

## License

MIT
