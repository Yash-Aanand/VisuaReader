const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const fetch = require("node-fetch");

let backend;
let win;
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
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "frontend", "dist", "index.html"));
  }

  // Graceful backend shutdown on window close
  win.on("close", async () => {
    if (backend) {
      try {
        const res = await fetch("http://localhost:8000/stop-blink", { method: "POST" });
        if (res.ok) {
          console.log("[Electron] /stop-blink called successfully");
        } else {
          console.warn("[Electron] /stop-blink returned non-OK status");
        }
      } catch (err) {
        console.warn("[Electron] Could not reach backend /stop-blink:", err.message);
      }
    }
  });
}

app.whenReady().then(() => {
  console.log("[Electron] Launching FastAPI backend...");

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

app.on("window-all-closed", async () => {
  if (backend) {
    try {
      await fetch("http://localhost:8000/stop-blink", { method: "POST" });
      console.log("[Electron] /stop-blink called before quitting");
    } catch (err) {
      console.warn("[Electron] Could not reach backend /stop-blink on quit:", err.message);
    }

    try {
      backend.kill("SIGTERM");
      console.log("[Electron] Force killed backend process");
    } catch (e) {
      console.warn("[Electron] Failed to kill backend:", e.message);
    }
  }

  if (process.platform !== "darwin") app.quit();
});
