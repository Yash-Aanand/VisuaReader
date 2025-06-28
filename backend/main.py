import cv2
import mediapipe as mp
import time
from scipy.spatial import distance as dist
import pyautogui
import sys
sys.stdout.reconfigure(encoding='utf-8')


# VisuaReader Blink Detection Script
print("[INFO] Starting VisuaReader Blink Detection Script...")

# === EAR Calculation ===
def calculate_EAR(eye):
    A = dist.euclidean(eye[1], eye[5])
    B = dist.euclidean(eye[2], eye[4])
    C = dist.euclidean(eye[0], eye[3])
    return (A + B) / (2.0 * C)

# === Constants === #PLANNED TO MAKE CONFIGURABLE
# Thresholds for blink detection
blink_thresh = 0.20
blink_duration_thresh = 0.3
double_blink_gap = 1

# === Mediapipe Setup ===
print("[INFO] Initializing MediaPipe Face Mesh...")
try:
    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, refine_landmarks=True)
    print("[INFO] MediaPipe initialized successfully.")
except Exception as e:
    print(f"[ERROR] Failed to initialize MediaPipe: {e}")
    exit()

LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]

closed_start_time = None
pending_single = False
pending_time = 0

print("[INFO] Attempting to open webcam...")
cam = cv2.VideoCapture(0)
if not cam.isOpened():
    print("[ERROR] Cannot open webcam.")
    exit()
print("[INFO] Webcam opened successfully.")

while True:
    ret, frame = cam.read()
    if not ret:
        print("[ERROR] Failed to read frame from webcam.")
        break

    frame = cv2.flip(frame, 1)
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)
    current_time = time.time()

    if results.multi_face_landmarks:
        print("[INFO] Face detected.")
        face = results.multi_face_landmarks[0]
        landmarks = face.landmark

        h, w = frame.shape[:2]
        left_eye = [(int(landmarks[i].x * w), int(landmarks[i].y * h)) for i in LEFT_EYE]
        right_eye = [(int(landmarks[i].x * w), int(landmarks[i].y * h)) for i in RIGHT_EYE]

        left_EAR = calculate_EAR(left_eye)
        right_EAR = calculate_EAR(right_eye)
        avg_EAR = (left_EAR + right_EAR) / 2.0

        if avg_EAR < blink_thresh:
            cv2.putText(frame, "Blinking...", (10, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 100, 255), 2)
            if closed_start_time is None:
                closed_start_time = current_time
        else:
            if closed_start_time is not None:
                blink_duration = current_time - closed_start_time
                if blink_duration >= blink_duration_thresh:
                    if pending_single and (current_time - pending_time <= double_blink_gap):
                        cv2.putText(frame, "Double Long Blink → Previous Page", (10, 90),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 255), 2)
                        print("Double Blink Detected → Go to Previous Page")
                        pyautogui.press('left')
                        pending_single = False
                        pending_time = 0
                    else:
                        pending_single = True
                        pending_time = current_time
                closed_start_time = None

        if pending_single and (current_time - pending_time > double_blink_gap):
            cv2.putText(frame, "Long Blink → Next Page", (10, 90),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
            print("Long Blink Detected → Go to Next Page")
            pyautogui.press('right')
            pending_single = False

        cv2.putText(frame, f"L_EAR: {left_EAR:.2f}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
        cv2.putText(frame, f"R_EAR: {right_EAR:.2f}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)

        for (x, y) in left_eye + right_eye:
            cv2.circle(frame, (x, y), 1, (0, 255, 0), -1)
    else:
        print("[INFO] No face detected.")

    # cv2.imshow("MediaPipe Blink Detection", frame)
    if cv2.waitKey(5) & 0xFF == ord('q'):
        print("[INFO] Quitting...")
        break

cam.release()
cv2.destroyAllWindows()
