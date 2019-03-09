import paho.mqtt.client as mqtt

SIMULATION_IP = "82.165.25.152"
SIMULATION_PORT = 1884
CAR_IP = "82.165.25.152"
CAR_PORT = 1883

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("/signal/#")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))


client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(SIMULATION_IP, SIMULATION_PORT, 60)
# client.connect(CAR_IP, CAR_PORT, 60)

client.loop_forever()