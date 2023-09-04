import cv2
from datetime import datetime
import time


def store_data(video_source):
    cap = cv2.VideoCapture(video_source)
    frame_num = 0
    while cap.isOpened():
        ret, frame = cap.read()
        cv2.imwrite(f"D:/Coding/IBM/images/{frame_num}.jpg", frame)
        frame_num += 1
