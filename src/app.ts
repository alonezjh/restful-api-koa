import * as Koa from 'koa';
import './config/env';
import './config/db';
import router from './routes';

const app = new Koa();
const port = process.env.SERVER_PORT || 3000;

app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url}`);
  await next();
});

app.use(async (ctx, next) => {
  await next();
  ctx.body = `当前运行环境：${process.env.NODE_ENV}`;
});

app.use(async (ctx, next) => {
  const start = new Date().getTime();
  await next();
  const ms = new Date().getTime() - start;
  console.log(`Time: ${ms}ms`);
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port);

console.log(`server start at http://localhost:${port}/`);
