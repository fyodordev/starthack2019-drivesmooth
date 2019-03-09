import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';



// Set these "goal values" to reasonable defaults or compute dynamically.
const accelLimit = 50;
const jerkLimit = 150;
const allIntervalData = [];
const saveInterval = 10; // In minutes

/**
 * Assume inner circle is 30% size
 * @param accel Vector array
 * @param jerk Vector array
 * @return Vector array values between -50 and 50
 */
function dataToPos(accel, jerk) {
  const val = (v) => Math.sqrt(v[0]**2 + v[1]**2);
  const accelVal = val(accel);
  const jerkVal = val(jerk);
  const norm = [accel[0] / accelVal, accel[1] / accelVal];
  const finalVal = Math.max(accelVal * 50 / accelLimit, jerkVal * 50 / jerkLimit);
  return [finalVal * norm[0], finalVal * norm[1]];
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accel: [0, 0],
      jerk: [0, 0],
      smoothjerk: [0, 0],
      dampedaccel: [0, 0],
      score: 100,
      totalScore: 100,
    };
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.onMouseMove = ((e) => {
      const acceleration = [e.clientX - window.innerWidth / 2, e.clientY - window.innerHeight / 2];
      this.setState({
        accel: acceleration,
      });
    }));

    this.jerkInterval = setInterval(() => {
      const lmp = this.lastAccel || [0, 0];
      const cmp = this.state.accel || [0, 0];
      const njerk = [cmp[0] - lmp[0], cmp[1] - lmp[1]];
      this.setState({
        jerk: njerk,
        smoothjerk: [this.state.smoothjerk[0] * 0.8 + njerk[0] * 0.2, this.state.smoothjerk[1] * 0.8 + njerk[1] * 0.2],
        dampedaccel: [this.state.dampedaccel[0] * 0.8 + njerk[0], this.state.dampedaccel[1] * 0.8 + njerk[1]]
      });
      this.lastAccel = cmp;
    }, 50);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
    clearInterval(this.jerkInterval);
  }

  //How state should be updated.
  updateState(accel, jerk) {
    const now = Date.now();
    while (now - allInterval[0].time > saveInterval * 60000) {
      allIntervalData.shift();
    }
    allIntervalData.push({time: now, accel, jerk});

    this.setState((prevState) => {
      
      
      return {
      accel: accel,
      jerk: jerk,
      pos: dataToPos(accel, jerk),
      currentDangerVal: Math.min(Math.max(Math.sqrt((pos.map(a => a**2).reduce((a, b) => a+b)) - 50) / endDangerRangeRatio * 50, 1), 0),
      previousDangerVal: prevState.currentDangerVal,
      time: now,
      prevTime: prevState.time,
      scoreSum,
      score: 
      totalScore: (score < totalScore ? score : )
    }});
  }

  // Returns new score based on data point.
  addScore(prevscore, data) {
    return 
  }

  removeScore(prevscore, data) {
    return 
  }

  render() {
    const accel = this.state.accel;
    const jerk = this.state.jerk;
    const smoothjerk = this.state.smoothjerk;
    const dampedaccel = this.state.dampedaccel;
    //const pos = dataToPos(accel, jerk);
    // const currentDangerVal = Math.min(Math.max(Math.sqrt((pos.map(a => a**2).reduce((a, b) => a+b)) - 50) / endDangerRangeRatio * 50, 1), 0);
    const isDangerous = pos.map(a => a**2).reduce((a, b) => a+b) >= 50**2;
    const isWarn = pos.map(a => a**2).reduce((a, b) => a+b) >= 45**2;
    const endDangerRangeRatio = 0.5;
    const decay = 0.5;
    const updateDangerVal = 
    return (
      <div className={'displaycontainer' + (isDangerous ? ' dangerous' : '')}>
        <div className='graph'>
          <div className='graph-inner'>
            <div className="graph-dot black" style={{top: `${accel[1]}%`, left: `${accel[0]}%`}}></div>
            <div className="graph-dot red" style={{top: `${pos[1]}%`, left: `${pos[0]}%`}}></div>
            <div className="graph-dot blue" style={{top: `${jerk[1]}%`, left: `${jerk[0]}%`}}></div>
            <div className="graph-dot green" style={{top: `${smoothjerk[1]}%`, left: `${smoothjerk[0]}%`}}></div>
            <div className="graph-dot purple" style={{top: `${dampedaccel[1]}%`, left: `${dampedaccel[0]}%`}}></div>
            <div className="graph-line horizontal"></div>
            <div className="graph-line vertical"></div>
            <div className="graph-circle"></div>
          </div>
        </div>
      </div>
    )
  }
};

const backendSocket = io();
const sensorSocket = new WebSocket('ws://130.82.239.210/ws');

sensorSocket.onopen = function() {
  console.log("sensor socket was opened");
  sensorSocket.send(JSON.stringify({
    signals: ["speed", "acceleration", "steering_wheel_angle"],
    samplerate: 250,
    withtimestamp: true
  }));
};

sensorSocket.onmessage = (e) => { 
  var received_msg = e.data;
  console.log(`received message: ${received_msg}`);
  backendSocket.emit('raw data', received_msg);
};

sensorSocket.onerror = (e) => {
  console.log("Socket error: " + e.data);
};

sensorSocket.onclose = (e) => {
  console.log("Socket close: ", e);
}

ReactDOM.render(<Main/>, document.getElementById('app'));