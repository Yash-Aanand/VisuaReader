from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import subprocess
import os
import signal

process = None  # Global process reference

@asynccontextmanager
async def lifespan(app: FastAPI):
    # On startup
    yield
    # On shutdown
    global process
    if process:
        print("🔻 Shutting down main.py...")
        os.kill(process.pid, signal.SIGTERM)
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

@app.post("/start-blink")
def start_blink():
    global process
    if process is None:
        # process = subprocess.Popen(["python", "main.py"])
        script_dir = os.path.dirname(os.path.abspath(__file__))
        main_path = os.path.join(script_dir, "main.py")
        process = subprocess.Popen(["python", main_path])
        return {"status": "started"}
    return {"status": "already running"}

@app.post("/stop-blink")
def stop_blink():
    global process
    if process:
        os.kill(process.pid, signal.SIGTERM)
        process = None
        return {"status": "stopped"}
    return {"status": "not running"}
