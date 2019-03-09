var WebSocket = require('ws');
const sensorSocket = new WebSocket('ws://130.82.239.210/ws');

sensorSocket.onopen = function() {
  console.log("sensor socket was opened");
  let a = JSON.stringify({
    signals: [
      {
        Name: "ESP_Laengsbeschl",
      },
      {
        Name: "ESP_Querbeschleinigung",
      },
    ],
    samplerate: 250,
    withtimestamp: true
  });
  console.log(a);
  sensorSocket.send(a);
};

sensorSocket.onmessage = (e) => {
  var received_msg = e.data;
  console.log(`received message: ${received_msg}`);
};

sensorSocket.onerror = (e) => {
  console.log("Socket error: " + e.data);
};

sensorSocket.onclose = (e) => {
  console.log("Socket close: ", e);
}