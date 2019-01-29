import * as Router from 'koa-router';

const router = new Router();

router.get('/test', async (ctx) => {
  ctx.body = 'this is a test response!';
});

export default router;
