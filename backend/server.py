from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import subprocess
import os
import signal
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
        for child in parent.children(recursive=True):
            child.kill()
        parent.kill()
        print("[INFO] Successfully terminated process tree.")
    except Exception as e:
        print(f"[ERROR] Could not terminate process tree: {e}")

@app.post("/start-blink")
def start_blink():
    global process
    if process is None:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        main_path = os.path.join(script_dir, "main.py")
        try:
            if platform.system() == "Windows":
                process = subprocess.Popen(
                    ["python", main_path],
                    creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
                )
            else:
                process = subprocess.Popen(["python3", main_path])
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
