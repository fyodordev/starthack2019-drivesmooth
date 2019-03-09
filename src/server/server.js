import '../common/tweaks.js';

import Koa from 'koa';
import Router from 'koa-router';
import path from 'path';
import serve from 'koa-static';
import fs from 'fs';
import {promisify} from 'util';
import views from 'koa-views';

const readFile = promisify(fs.readFile);

const app = new Koa();
const router = new Router();


app.use(views(path.join(__dirname, '../public')))

router.get('/', async (ctx, next) => {
  await ctx.render('index');
  console.log('this is a test');
})

app.use(serve(path.join(__dirname, '../public')));


app.use(router.routes());

app.listen(3000);

console.log('Server running on port 3000');