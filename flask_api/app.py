from flask import Flask, request, jsonify, Response
import json

# from flask_sockets import Sockets
from flask_socketio import SocketIO
from flask_caching import Cache
import datetime
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1 import FieldFilter
from flask_cors import CORS

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import numpy as np


config = {
    "DEBUG": True,  # some Flask specific configs
    "CACHE_TYPE": "filesystem",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 3000,
    "CACHE_DIR": Path("/tmp"),
    "CORS_HEADERS": "Content-Type",
}

cred = credentials.Certificate("ibm-safety-net-firebase-adminsdk.json")
firebase_app = firebase_admin.initialize_app(cred)
db = firestore.client()


app = Flask(__name__)
app.config.from_mapping(config)
CORS(app)
ws = SocketIO(app)
ws.init_app(app, cors_allowed_origins="*")
cache = Cache(app)

class Get_Data:
    def __init__(self, user_id, user_type):
        self.user_id = user_id
        self.user_type = user_type
    # monthly counts chaiye
    def sensor_data(self):
        ref = db.collection(self.user_type).document(self.user_id)
        data = ref.get().to_dict()
        if self.user_type == "managers":
            data_list = []
            d = {}
            l = []
            count = 0
            site_id = data["site_id"]
            data_ref = db.collection("sensor").where(filter = FieldFilter("site_id", "==", site_id)).get()
            for docs in data_ref:
                data_dict = {}
                readings = []
                time_str = []
                data = docs.to_dict()
                for i in data['data']:
                    readings.append(i['reading'])
                    time = datetime.datetime.fromtimestamp(i['timestamp'].timestamp())
                    time_str.append(time)
                    data_dict.update({"readings": readings, "timestamp": time_str})
                data_list.append(data_dict)
                for all in range(len(data_list)):
                    for item in range(len(data_list[all]["readings"])):
                        if data_list[all]['readings'][item] == True:
                            l.append(data_list[all]['timestamp'][item].month)
            l = np.array(l)
            un = np.unique(l)
            for ele in un:
                count = np.count_nonzero(l == ele)
                d[str(ele)] = count
            # print(d)
            return d
        # do for admin
        elif self.user_type == "admin":
            data_list = []
            l = []
            d = {}
            count = 0
            site_id = data["sites_id"]
            # print(site_id)
            for sites in site_id:
                data_ref = db.collection("sensor").where(filter = FieldFilter("site_id", "==", sites)).get()
                for docs in data_ref:
                    data_dict = {}
                    readings = []
                    time_str = []
                    data = docs.to_dict()
                    for i in data['data']:
                        readings.append(i['reading'])
                        time = datetime.datetime.fromtimestamp(i['timestamp'].timestamp())
                        time_str.append(time)
                        data_dict.update({"readings": readings, "timestamp": time_str})
                    data_list.append(data_dict)
                    for all in range(len(data_list)):
                        for item in range(len(data_list[all]["readings"])):
                            if data_list[all]['readings'][item] == True:
                                l.append(data_list[all]['timestamp'][item].month)
            l = np.array(l)
            un = np.unique(l)
            for ele in un:
                count = np.count_nonzero(l == ele)
                d[str(ele)] = count
            # print(d)
            return d
    
    # isme chaiye 1. safety score 2. camera_id se map karo safety score 3. time by time safety score ka graph for each camera 4. aggrgate safety score for each site
    def safety_gear_data(self):
        ref = db.collection(self.user_type).document(self.user_id)
        data = ref.get().to_dict()
        if self.user_type == "managers":
            data_list = []
            site_id = data["site_id"]
            avg = 0
            sc = 0
            data_ref = db.collection("safety-gear").where(filter = FieldFilter("site_id", "==", site_id)).get()
            for docs in data_ref:
                refer = db.collection("cameras").document(docs.id)
                camera_loc = refer.get().to_dict()['location']
                safety_score = []
                data_dict = {}
                score = 0
                for items in docs.to_dict()['data']:
                    score = (int(items['safety-vest'])+int(items['hard-hat'])+int(items['mask']))/(3*int(items['person']))
                    avg = avg + score
                    safety_score.append(score)
                for sc2 in safety_score:
                    sc = sc + sc2
                length = len(safety_score) if len(safety_score) != 0 else 1
                sc1 = sc/length
                data_dict.update({"location": camera_loc,"safety_score": round(sc1*100,2)})
                data_list.append(data_dict)
            avg = 0
            for dic in data_list:
                avg = avg + dic['safety_score']
            avg = avg/len(data_list)
            return [data_list,avg]
        # do for admin
        elif self.user_type == "admin":
            data_list = []
            site_id = data["sites_id"]
            for sites in site_id:
                avg = 0
                sc = 0
                sc3 = 0
                data_ref = db.collection("safety-gear").where(filter = FieldFilter("site_id", "==", sites)).get()
                for docs in data_ref:
                    # refer = db.collection("cameras").document(docs.id)
                    safety_score = []
                    data_dict = {}
                    score = 0
                    for items in docs.to_dict()['data']:
                        score = (int(items['safety-vest'])+int(items['hard-hat'])+int(items['mask']))/(3*int(items['person']))
                        avg = avg + score
                        safety_score.append(score)
                    for sc2 in safety_score:
                        sc = sc + sc2
                    length = len(safety_score) if len(safety_score) != 0 else 1
                    sc1 = sc/length
                    sc3 += sc1
                sc3 = sc3/len(data_ref)
                loc = db.collection("sites").document(sites).get().to_dict()['site_location']
                data_dict.update({"location": loc,"safety_score": round(sc3*100,2)})
                data_list.append(data_dict)
            avg = 0
            for dic in data_list:
                avg = avg + dic['safety_score']
            avgx = avg/len(data_list)
            # avg_dict = {"avg": avgx}
            return [data_list, avgx]

    def fire_stats(self):
        ref = db.collection(self.user_type).document(self.user_id)
        data = ref.get().to_dict()
        if self.user_type == "managers":
            l = []
            site_id = data["site_id"]
            duration_dict = {}
            data_ref = db.collection("fire-detection").where(filter = FieldFilter("site_id", "==", site_id)).get()
            for docs in data_ref:
                for ele in docs.to_dict()['data']:
                    time = datetime.datetime.fromtimestamp(ele['timestamp'].timestamp())
                    l.append(time.month)
            l = np.array(l)
            un = np.unique(l)
            for ele in un:
                count = np.count_nonzero(l == ele)
                duration_dict[str(ele)] = count
                # time_duration.append(duration)
            return duration_dict
        elif self.user_type == "admin":
            l = []
            site_id = data["sites_id"]
            duration_dict = {}
            for sites in site_id:
                data_ref = db.collection("fire-detection").where(filter = FieldFilter("site_id", "==", sites)).get()
                for docs in data_ref:
                    for ele in docs.to_dict()['data']:
                        time = datetime.datetime.fromtimestamp(ele['timestamp'].timestamp())
                        l.append(time.month)
            l = np.array(l)
            un = np.unique(l)
            for ele in un:
                count = np.count_nonzero(l == ele)
                duration_dict[str(ele)] = count
            return duration_dict
    
    def hand_gesture_data(self):
        ref = db.collection(self.user_type).document(self.user_id)
        data = ref.get().to_dict()
        duration_dict = {}
        if self.user_type == "managers":
            site_id = data["site_id"]
            data_ref = db.collection("hand-gesture").where(filter = FieldFilter("site_id", "==", site_id)).get()
            for docs in data_ref:
                time = datetime.datetime.fromtimestamp(docs.to_dict()['data'][-1]['timestamp'].timestamp())
                now = datetime.datetime.now()
                duration = (now - time).days
                # time_duration.append(duration)
                duration_dict[docs.id] = duration
            return duration_dict
        elif self.user_type == "admin":
            site_id = data["sites_id"]
            for sites in site_id:
                data_ref = db.collection("hand-gesture").where(filter = FieldFilter("site_id", "==", sites)).get()
                for docs in data_ref:
                    time = datetime.datetime.fromtimestamp(docs.to_dict()['data'][-1]['timestamp'].timestamp())
                    now = datetime.datetime.now()
                    duration = (now - time).days
                    duration_dict[docs.id] = duration
            return duration_dict
        

    def sensor_fire(self):
        sensor_data = self.sensor_data()
        fire_data = self.fire_stats()
        data_dict = {}
        keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        for key in keys:
            sens_acc = 0
            fire_acc = 0
            if key in sensor_data.keys() and key in fire_data.keys():
                fire_acc = fire_acc + fire_data[key]
                sens_acc = sens_acc + sensor_data[key]
                data_dict[str(key)] = {"sensor_accidents": sens_acc, "fire_accidents": fire_acc}
            elif key in sensor_data.keys():
                sens_acc = sens_acc + sensor_data[key]
                data_dict[str(key)] = {"sensor_accidents": sens_acc,"fire_accidents": fire_acc}
            elif key in fire_data.keys():
                fire_acc = fire_acc + fire_data[key]
                data_dict[str(key)] = {"sensor_accidents": sens_acc,"fire_accidents": fire_acc}
        return data_dict


def send_email(
    sender_email,
    sender_password,
    receiver_email,
    subject,
    message,
):
    # SMTP configuration for the email service
    smtp_host = "smtp.gmail.com"
    smtp_port = 587

    # Create a multipart message object
    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Subject"] = subject

    # Attach the message body
    msg.attach(MIMEText(message, "plain"))
    # Create an SMTP session and start TLS for security
    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()

    # Login to the email account
    server.login(sender_email, sender_password)

    # Send the email
    server.send_message(msg)

    # Terminate the SMTP session
    server.quit()


@ws.on("connect")
def connection():
    print("connected")


@ws.on("disconnect")
def disconnection():
    print("disconnected")


def send_alert(data):
    ws.emit(data)


@app.route("/getdata", methods=["GET"])
def get_data():
    output = {}
    try:
        user_id = request.args.get("user_id")
        user_type = request.args.get("user_type")

        ref = db.collection(user_type).document(user_id)

        data = ref.get().to_dict()

        if user_type == "managers":
            sites_ref = db.collection("sites").where(filter=firestore.FieldFilter("manager_id", "==", user_id))
            site = {}
            for sites in sites_ref.get():
                site.update(sites.to_dict())
                site.update({"site_id": sites.id})

            # output.update(
            #     {
            #         "site_id" : site["site_id"],
            #         "admin_id" : site["admin_id"],
            #         "org_id" : site["org_id"],
            #         "cameras" : site["cameras"],
            #         "sensors" : site["sensors"]
            #     }
            # )

            camera_ref = (
                db.collection("cameras").where(filter=firestore.FieldFilter("site_id", "==", site["site_id"])).get()
            )
            cam = []
            cam_ref = {}
            for camera in camera_ref:
                temp = camera.to_dict()
                cam_ref.update({camera.id: temp})
                temp.update({"camera_id": camera.id})
                cam.append(temp)

            output.update({"camera_data": cam})

            sensor_ref = (
                db.collection("sensor").where(filter=firestore.FieldFilter("site_id", "==", site["site_id"])).get()
            )
            sensor_data = []
            for sensor in sensor_ref:
                temp = sensor.to_dict()
                temp.pop("data")
                temp.update({"sensor_id": sensor.id})
                sensor_data.append(temp)

            output.update({"sensor_data": sensor_data})

            safety_gear_ref = db.collection("safety-gear").where(
                "site_id", "==", site["site_id"]
            )
            safety_gear_data = []
            for safety_gear in safety_gear_ref.get():
                temp = safety_gear.to_dict()
                temp_data = temp["data"]
                if temp_data != []:
                    temp_data = sorted(temp_data, key=lambda x: x["timestamp"])[-1]
                    temp.update({"timestamp": temp_data["timestamp"]})
                    temp_data.pop("timestamp")
                    temp.update({"data": temp_data})

                else:
                    continue
                temp.update({"camera_id": safety_gear.id})
                temp.update({"location": cam_ref[safety_gear.id]["location"]})
                safety_gear_data.append(temp)

            output.update({"safety_gear_data": safety_gear_data})

            fire_detection_ref = db.collection("fire-detection").where(
                filter=firestore.FieldFilter("site_id", "==", site["site_id"])
            )
            fire_detection_data = []
            for fire_detection in fire_detection_ref.get():
                temp = fire_detection.to_dict()
                temp_data = temp["data"]
                if temp_data != []:
                    temp_data = sorted(temp_data, key=lambda x: x["timestamp"])[-1]
                    temp.pop("data")
                    temp.update(
                        {
                            "timestamp": temp_data["timestamp"],
                            "video_link": temp_data["video_link"],
                        }
                    )
                else:
                    continue
                temp.update({"camera_id": fire_detection.id})
                temp.update({"location": cam_ref[safety_gear.id]["location"]})
                fire_detection_data.append(temp)

            output.update({"fire_detection_data": fire_detection_data})

            hand_gesture_ref = db.collection("hand-gesture").where(
                filter=firestore.FieldFilter("site_id", "==", site["site_id"])
            )
            hand_gesture_data = []
            for hand_gesture in hand_gesture_ref.get():
                temp = hand_gesture.to_dict()
                temp_data = temp["data"]
                if temp_data != []:
                    temp_data = sorted(temp_data, key=lambda x: x["timestamp"])[-1]
                    temp.pop("data")
                    temp.update(
                        {
                            "timestamp": temp_data["timestamp"],
                            "video_link": temp_data["video_link"],
                        }
                    )
                else:
                    continue
                temp.update({"camera_id": hand_gesture.id})
                temp.update({"location": cam_ref[safety_gear.id]["location"]})
                hand_gesture_data.append(temp)

            output.update({"hand_gesture_data": hand_gesture_data})

        elif user_type == "admin":


            sites_ref = db.collection("sites").where(filter=firestore.FieldFilter("admin_id", "==", user_id))
            sites = []
            site_ids = {}
            for site in sites_ref.get():
                temp = site.to_dict()
                temp.update({"site_id": site.id})
                site_ids.update({site.id: temp})
                sites.append(temp)

            output.update({"sites": sites})

            managers_ref = db.collection("managers").where(filter=firestore.FieldFilter("admin_id", "==", user_id))
            managers = []
            for manager in managers_ref.get():
                temp = manager.to_dict()
                temp.update({"manager_id": manager.id})
                managers.append(temp)

            output.update({"managers": managers})

            cameras_ref = db.collection("cameras").where(
               filter=firestore.FieldFilter("site_id", "in", list(site_ids.keys()))
            )
            cam = []
            cam_ref = {}
            for camera in cameras_ref.get():
                temp = camera.to_dict()
                cam_ref.update({camera.id: temp})
                temp.update({"camera_id": camera.id})
                temp["location"] = f"{site_ids[temp['site_id']]['site_location']}, {temp['location']}"
                cam.append(temp)

            output.update({"camera_data": cam})

            sensor_ref = db.collection("sensor").where(
                filter=firestore.FieldFilter("site_id", "in", list(site_ids.keys()))
            )
            sensor_data = []
            for sensor in sensor_ref.get():
                temp = sensor.to_dict()
                temp.pop("data")
                temp.update({"sensor_id": sensor.id})
                temp["location"] = f"{site_ids[temp['site_id']]['site_location']}, {temp['location']}"
                sensor_data.append(temp)

            output.update({"sensor_data": sensor_data})

            safety_gear_ref = db.collection("safety-gear").where(
                filter=firestore.FieldFilter("site_id", "in", list(site_ids.keys()))
            )
            safety_gear_data = []
            for safety_gear in safety_gear_ref.get():
                temp = safety_gear.to_dict()
                temp_data = temp["data"]
                if temp_data != []:
                    temp_data = sorted(temp_data, key=lambda x: x["timestamp"])[-1]
                    temp.update({"timestamp": temp_data["timestamp"]})
                    temp_data.pop("timestamp")
                    temp.update({"data": temp_data})

                else:
                    continue
                temp.update({"camera_id": safety_gear.id})
                # temp.update({"location": cam_ref[safety_gear.id]["location"]})
                temp["location"] = cam_ref[safety_gear.id]['location']

                safety_gear_data.append(temp)

            output.update({"safety_gear_data": safety_gear_data})

            fire_detection_ref = db.collection("fire-detection").where(
                filter=firestore.FieldFilter("site_id", "in", list(site_ids.keys()))
            )
            fire_detection_data = []
            for fire_detection in fire_detection_ref.get():
                temp = fire_detection.to_dict()
                temp_data = temp["data"]
                if temp_data != []:
                    temp_data = sorted(temp_data, key=lambda x: x["timestamp"])[-1]
                    temp.pop("data")
                    temp.update(
                        {
                            "timestamp": temp_data["timestamp"],
                            "video_link": temp_data["video_link"],
                        }
                    )
                else:
                    continue
                temp.update({"camera_id": fire_detection.id})
                temp["location"] = cam_ref[safety_gear.id]['location']
                fire_detection_data.append(temp)

            output.update({"fire_detection_data": fire_detection_data})

            hand_gesture_ref = db.collection("hand-gesture").where(
                filter=firestore.FieldFilter("site_id", "in", list(site_ids.keys()))
            )
            hand_gesture_data = []
            for hand_gesture in hand_gesture_ref.get():
                temp = hand_gesture.to_dict()
                temp_data = temp["data"]
                if temp_data != []:
                    temp_data = sorted(temp_data, key=lambda x: x["timestamp"])[-1]
                    temp.pop("data")
                    temp.update(
                        {
                            "timestamp": temp_data["timestamp"],
                            "video_link": temp_data["video_link"],
                        }
                    )
                else:
                    continue
                temp.update({"camera_id": hand_gesture.id})
                
                temp["location"] = cam_ref[safety_gear.id]['location']
                hand_gesture_data.append(temp)

            output.update({"hand_gesture_data": hand_gesture_data})
        output.update({"status": "success"})
        return jsonify(output)

    except Exception as e:
        return jsonify({"status": str(e)}), 500


@app.route("/safetygear", methods=["POST"])
def safety_gear():
    # timestamp-{}, camera-id-string, data-{}
    try:
        data = request.json
        print(data)
        camera_id = data["camera-id"]
        timestamp = data["timestamp"]
        info = data["data"]
        print(info)
        timestamp_obj = get_timestamp_obj(timestamp)
        temp = {
            "hard-hat": info["Hardhat"],
            "no-hard-hat": info["NO-Hardhat"],
            "mask": info["Mask"],
            "no-mask": info["NO-Mask"],
            "safety-vest": info["Safety Vest"],
            "no-safety-vest": info["NO-Safety Vest"],
            "person": info["Person"],
            "timestamp": timestamp_obj,
        }

        doc_ref = db.collection("safety-gear").document(camera_id)
        doc_ref.update({"data": firestore.ArrayUnion([temp])})

        return jsonify({"status": "success"})

    except Exception as e:
        return jsonify({"status": f"error {str(e)}"}), 500


@app.route("/handgesture", methods=["POST"])
def hand_gesture():
    # timestamp-{},video-link-string, camera-id-string
    global global_data
    try:
        data = request.json
        camera_id = data["camera_id"]
        timestamp = data["timestamp"]
        video_link = data["video_link"]

        timestamp_obj = get_timestamp_obj(timestamp)

        doc_ref = db.collection("hand-gesture").document(camera_id)
        doc_ref.update(
            {
                "data": firestore.ArrayUnion(
                    [{"timestamp": timestamp_obj, "video_link": video_link}]
                )
            }
        )

        camera_ref = db.collection("cameras").document(camera_id)
        camera_data = camera_ref.get().to_dict()

        data.update({"location": camera_data["location"]})

        data.update({"type": "hand-gesture"})
        data.update({"timestamp": timestamp_obj.strftime("%d/%m/%Y %H:%M:%S")})

        ws.emit("notification", data)
        send_email(sender_email='coc55228@gmail.com',sender_password='jpdtwuyrdvdovban',receiver_email='divija.kinger@somaiya.edu',subject='Person in Danger!',message=f'A person is in danger at location {camera_data["location"]}. Please check the video at {video_link}')

        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": f"error {str(e)}"}), 500


@app.route("/firealert", methods=["POST"])
def fire_alert():
    # timestamp-{},video-link-string, camera-id-string
    try:
        data = request.json
        camera_id = data["camera_id"]
        timestamp = data["timestamp"]
        video_link = data["video_link"]

        timestamp_obj = get_timestamp_obj(timestamp)

        doc_ref = db.collection("fire-detection").document(camera_id)
        doc_ref.update(
            {
                "data": firestore.ArrayUnion(
                    [{"timestamp": timestamp_obj, "video_link": video_link}]
                )
            }
        )

        camera_ref = db.collection("cameras").document(camera_id)
        camera_data = camera_ref.get().to_dict()

        data.update({"location": camera_data["location"]})

        data.update({"type": "fire"})
        data.update({"timestamp": timestamp_obj.strftime("%d/%m/%Y %H:%M:%S")})

        ws.emit("notification", data)
        send_email(sender_email='coc55228@gmail.com',sender_password='jpdtwuyrdvdovban',receiver_email='divija.kinger@somaiya.edu',subject='Fire Alert!',message=f'There is a fire at location {camera_data["location"]}. Please check the video at {video_link}')

        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": f"error {str(e)}"}), 500


@app.route("/sensor", methods=["POST"])
def read_sensor():
    # sensor-id-string, reading-bool, timestamp-{}
    try:
        data = request.json
        doc_id = data["sensor-id"]
        reading = data["reading"]
        timestamp = data["timestamp"]
        timestamp_obj = get_timestamp_obj(timestamp)
        doc_ref = db.collection("sensor").document(doc_id)
        doc_ref.update(
            {
                "data": firestore.ArrayUnion(
                    [{"timestamp": timestamp_obj, "reading": reading}]
                )
            }
        )
        if reading == True:
            if cache.get("sensor-cache") == None:
                cache.set("sensor-cache", 1)
            else:
                if cache.get("sensor-cache") >= 5:
                    sensor_ref = db.collection("sensor").document(doc_id)
                    sensor_data = sensor_ref.get().to_dict()

                    data.update({"location": sensor_data["location"]})
                    data["type"] = "sensor"
                    data.update(
                        {"timestamp": timestamp_obj.strftime("%d/%m/%Y %H:%M:%S")}
                    )

                    ws.emit("notification", data)
                    send_email(sender_email='coc55228@gmail.com',sender_password='jpdtwuyrdvdovban',receiver_email='divija.kinger@somaiya.edu',subject='Gas Leak!',message=f'Gas leak at location {sensor_data["location"]}')
                    cache.set("sensor-cache", 0)
                cache.set("sensor-cache", cache.get("sensor-cache") + 1)
        else:
            cache.set("sensor-cache", 0)

        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": f"error {str(e)}"}), 500


def get_timestamp_obj(timestamp):
    return datetime.datetime(
        timestamp["year"],
        timestamp["month"],
        timestamp["day"],
        timestamp["hour"],
        timestamp["minute"],
        timestamp["second"],
        0,
        tzinfo=datetime.timezone(datetime.timedelta(hours=5, minutes=30), "IST"),
    )

@app.route("/getstats", methods=["GET"])
def statistics():
    user_id = request.args.get("user_id")
    user_type = request.args.get("user_type")
    data = Get_Data(user_id, user_type)
    sensor_data = data.sensor_data()
    safety_gear_data,avg_data = data.safety_gear_data()
    fire_data = data.fire_stats()
    hand_gesture_data = data.hand_gesture_data()
    sensor_fire_data = data.sensor_fire()

    return jsonify({ "safety_gear_data": safety_gear_data, "sensor_fire_data": sensor_fire_data,'safety_avg_data':avg_data})


@app.route("/")
def hello():
    return "Hello World!"


if __name__ == "__main__":
    ws.run(app, debug=True)
    # app.run()
