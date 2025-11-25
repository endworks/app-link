const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const APP_STORE_APP_ID = process.env.APP_STORE_APP_ID;
const APP_STORE_URL = process.env.APP_STORE_URL;
const PLAY_STORE_PACKAGE_NAME = process.env.PLAY_STORE_PACKAGE_NAME;
const PLAY_STORE_URL = process.env.PLAY_STORE_URL;

let finalAppStoreUrl;
if (APP_STORE_APP_ID) {
  finalAppStoreUrl = `https://apps.apple.com/app/id${APP_STORE_APP_ID}`;
} else if (APP_STORE_URL) {
  finalAppStoreUrl = APP_STORE_URL;
} else {
  console.error('ERROR: Either APP_STORE_APP_ID or APP_STORE_URL environment variable is required');
  process.exit(1);
}

let finalPlayStoreUrl;
if (PLAY_STORE_PACKAGE_NAME) {
  finalPlayStoreUrl = `https://play.google.com/store/apps/details?id=${PLAY_STORE_PACKAGE_NAME}`;
} else if (PLAY_STORE_URL) {
  finalPlayStoreUrl = PLAY_STORE_URL;
} else {
  console.error('ERROR: Either PLAY_STORE_PACKAGE_NAME or PLAY_STORE_URL environment variable is required');
  process.exit(1);
}

function isIOSDevice(userAgent) {
  const ua = userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const isIOS = isIOSDevice(userAgent);
  
  const redirectUrl = isIOS ? finalAppStoreUrl : finalPlayStoreUrl;
  
  console.log(`Device: ${isIOS ? 'iOS' : 'Other'}, User-Agent: ${userAgent.substring(0, 50)}...`);
  res.redirect(301, redirectUrl);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/detect', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const isIOS = isIOSDevice(userAgent);
  
  res.json({
    isIOS,
    userAgent,
    redirectTo: isIOS ? 'App Store' : 'Play Store'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to test`);
  console.log(`App Store URL: ${finalAppStoreUrl}`);
  console.log(`Play Store URL: ${finalPlayStoreUrl}`);
});
