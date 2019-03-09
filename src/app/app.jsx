import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

const HelloWorld = () => {
  return (
    <div className='displaycontainer'>
      <div className='graph'>
        Hello World!
      </div>
    </div>
  )
};

const backendSocket = io();
const sensorSocket = new WebSocket('ws://130.82.239.210');

sensorSocket.onopen = function() {      
  console.log("sensor socket was opened");
};

sensorSocket.onmessage = function(evt) { 
  var received_msg = evt.data;
  console.log(`received message: ${received_msg}`);
  backendSocket.emit('raw data', received_msg);
};

ReactDOM.render(<HelloWorld />, document.getElementById('app'));