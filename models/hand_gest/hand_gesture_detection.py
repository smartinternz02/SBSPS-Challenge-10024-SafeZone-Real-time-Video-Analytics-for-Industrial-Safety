# TechVidvan hand Gesture Recognizer

# import necessary packages

import cv2
import numpy as np
import mediapipe as mp
import tensorflow as tf
from keras.models import load_model
import requests
from datetime import datetime

import math
import torchvision.transforms as transforms
import ibm_boto3
from ibm_botocore.client import Config, ClientError

# NVVpHf46mQjkZObILVTUGuivEZSZI-JXyAbwhYG4FxtX
credentials = {
    "apikey": "P45M-20jSEkgxscQ5UpjIxbPgTdeHiocXeKG0vxY53af",
    "iam_endpoint": "https://iam.cloud.ibm.com/v1/",
    "auth_endpoint": "https://iam.cloud.ibm.com/v1/auth/token",
    "region": "jp-tok",
    "bucket": "ibmhacktesting1-donotdelete-pr-stnyxpwdejeura",
    "cos_hmac_keys": {
        "access_key_id": "bb1ac4d5f5f94e2982405d998dad104a",
        "secret_access_key": "e6e0c3da8237c3a86e228793a71483c8ec1bb8dcd533102d",
    },
}

# Create a Boto3 client object
cos = ibm_boto3.client(
    "s3",
    ibm_api_key_id=credentials["apikey"],
    ibm_service_instance_id="crn:v1:bluemix:public:cloud-object-storage:global:a/b0e7ae71a09c4e21b9a969e3570a3928:5c7f5575-2ad2-4adc-a509-0b1103eb6fe9::",
    endpoint_url="https://s3.{}.cloud-object-storage.appdomain.cloud".format(
        credentials["region"]
    ),
    config=Config(signature_version="oauth"),
    aws_access_key_id=credentials["cos_hmac_keys"]["access_key_id"],
    aws_secret_access_key=credentials["cos_hmac_keys"]["secret_access_key"],
)



def detect_gesture(video_source):
    mpHands = mp.solutions.hands
    hands = mpHands.Hands(max_num_hands=1, min_detection_confidence=0.7)
    mpDraw = mp.solutions.drawing_utils

    model = load_model("D:/Coding/IBM/models/hand_gest/mp_hand_gesture")

    f = open("D:/Coding/IBM/models/hand_gest/gesture.names", "r")
    classNames = f.read().split("\n")
    f.close()
    cap = cv2.VideoCapture(video_source)
    gesture_count = 0
    video_count = 0
    curr_frame = 0
    frames = []
    while cap.isOpened():
        _, frame = cap.read()

        x, y, c = frame.shape

        frame = cv2.flip(frame, 1)
        framergb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        result = hands.process(framergb)

        className = ""

        if result.multi_hand_landmarks:
            landmarks = []
            for handslms in result.multi_hand_landmarks:
                for lm in handslms.landmark:
                    lmx = int(lm.x * x)
                    lmy = int(lm.y * y)

                    landmarks.append([lmx, lmy])

                mpDraw.draw_landmarks(frame, handslms, mpHands.HAND_CONNECTIONS)

            prediction = model.predict([landmarks])
            classID = np.argmax(prediction)
            className = classNames[classID]
            if className == "call me":
                gesture_count += 1
            else:
                gesture_count = 0
            if gesture_count == 60:
                print("Danger detected")
                for i in range(101, 1, -1):
                    frames.append(cv2.imread("D:/Coding/IBM/images/" + str(curr_frame - i) + ".jpg"))
                frame_height, frame_width, _ = frames[0].shape
                output_filename = f"D:/Coding/IBM/alert_danger/alert_{video_count}.mp4"
                fourcc = cv2.VideoWriter_fourcc(*"avc1")
                fps = 30
                out = cv2.VideoWriter(
                    output_filename, fourcc, fps, (frame_width, frame_height)
                )
                for frame in frames:
                    out.write(frame)
                out.release()

                with open(f"D:/Coding/IBM/alert_fire/alert_{video_count}.mp4", "rb") as f:
                    cos.upload_fileobj(
                        f,
                        credentials["bucket"],
                        f"fire_alert_{video_count}.mp4",
                    )
                final_data = {
                    "camera_id": "45fgQn7oYaLFaG8SFesT",
                    "video_link": f"https://ibmhacktesting1-donotdelete-pr-stnyxpwdejeura.s3.jp-tok.cloud-object-storage.appdomain.cloud/danger_alert_{video_count}.mp4",
                    "timestamp": {
                        "year": datetime.now().year,
                        "month": datetime.now().month,
                        "day": datetime.now().day,
                        "hour": datetime.now().hour,
                        "minute": datetime.now().minute,
                        "second": datetime.now().second,
                    },
                }
                r = requests.post(
                    "https://2330-103-48-101-39.ngrok-free.app/handgesture",
                    json=final_data,
                )
                video_count += 1
                frames = []
                break
        curr_frame += 1

    cap.release()
