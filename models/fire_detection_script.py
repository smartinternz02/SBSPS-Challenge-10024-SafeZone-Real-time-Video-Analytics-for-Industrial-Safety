from PIL import Image
import torch

from transformers import AutoFeatureExtractor, AutoModelForImageClassification
import cv2
from datetime import datetime, timedelta
import time
import requests

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

preprocess = transforms.Compose(
    [
        transforms.ToPILImage(),
        transforms.Resize((224, 224)),  # Resize the image to match model's input size
        transforms.ToTensor(),  # Convert the image to a PyTorch tensor
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]
        ),  # Normalize the image
    ]
)

alert_count = 0


def predict_image(frame_num):
    extractor = AutoFeatureExtractor.from_pretrained("EdBianchi/vit-fire-detection")
    model = AutoModelForImageClassification.from_pretrained("EdBianchi/vit-fire-detection")

    model.eval()
    # input_image = Image.open("C:/Users/shiva/Downloads/download.jpeg")
    input_tensor = preprocess(frame_num)
    input_batch = input_tensor.unsqueeze(0)
    with torch.no_grad():
        output = model(input_batch)

    output_list = output[0].tolist()[0]
    labels = ["Fire", "Nothing", "Smoke"]
    final_probabilities = []
    for i in output_list:
        ex = math.exp(i)
        final = ex / (1 + ex)
        final_probabilities.append(final)

    label_index = final_probabilities.index(max(final_probabilities))
    return labels[label_index]


def predict_image_func(video_source):
    frames = []
    alert_count = 0
    video_count = 0
    curr_frame = 0
    cap = cv2.VideoCapture(video_source)
    while cap.isOpened():
        ret, frame = cap.read()

        label = predict_image(frame)
        if label == "Fire":
            alert_count += 1
        else:
            alert_count = 0
        if alert_count == 20:
            print("Fire detected")
            for i in range(21, 1, -1):
                frames.append(cv2.imread("D:/Coding/IBM/images/" + str(curr_frame - i) + ".jpg"))
            frame_height, frame_width, _ = frames[0].shape
            output_filename = f"D:/Coding/IBM/alert_fire/alert_{video_count}.mp4"
            fourcc = cv2.VideoWriter_fourcc(*"avc1")
            fps = 5
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
                "video_link": f"https://ibmhacktesting1-donotdelete-pr-stnyxpwdejeura.s3.jp-tok.cloud-object-storage.appdomain.cloud/fire_alert_{video_count}.mp4",
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
                "https://0f1c-103-185-11-79.ngrok-free.app/firealert",
                json=final_data,
            )
            print(r.text)
            video_count += 1
            frames = []
            alert_count = 0
            exit()
        curr_frame += 1

    cap.release()
