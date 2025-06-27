const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const fetch = require("node-fetch");

let backend;
let win;

// 🔧 Detect if running in development mode
const isDev = process.env.NODE_ENV === "development";

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  if (isDev) {
    // 🧪 Load from Vite dev server
    win.loadURL("http://localhost:5173");
  } else {
    // 📦 Load built frontend in production
    win.loadFile(path.join(__dirname, "frontend", "dist", "index.html"));
  }

  // 🌙 Graceful cleanup on window close
  win.on("close", async () => {
    if (backend) {
      try {
        await fetch("http://localhost:8000/stop-blink", { method: "POST" });
        console.log("[Electron] /stop-blink called");
      } catch (err) {
        console.warn("[Electron] Could not stop blink process:", err.message);
      }
    }
  });
}

app.whenReady().then(() => {
  // 🚀 Start FastAPI backend
  backend = spawn("python", ["-m", "uvicorn", "backend.server:app", "--host", "127.0.0.1", "--port", "8000"], {
  cwd: __dirname,
  shell: true,
  stdio: "inherit",
});


  backend.on("exit", (code) => {
    console.log(`[Backend exited with code ${code}]`);
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 🧹 Kill backend on quit
app.on("window-all-closed", () => {
  if (backend) {
    backend.kill("SIGTERM");
    console.log("[Electron] Killed backend process");
  }

  if (process.platform !== "darwin") app.quit();
});
