const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const fetch = require("node-fetch");
const treeKill = require("tree-kill");

let backend;
let win;
const isDev = process.env.NODE_ENV === "development";

function killBackend() {
  if (backend && backend.pid) {
    treeKill(backend.pid, 'SIGTERM', (err) => {
      if (err) {
        console.warn("[Electron] Failed to kill backend:", err.message);
      } else {
        console.log("[Electron] ✅ Successfully killed backend process tree");
      }
    });
  }
}

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

      killBackend();
    }
  });
}

app.whenReady().then(() => {
  console.log("[Electron] 🚀 Launching FastAPI backend...");

  backend = spawn("python", ["-m", "uvicorn", "backend.server:app", "--host", "127.0.0.1", "--port", "8000"], {
    cwd: __dirname,
    shell: true,
    detached: true,       // 🎯 Crucial to make it independent of the shell
    stdio: "ignore",      // 👈 Needed for detached processes
  });

  backend.unref();        // 🧠 Allow Electron to exit without waiting on child

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

    killBackend();
  }

  if (process.platform !== "darwin") app.quit();
});
