from PIL import Image
import torch
import math
from ultralytics import YOLO
import cv2
import requests
import time
import json
from datetime import datetime

model = YOLO("D:/Coding/IBM/models/yolo_models/yolov8l.pt")
model = YOLO("D:/Coding/IBM/models/yolo_models/best.pt")


def safety_gear(video_source):
    cap = cv2.VideoCapture(video_source)

    while cap.isOpened():
        ret, frame = cap.read()
        results = model.predict(frame)
        counts = {}
        for result in results:
            boxes = result.boxes.cpu().numpy()
            for box in boxes:
                cls = int(box.cls[0])
                if not cls in counts.keys():
                    counts[cls] = 1
                else:
                    counts[cls] += 1
        print(counts)
        final = {}
        for key in counts.keys():
            final[model.names[key]] = counts[key]
        for vals in model.names.values():
            if vals not in final.keys():
                final[vals] = 0
        body = {
            "camera-id": "45fgQn7oYaLFaG8SFesT",
            "data": final,
            "timestamp": {
                "year": datetime.now().year,
                "month": datetime.now().month,
                "day": datetime.now().day,
                "hour": datetime.now().hour,
                "minute": datetime.now().minute,
                "second": datetime.now().second,
            },
        }
        r = requests.post("https://0f1c-103-185-11-79.ngrok-free.app/safetygear", json=body)
        time.sleep(1)

    cap.release()
