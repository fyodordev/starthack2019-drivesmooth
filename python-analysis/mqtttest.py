import paho.mqtt.client as mqtt
import json
import os
import datetime

SIMULATION_IP = "82.165.25.152"
SIMULATION_PORT = 1884
CAR_IP = "82.165.25.152"
CAR_PORT = 1883
ON_SIMULATION = False


starttime = datetime.datetime.now()
rootfolder = starttime.strftime("%y%m%d-%H%M%S") + "_" + ("SIM" if ON_SIMULATION else "CAR")
os.makedirs(rootfolder)


# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("/signal/ESP_Laengsbeschl")
    client.subscribe("/signal/ESP_Querbeschleunigung")
    client.subscribe("/signal/ESP_VL_Radgeschw_02")
    client.subscribe("/signal/ESP_VR_Radgeschw_02")
    client.subscribe("/signal/ESP_HL_Radgeschw_02")
    client.subscribe("/signal/ESP_HR_Radgeschw_02")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    data = json.loads(msg.payload)
    filename = msg.topic[msg.topic.rfind("/")+1:] + ".csv"
    with open(os.path.join(rootfolder, filename), "a") as f:
        f.write(str(data['utc']) + "," + str(data['value']) + "\n")

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

if ON_SIMULATION:
    client.connect(SIMULATION_IP, SIMULATION_PORT, 60)
else:
    client.connect(CAR_IP, CAR_PORT, 60)

client.loop_forever()