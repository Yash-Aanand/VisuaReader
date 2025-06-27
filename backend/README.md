# VisuaReader Blink Detection (MediaPipe + OpenCV)

A lightweight, real-time eye blink detection system using **MediaPipe** and **OpenCV**. This tool enables hands-free control (e.g., turning pages) by detecting long and double blinks through facial landmark analysis.

---
 
## 🎯 Features

- ✅ Real-time blink detection
- ✅ Long blink → "Next Page"
- ✅ Double long blink → "Previous Page"
- ✅ Efficient CPU-only pipeline using Google MediaPipe
- ✅ Debug info with EAR (Eye Aspect Ratio) display

---

## 🧠 How It Works

1. Uses MediaPipe’s **468-point face mesh** to track facial landmarks.
2. Extracts key points around both eyes.
3. Calculates **EAR (Eye Aspect Ratio)**:

EAR = (A + B) / (2 * C)

yaml
Copy
Edit

Where:
- A and B = vertical distances between eye points
- C = horizontal distance across the eye

4. If EAR falls below a threshold:
- It's considered a blink.
- Blink duration and timing are used to detect:
  - Long Blink → Next Page
  - Double Long Blink → Previous Page

---

## 📁 Project Structure

visuareader-blink/
├── main.py # Main blink detection script
├── requirements.txt # Python dependencies
├── .gitignore # Git exclusions
└── README.md # Project documentation

yaml
Copy
Edit

---

## ⚙️ Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourname/visuareader-blink.git
   cd visuareader-blink
Create and activate a virtual environment:

Windows:

bash
Copy
Edit
python -m venv venv
venv\Scripts\activate
macOS/Linux:

bash
Copy
Edit
python3 -m venv venv
source venv/bin/activate
Install dependencies:

bash
Copy
Edit
pip install -r requirements.txt
🚀 Run the Script
bash
Copy
Edit
python main.py
A webcam window will open.

Press q to exit.

✅ Gesture Mappings
Gesture	Action
👁️ Long Blink	Next Page
👁️👁️ Double Long Blink	Previous Page

🧰 Dependencies
Only essential packages are included:

mediapipe==0.10.21

opencv-python==4.11.0.86

scipy==1.15.3

numpy==1.26.4

🧪 Notes
Works best under good lighting conditions.

No .dat model files needed — everything runs from MediaPipe’s internal model.

Easily extendable to include wink-based commands or audio feedback.

👨‍💻 Author
Yash — Computer Science student at the University of Waterloo, building hands-free accessible tools using computer vision and modern Python tech.

🔐 License
MIT License — free to use, modify, and distribute.

yaml
Copy
Edit
