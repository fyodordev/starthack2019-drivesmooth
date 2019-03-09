import '../common/tweaks.js';

import Koa from 'koa';
import Router from 'koa-router';
import path from 'path';
import serve from 'koa-static';
import views from 'koa-views';
import http from 'http';
import socket from 'socket.io';

const app = new Koa();
const router = new Router();


app.use(views(path.join(__dirname, '../public')));

router.get('/', async (ctx, next) => {
  await ctx.render('index');
  console.log('this is a test');
})

app.use(serve(path.join(__dirname, '../public')));




app.use(router.routes());

const server = http.createServer(app.callback());
const io = new socket(server);

io.on('connection', function(socket) {
    socket.on('raw data', function(msg) {
      console.log(`${Date.now()}: ${msg}`);
    });
})




server.listen(3000);

console.log('Server running on port 3000');