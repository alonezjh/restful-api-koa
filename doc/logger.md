# Koa logger

基于 `log4js` 4.0.1版本封装的日志中间件，[log4js地址](https://github.com/log4js-node/log4js-node)

## 使用方式

1. 安装log4js依赖

``` bash
yarn add log4js
```
2. 在middlewares中间件目录下创建logger目录，[这里查看代码](../src/middlewares/logger)

``` bash
├── middlewares             # 中间件目录
│   ├── index.ts          
│   ├── logger              # 日志中间件
│   │   ├── config.ts        # log4js配置
│   │   ├── formatData.ts   # 格式化输出日志内容模版
│   │   └── index.ts        # 初始化
```

3. 在 `app.ts` 入口注册日志中间件

``` ts
import * as Koa from 'koa';
import router from './routes';
import { logger } from './middlewares';

const app = new Koa();

const { loggerInit, loggerType } = logger;

const port = process.env.SERVER_PORT;

// 使用日志中间件
app.use(loggerInit());

// 手模拟500错误
app.use(async (ctx, next) => {
  ctx.throw(500);
  await next();
});

app.use(async (ctx, next) => {
  // 输出请求日志
  ctx.log.info(loggerType.REQUEST);
  await next();
});

app.on('error', (err, ctx) => {
  // 输出错误日志
  ctx.log.error(loggerType.ERROR);
});

app.listen(port);
```
4. 控制台输出

``` ts
[2019-02-01T10:52:56.047] [INFO] request - {"ip":["127.0.0.1"],"method":"GET","path":"/api/user","platform":"PC","userAgent":"PostmanRuntime/7.6.0","responseTime":"0.001s"}

[2019-02-01T10:55:20.824] [ERROR] error - {"ip":["127.0.0.1"],"method":"GET","path":"/api/user","platform":"PC","userAgent":"PostmanRuntime/7.6.0","responseTime":"0.002s"}
```

5. 保存日志文件目录
  
``` bash
├── logs
│   ├── default    # 默认日志目录
│   │   ├── def.2019-01-31.log
│   │   └── def.2019-02-01.log
│   ├── error      # 错误日志目录
│   │   ├── err.2019-01-31.log
│   │   └── err.2019-02-01.log
│   └── request    # 请求日志目录
│       ├── req.2019-01-31.log
│       └── req.2019-02-01.log
```

## 日志配置

配置文件位于 `src/middlewares/logger/config.ts`，更多配置说明可查阅log4js官方文档。

``` ts
// 日志级别
const levels = ["trace", "debug", "info", "warn", "error", "fatal"];

// 日志类型
const types = {
  /** 默认类型log */
  DEFAULT: 'default',
  /** 请求类型log */
  REQUEST: 'request',
  /** 错误类型log */
  ERROR: 'error',
};

// 日志配置参数
const configures = {
  appenders: {
    stdout: {
      type: 'stdout',
    },
    default: {
      type: 'dateFile',
      filename: `logs/default/def`,
      pattern: "yyyy-MM-dd.log",
      alwaysIncludePattern: true,
    },
    request: {
      type: 'dateFile',
      filename: `logs/request/req`,
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
    },
    error: {
      type: 'dateFile',
      filename: `logs/error/err`,
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
    },
  },
  categories: {
    default: {
      appenders: ["stdout", "default"],
      level: "all",
    },
    request: {
      appenders: ["stdout", "request"],
      level: "all",
    },
    error: {
      appenders: ["stdout", "error"],
      level: "error",
    },
  },
};

export { levels, types, configures };
```
