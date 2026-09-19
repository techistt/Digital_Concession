const fs = require("fs");
const path = require("path");

const dist = path.join(__dirname, "dist");

const htmlFiles = fs
  .readdirSync(dist)
  .filter((file) => file.endsWith(".html"));

for (const file of htmlFiles) {
  const filePath = path.join(dist, file);
  let html = fs.readFileSync(filePath, "utf8");

  if (!html.includes('rel="manifest"')) {
    html = html.replace(
      "</head>",
      `
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#208AEF" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="Digital Concession" />
</head>`
    );
  }

  if (!html.includes("serviceWorker")) {
    html = html.replace(
      "</body>",
      `
<script>
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then(() => console.log("Service Worker registered"))
      .catch((error) => console.error("Service Worker registration failed:", error));
  });
}
</script>
</body>`
    );
  }

  fs.writeFileSync(filePath, html);
}

console.log("PWA metadata and service worker registration added.");

