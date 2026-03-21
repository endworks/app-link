const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

let apps;
try {
  apps = require("./apps.json");
} catch {
  console.error("ERROR: apps.json not found. Copy apps.example.json to apps.json and fill in your app details.");
  process.exit(1);
}

const normalizeUserAgent = (userAgent) => (userAgent || "").toLowerCase();

const isIOSDevice = (userAgent) => {
  const ua = normalizeUserAgent(userAgent);
  return /iphone|ipad|ipod/.test(ua);
};

const isMacOSDevice = (userAgent) => {
  const ua = normalizeUserAgent(userAgent);
  return !isIOSDevice(userAgent) && (ua.includes("macintosh") || ua.includes("mac os x"));
};

function resolveUrls(appEntry) {
  const iosUrl = appEntry.ios.url ?? `https://apps.apple.com/app/id${appEntry.ios.appId}`;
  const androidUrl = appEntry.android.url ?? `https://play.google.com/store/apps/details?id=${appEntry.android.packageName}`;
  return { iosUrl, androidUrl };
}

app.get("/", (req, res) => {
  const appEntry = apps.find((a) => a.domains.includes(req.hostname));
  if (!appEntry) {
    return res.status(404).json({ error: `No app configured for domain: ${req.hostname}` });
  }

  const userAgent = req.headers["user-agent"] || "";
  const isIOS = isIOSDevice(userAgent);
  const isMacOS = isMacOSDevice(userAgent);
  const redirectToAppStore = isIOS || isMacOS;

  const { iosUrl, androidUrl } = resolveUrls(appEntry);
  const redirectUrl = redirectToAppStore ? iosUrl : androidUrl;

  console.log(
    `Domain: ${req.hostname}, Device: ${redirectToAppStore ? "App Store" : "Play Store"}, ` +
      `macOS: ${isMacOS}, User-Agent: ${userAgent.substring(0, 50)}...`
  );
  res.redirect(301, redirectUrl);
});

app.get("/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/detect", (req, res) => {
  const appEntry = apps.find((a) => a.domains.includes(req.hostname));
  if (!appEntry) {
    return res.status(404).json({ error: `No app configured for domain: ${req.hostname}` });
  }

  const userAgent = req.headers["user-agent"] || "";
  const isIOS = isIOSDevice(userAgent);
  const isMacOS = isMacOSDevice(userAgent);
  const redirectToAppStore = isIOS || isMacOS;

  res.json({
    domain: req.hostname,
    isIOS,
    isMacOS,
    userAgent,
    redirectTo: redirectToAppStore ? "App Store" : "Play Store",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Configured domains: ${apps.map((a) => a.domain).join(", ")}`);
});
