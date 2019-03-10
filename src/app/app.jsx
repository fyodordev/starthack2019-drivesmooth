import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import Chart from 'chart.js';


// Set these "goal values" to reasonable defaults or compute dynamically.
const accelLimit = 2.75;
const jerkLimit = 0.4;

const SCORE_THRESHOLD = 50;
const SCORE_10_BENCHMARK = 200;
const SCORE_WINDOW = 10*60*1000;

/**
 * Assume inner circle is 30% size
 * @param accel Vector array
 * @param jerk Vector array
 * @return Vector array values between -50 and 50
 */
function dataToPos(accel, jerk) {
  const val = (v) => Math.sqrt(v[0]**2 + v[1]**2);
  const accelVal = val(accel);
  if (accelVal <= 0.00001) return [...jerk];
  const jerkVal = val(jerk);
  const norm = [accel[0] / accelVal, accel[1] / accelVal];
  const finalVal = Math.max(accelVal * 50/accelLimit, jerkVal * 50/jerkLimit);
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
      pos: [0, 0],
      smoothpos: [0, 0],
      score: 100,
      scoreSum: 0,
      scores: [],
    }
    this.dataIndex = 0;
  }

  componentDidMount() {
    /*window.addEventListener('mousemove', this.onMouseMove = ((e) => {
      const acceleration = [e.clientX - window.innerWidth / 2, e.clientY - window.innerHeight / 2];
      this.setState({
        accel: acceleration,
      });
    }));*/

    /*window.setTimestamp = (timestamp) => {
      this.timestamp = timestamp;
      this.dataIndex = 0;
    };

    window.setSpeed = (speed) => {
      this.speed = speed;
    };*/

    /*this.updateInterval = setInterval(() => {
      const now = window.performance.now();
      this.timestamp += (now - this.lastTimeFetch) * this.speed;
      this.lastTimeFetch = now;
      let accel = undefined;
      while (true) {
        if (this.dataIndex >= this.props.data.length) break;
        if (this.props.data[this.dataIndex][0] <= this.timestamp) {
          accel = [this.props.data[this.dataIndex][1], this.props.data[this.dataIndex][2]];
          this.dataIndex++;
        } else {
          break;
        }
      }
      if (accel) {
        console.log((a => `${Math.floor(a/60)}:${Math.floor(a%60)}`)(this.props.data[this.dataIndex][0]/1000), this.props.data[this.dataIndex], accel);
        this.setState({
          accel: accel,
        });
      }
    }, 10);*/

    this.update_scores_array = (new_score) => {
      let acc = 0;
      for (let idx=0; idx<this.state.scores.length; ++idx) {
        if (this.state.scores[idx][0] < new_score[0]-SCORE_WINDOW) {
          acc += this.state.scores[idx][1];
          this.state.scores.pop(idx--);
        } else {
          break;
        }
      }
      this.state.scores.push(new_score);
      this.update_score(acc, Math.max(new_score[1]-SCORE_THRESHOLD,0));
    }
    
    this.update_score = (removed, addition) => {
      console.log(this.state.scoreSum);
      if (this.state.scoreSum > 0) {
        this.setState({
          scoreSum: this.state.scoreSum + addition - removed,
          score: 100 * Math.pow(10, -this.state.scoreSum / SCORE_10_BENCHMARK)
        });
      } else {
        this.setState({
          scoreSum: this.state.scoreSum + addition - removed,
          score: 100
        });
      }
    }

    /*this.jerkInterval = setInterval(() => {
      this.setState({
        accel: [this.props.data[0], this.props.data[1]]
      });
      const lmp = this.lastAccel || [0, 0];
      const cmp = this.state.accel || [0, 0];
      const njerk = [cmp[0] - lmp[0], cmp[1] - lmp[1]];
      const pos = dataToPos(cmp, njerk);
      this.setState({
        jerk: njerk,
        smoothjerk: [0, 0.8 * this.state.smoothjerk[1] + 0.2 * Math.sqrt(njerk.map(a => a**2).reduce((a, b) => a+b))],
        dampedaccel: [this.state.dampedaccel[0] * 0.9 + njerk[0], this.state.dampedaccel[1] * 0.9 + njerk[1]],
        pos: pos,
        smoothpos: [this.state.smoothpos[0] * 0.8 + 0.2 * pos[0], this.state.smoothpos[1] * 0.8 + 0.2 * pos[1]],
      });
      this.lastAccel = cmp;
    }, 100);*/
  }

  componentWillUnmount() {
    /*window.removeEventListener('mousemove', this.onMouseMove);*/
    //clearInterval(this.jerkInterval);
    //clearInterval(this.updateInterval);
  }

  //How state should be updated.
  updateState(accel, jerk, now) {
    let pos = dataToPos(accel, jerk);

    this.setState((prevState) => {
      return {
        accel: accel,
        jerk: jerk,
        pos: pos,
        smoothpos: [0.8 * prevState.smoothpos[0] + 0.2 * pos[0], 0.8 * prevState.smoothpos[1] + 0.2 * pos[1]],
        time: now,
        prevTime: prevState.time,
      }
    });

    this.update_scores_array([now, Math.sqrt(this.state.smoothpos[0]**2 + this.state.smoothpos[1]**2)]);
  }
  
  render() {
    const accel = this.state.accel;
    const jerk = this.state.jerk;
    const smoothjerk = this.state.smoothjerk;
    const dampedaccel = this.state.dampedaccel;
    const pos = this.state.pos;
    const smoothpos = this.state.smoothpos;
    const isDangerous = smoothpos.map(a => a**2).reduce((a, b) => a+b) >= (50)**2;
    return (
      <div className={'displaycontainer' + (isDangerous ? ' dangerous' : '')}>
        <div className='graph'>
          <div className='graph-inner'>
            <div className="graph-dot blue" style={{top: `${-jerk[1]*50/jerkLimit}%`, left: `${jerk[0]*50/jerkLimit}%`}}></div>
            <div className="graph-dot green" style={{top: `${-smoothjerk[1]*50/jerkLimit}%`, left: `${smoothjerk[0]*50/jerkLimit}%`}}></div>
            <div className="graph-dot purple" style={{top: `${-dampedaccel[1]*50/accelLimit}%`, left: `${dampedaccel[0]*50/accelLimit}%`}}></div>
            <div className="graph-dot black" style={{top: `${-accel[1]*50/accelLimit}%`, left: `${accel[0]*50/accelLimit}%`}}></div>
            <div className="graph-dot red" style={{top: `${-pos[1]}%`, left: `${pos[0]}%`}}></div>
            <div className="graph-dot orange" style={{top: `${-smoothpos[1]}%`, left: `${smoothpos[0]}%`}}></div>
            <div className="graph-line horizontal"></div>
            <div className="graph-line vertical"></div>
            <div className="graph-circle"></div>
          </div>
        </div>
          <div className='scoreContainer'>
            <div className='scoreProgress' style={{height: `${this.state.score}%`}}></div>
            <div className='scoreTextContainer'>
              <div className='scoreValue'>{Math.round(this.state.score)}</div>
              <div className='scoreLabel'>Driving <br />smoothness</div>
            </div>
          </div>
      </div>
    )
  }
}


let mainRef = React.createRef();

ReactDOM.render(<Main ref={mainRef}/>, document.getElementById('app'));



let lastAccel = [0, 0];

const backendSocket = io();

let ct = -1;
let cx = 0;
let cy = 0;

backendSocket.on('data', (msg) => {
  const parsed = JSON.parse(msg);
  const t = parsed["samples"]["ESP_Querbeschleunigung"]["utc"];
  const x = parsed["samples"]["ESP_Querbeschleunigung"]["value"];
  const y = parsed["samples"]["ESP_Laengsbeschl"]["value"];
  if (t >= ct) {
    ct = t;
    cx = x;
    cy = y;
  }
});

setInterval(() => {
  mainRef.current.updateState([cx, cy], [cx - lastAccel[0], cy - lastAccel[1]], ct / 1000000);
  lastAccel = [cx, cy];
}, 50);

backendSocket.on('user id', (msg) => {
  console.log(`your user id: ${msg}`);
});


/*const sensorSocket = new WebSocket('ws://130.82.239.210/ws');

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
  backendSocket.emit('raw data', received_msg);
};

sensorSocket.onerror = (e) => {
  console.log("Socket error: " + e.data);
};

sensorSocket.onclose = (e) => {
  console.log("Socket close: ", e);
}*/


new Chart(document.getElementById("score-chart"), {
  type: 'line',
  data: {
    labels: ['', '', '', '', '', '', '', '', '', ''],
    datasets: [
      { 
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        label: "yo",
        borderColor: "red",
        fill: false
      },
    ]
  },
  options: {
    title: {
      display: false,
    }
  }
});


