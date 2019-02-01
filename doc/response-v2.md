# Koa response V2

基于koa封装的统一json数据返回格式，[v1版本在这里查看](./response-v1.md)

**优点**：使用简洁，完全实现koa中间件形式，通过bind注入，注册一次即可全局使用

**缺点**：不具备ts语法的清晰提示

## 目录结构

``` bash
├── middlewares
│   ├── index.ts
│   ├── logger
│   └── response
│       ├── apiError.ts     # 错误码定义
│       ├── apiResponse.ts  # 返回方法封装
│       └── index.ts        # 绑定中间件
```

## 示例代码

**`apiError.ts`**

> api错误定义类，定义code与msg

``` ts
const apiError = {} as any;

/** { code: -1, msg: "系统未知错误" } */
apiError.ERROR_UNKNOWN = { code: -10000, msg: "系统未知错误" };

/** { code: -10001, msg: "用户已存在" } */
apiError.ERROR_USER_EXISTED = { code: -10001, msg: "用户已存在" };

export default apiError;

```

**`apiResponse.ts`**

> response封装，导出success和error方法

``` ts
/**
 * 返回json数据
 * @param ctx 上下文
 * @param code 响应码
 * @param msg 响应提示
 * @param data 响应数据
 */
const _response = async (ctx: any, code: number, msg: string, data?: any ) => {
  ctx.body = { code, msg, data };
};

/**
 * 成功的响应
 * @param ctx 上下文
 * @param msg 成功提示
 * @param data 返回数据
 */
const success = async (ctx: any, msg: string = 'success', data: any = '') => {
  _response(ctx, 0, msg, data);
};

/**
 * 失败的响应
 * @param ctx 上下文
 * @param errName 错误代码
 */
const error = async (ctx: any, errName: any ) => {
  const { code, msg } = errName;
  _response(ctx, code, msg);
};

export { success, error };

```

**`index.ts`**

> middleware中间件，在app.ts中注册使用

``` ts
import apiError from './apiError';
import { success, error } from './apiResponse';

const response = async (ctx, next) => {
  // 绑定success方法
  ctx.success = success.bind(null, ctx);
  // 绑定error方法
  ctx.error = error.bind(null, ctx);
  // 绑定错误码数据
  ctx.apiError = apiError;
  await next();
};

export default response;

```

**`app.ts`**

> 应用入口文件，部分代码

``` ts
import * as Koa from 'koa';
import router from './routes';
import { response } from './middlewares';

const app = new Koa();

const port = process.env.SERVER_PORT || 3000;

// 注册响应中间件（核心）
app.use(response);

app.use(router.routes()).use(router.allowedMethods());

app.listen(port);
```

## 如何使用

在controller类的返回方法中根据需求调用success或error方法
   
``` ts
/** success(msg?: string, data?: any): Promise<void> */
public static demoSuccess = async (ctx: any) => {
  const data = {
    "username": "alonez",
    "address": "四川省成都市"
  };
  ctx.success("请求成功", data);
}

/** error(errName: IApiError): Promise<void> */
public static demoError = async (ctx: any) => {
  ctx.error(ctx.apiError.ERROR_USER_EXISTED);
}
```

接口返回示例
   
``` ts
// success
{
  "code": 0,
  "msg": "请求成功",
  "data": "{
    "username": "alonez",
    "address": "四川省成都市"
  }"
}

// error
{
  "code": -10001,
  "msg": "该用户已存在"
}
```
