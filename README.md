<h1 style="font-size: 5rem; display: flex; align-items: center;">
  <img src="https://github.com/user-attachments/assets/0b04012c-8de9-40aa-a8ce-89003a948e96" alt="icon_vr"
       width="40" style="margin-right: 12px;" />
  <span style="font-size: 6rem; line-height: 1;">VisuaReader</span>
</h1>






A hands-free PDF/book reader powered by **blink detection**. Combines a React + Tailwind frontend with a Python FastAPI backend that runs **MediaPipe + OpenCV** for real-time blink detection.

📚 Start detection, open your preferred reader, and use **long or double long blinks** to flip pages.

---

## DEMO

https://github.com/user-attachments/assets/038500c8-6ad8-40a8-bc79-79ee25e55878

(webcam window is shown for demo purposes)



## 🎯 Features

- ✅ Long blink → **Next Page**
- ✅ Double long blink → **Previous Page**
- ✅ Real-time detection using webcam
- ✅ CPU-friendly — no external ML models required
- ✅ Modular frontend/backend setup
- ✅ Clean modern UI

---

## 🧠 How Blink Detection Works

1. Uses **MediaPipe’s 468-point face mesh** to track facial landmarks.
2. Extracts key points around both eyes.
3. Calculates the **Eye Aspect Ratio (EAR)**:

   ```
   EAR = (A + B) / (2 * C)
   ```

   Where:

   - A and B are vertical distances
   - C is the horizontal eye width

4. Blinks are detected when EAR drops below a threshold for a sustained duration.
5. Gesture Mappings:
   - 👁️ Long Blink → Next Page
   - 👁️👁️ Double Long Blink → Previous Page

---

## 📁 Project Structure

```
VisuaReader/
├── backend/
│   ├── main.py                # Blink detection script
│   ├── server.py              # FastAPI app
│   └── requirements.txt       # Backend dependencies
├── frontend/
│   ├── index.html             # Main HTML entry
│   ├── src/                   # React app
│   └── vite.config.ts         # Vite setup
├── main.js                    # Electron entry point
├── package.json               # Root scripts (Electron + Dev tools)
└── README.md
```

---

## ⚙️ Installation & Run

### 1. Clone the Repository

```bash
git clone https://github.com/Yash-Aanand/VisuaReader.git
cd VisuaReader
```

### 2. Install Frontend & Root Dependencies

```bash
npm install
cd frontend
npm install
cd ..
```

### 3. Set Up Backend (Python 3.10[+])

```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 4. Run in Development (root directory)

```bash
npm run dev
```

Starts:

- ⚛️ React frontend on `localhost:5173`
- ⚡ FastAPI backend on `localhost:8000`
- 🧠 Blink detection via Electron + Python script

### 5. Build for Production (root directory)

```bash
npm run build
npm start
```

---

## 🧪 Dependencies

**Python (in `requirements.txt`):**

```
fastapi==0.115.1
uvicorn==0.34.0
mediapipe==0.10.21
opencv-python==4.11.0.86
scipy==1.15.3
numpy==1.26.4
pyautogui==0.9.54
psutil==7.0.0
```

**JS/Frontend:**

- React + TypeScript
- Tailwind CSS
- Framer Motion
- Electron

---

## 🔐 License

MIT — free to use, modify, and distribute.

---

## 👨‍💻 Author

**Yash Aanand**  
Computer Science @ University of Waterloo  
Building accessible tools with computer vision and full-stack magic.

- 🌐 [yashaanand.com](https://yashaanand.com)
- 💼 [LinkedIn](https://www.linkedin.com/in/yash-aanand-35192b273/)
- 🛠️ [GitHub](https://github.com/Yash-Aanand)
