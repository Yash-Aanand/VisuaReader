from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import subprocess
import os
import platform
import psutil

process = None  # Global process reference

@asynccontextmanager
async def lifespan(app: FastAPI):
    # On startup
    yield
    # On shutdown
    global process
    if process:
        print("🔻 Shutting down main.py...")
        _kill_process_tree(process)
        process = None

app = FastAPI(lifespan=lifespan)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _kill_process_tree(proc):
    try:
        parent = psutil.Process(proc.pid)
        children = parent.children(recursive=True)
        for child in children:
            print(f"[INFO] Killing child PID {child.pid}")
            child.kill()
        parent.kill()
        gone, alive = psutil.wait_procs([parent] + children, timeout=3)
        print(f"[INFO] Successfully terminated process tree. Gone: {[p.pid for p in gone]}")
    except Exception as e:
        print(f"[ERROR] Could not terminate process tree: {e}")

@app.post("/start-blink")
def start_blink():
    global process
    if process is None:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        main_path = os.path.join(script_dir, "main.py")
        try:
            creationflags = 0
            if platform.system() == "Windows":
                creationflags = subprocess.CREATE_NO_WINDOW | subprocess.CREATE_NEW_PROCESS_GROUP

            process = subprocess.Popen(
                ["python", main_path] if platform.system() == "Windows" else ["python3", main_path],
                creationflags=creationflags
            )
            return {"status": "started"}
        except Exception as e:
            return {"status": "error", "detail": str(e)}
    return {"status": "already running"}

@app.post("/stop-blink")
def stop_blink():
    global process
    if process:
        try:
            _kill_process_tree(process)
            process = None
            return {"status": "stopped"}
        except Exception as e:
            return {"status": "error", "detail": str(e)}
    return {"status": "not running"}
