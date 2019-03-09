import websocket
import json

def on_message(ws, message):
    print(message)

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("### closed ###")

def on_open(ws):
    d = {
        "signals": [
            {
                "Name": "ESP_Laengsbeschl"
            }
        ],
    }
    ws.send(json.dumps(d))


if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("ws://130.82.239.210/ws",
                              on_message = on_message,
                              on_error = on_error,
                              on_close = on_close)
    ws.on_open = on_open
    ws.run_forever()