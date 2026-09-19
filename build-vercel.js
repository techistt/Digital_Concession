const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = __dirname;
const mobile = path.join(root, "Mobile-App");
const web = path.join(root, "Web-App");
const output = path.join(root, "vercel-output");

function run(command, cwd) {
  console.log(`\n> ${command}`);
  execSync(command, {
    cwd,
    stdio: "inherit",
    shell: true,
  });
}

function removeDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function copyDir(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  fs.cpSync(source, destination, {
    recursive: true,
    force: true,
  });
}

console.log("=== Digital Concession Vercel Build ===");

// Clean previous combined output
removeDir(output);
fs.mkdirSync(output, { recursive: true });

// --------------------------------------------------
// 1. Build Student PWA
// --------------------------------------------------
console.log("\n=== Building Student PWA ===");

run("npm install", mobile);
run("npx expo export --platform web --clear", mobile);

if (fs.existsSync(path.join(mobile, "add-pwa.js"))) {
  run("node add-pwa.js", mobile);
}

// Copy Mobile-App/dist to root output
const mobileDist = path.join(mobile, "dist");

if (!fs.existsSync(mobileDist)) {
  throw new Error("Mobile-App/dist was not created.");
}

copyDir(mobileDist, output);

// --------------------------------------------------
// 2. Build Admin Web-App
// --------------------------------------------------
console.log("\n=== Building Admin Web-App ===");

run("npm install", web);
run("npm run build", web);

const webDist = path.join(web, "dist");

if (!fs.existsSync(webDist)) {
  throw new Error("Web-App/dist was not created.");
}

// Copy Web-App/dist to /admin
const adminOutput = path.join(output, "admin");

copyDir(webDist, adminOutput);

// --------------------------------------------------
// 3. Finish
// --------------------------------------------------
console.log("\n=== Combined Vercel output created ===");
console.log(`Student app: ${output}`);
console.log(`Admin app:   ${adminOutput}`);
console.log("\nRoutes:");
console.log("  /        -> Student PWA");
console.log("  /admin/  -> Admin Web-App");
