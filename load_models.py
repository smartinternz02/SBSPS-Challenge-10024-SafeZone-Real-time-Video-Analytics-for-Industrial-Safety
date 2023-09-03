from PIL import Image
import torch
from ultralytics import YOLO
from transformers import AutoFeatureExtractor, AutoModelForImageClassification
import math
import torchvision.transforms as transforms
import cv2
import threading
import time
from models.safety_gear_detection_script import safety_gear
from models.fire_detection_script import predict_image_func
from models.hand_gest import hand_gesture_detection
from models.image_storing import store_data

video_source = "https://192.168.0.104/video"   # Path to the livestream
process0 = threading.Thread(target=store_data, args=[video_source])
process1 = threading.Thread(target=safety_gear, args=[video_source])
process2 = threading.Thread(target=predict_image_func, args=[video_source])
process3 = threading.Thread(
    target=hand_gesture_detection.detect_gesture, args=[video_source]
)

# Starting all the threads
process0.start()
time.sleep(5)
process1.start()
process2.start()
process3.start()

# Joining back all the threads to the main program
process1.join()
process2.join()
process3.join()
