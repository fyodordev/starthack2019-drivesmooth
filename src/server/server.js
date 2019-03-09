import '../common/tweaks.js';

import Koa from 'koa';
import Router from 'koa-router';
import path from 'path';
import serve from 'koa-static';
import views from 'koa-views';
import http from 'http';
import socket from 'socket.io';
import fs from 'fs';
import crypto from 'crypto';
import WebSocket from 'ws';

const app = new Koa();
const router = new Router();

const veryReliableUserDatabase = {};


app.use(views(path.join(__dirname, '../public')));

router.get('/', async (ctx, next) => {
  await ctx.render('index');
  console.log('this is a test');
})

app.use(serve(path.join(__dirname, '../public')));

app.use(router.routes());

router.get('/users', async (ctx, next) => {
  const userid = ctx.request.body;
  await ctx.render(JSON.stringify(veryReliableUserDatabase[userid]));
  next();
});

async function readFile(filename) {
  return await new Promise((accept) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
          reject(err);
      }
      accept(data);
    });
  });
}

async function loadData() {
  const yFileContent = await readFile('./data/ESP_Laengsbeschl.csv');
  const xFileContent = await readFile('./data/ESP_Querbeschleunigung.csv');
  const dfunc = (c) => c.split('\n').map(a => ((b => [Math.round(parseInt(b[0]) / 1000000), parseFloat(b[1])])(a.split(',')))).filter((d, i, c) => i === 0 || c[i-1][1] !== d[1]);
  const xParsed = dfunc(xFileContent).map(a => [a[0], 7 * a[1], a[2]]);
  const yParsed = dfunc(yFileContent);
  const res = [[0, xParsed[0][1], yParsed[0][1]]];
  const timestart = Math.max(xParsed[0][0], yParsed[0][0]);
  let i = xParsed.findIndex(a => a[0] > timestart);
  let j = yParsed.findIndex(a => a[0] > timestart);
  while (i < xParsed.length || j < yParsed.length) {
    if (i >= xParsed.length || (j < yParsed.length && xParsed[i][0] > yParsed[j][0])) {
      res.push([yParsed[j][0] - timestart, res[res.length - 1][1], yParsed[j][1]]);
      j++;
    } else {
      res.push([xParsed[i][0] - timestart, xParsed[i][1], res[res.length - 1][2]]);
      i++;
    }
  }
  return res.filter((d, i, c) => i === c.length - 1 || c[i+1][0] !== d[0]);
}



const server = http.createServer(app.callback());
const io = new socket(server);

let frontendSocket = null;
let connectedToFrontend = false;

io.on('connection', async function(socket) {
    // "fuck uf kryptographie" - fyodor 2k19
    const b64uid = Math.random();
    veryReliableUserDatabase[b64uid] = {
      scores: [],
    };

    socket.on('raw data', (msg) => {
      console.log(`${Date.now()}: ${msg}`);
    });
    socket.on('score', (msg) => {
      veryReliableUserDatabase[b64uid].scores.push([new Date().toISOString(), msg]);
    });

    socket.emit('user id', b64uid);
    frontendSocket = socket;
    connectedToFrontend = true;
})

const sensorSocket = new WebSocket('ws://130.82.239.210/ws');

sensorSocket.onopen = function() {
  sensorSocket.send(JSON.stringify({
    signals: [
      {
        Name: "ESP_Laengsbeschl",
      },
      {
        Name: "ESP_Querbeschleunigung",
      },
    ],
    samplerate: 250,
    withtimestamp: true
  }));
};

sensorSocket.onmessage = (e) => {
  if (connectedToFrontend) {
    frontendSocket.emit("data", e.data);
  }
};

sensorSocket.onerror = (e) => {
  console.log("Socket error: " + e.data);
};

sensorSocket.onclose = (e) => {
  console.log("Socket close: ", e);
}





server.listen(3000);

console.log('Server running on port 3000');
