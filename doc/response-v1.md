# Koa response V1

基于koa封装的统一json数据返回格式，[v2版本在这里查看](./response-v2.md)

**优点**：具备ts语法的清晰提示

**缺点**：使用不够简洁，调用时每一个controller都需要import和实例化，操作成本繁琐

## 示例代码

**`apiError.ts`**

> api错误定义类，定义code与msg

``` ts
interface IApiError {
  code: number;
  msg: string;
}

class ApiError {

  /** { code: -1, msg: "系统未知错误" } */
  public ERROR_UNKNOWN: IApiError;

  /** { code: -10001, msg: "该用户已存在" } */
  public ERROR_USER_EXISTED: IApiError;

  constructor() {
    this.ERROR_UNKNOWN        = { code: -10000, msg: "系统未知错误" };
    this.ERROR_USER_EXISTED   = { code: -10001, msg: "该用户已存在" };
  }

}

export { IApiError, ApiError };

```

**`response.ts`**

> response封装，导出success和error方法

``` ts
import { IApiError } from './apiError';

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
const error = async (ctx: any, errName: IApiError ) => {
  const { code, msg } = errName;
  _response(ctx, code, msg);
};

export { success, error };

```

## 如何使用

1. 在对应的controller类中import *`apiError.ts` 和 `response.ts` 文件
   
  ``` ts
  import { response } from './response.ts';
  import { apiError } from './apiError.ts';
  ```
2. 实例化apiError类
   
  ``` ts
  const apiError = new ApiError();
  ```
3. 在返回方法中根据需求调用success或error方法
   
  ``` ts
  /** success(ctx: any, msg?: string, data?: any): Promise<void> */
  public static demoSuccess = async (ctx: any) => {
    response.success(ctx);
  }

  /** error(ctx: any, errName: IApiError): Promise<void> */
  public static demoError = async (ctx: any) => {
    response.error(ctx, apiError.ERROR_UNKNOWN);
  }
  ```
4. 接口返回示例
   
  ``` ts
  // success
  {
    "code": 0,
    "msg": "请求成功",
    "data": "{
      "username": "alonez",
      "address": "四川省成都市"
    }"
  }

  // error
  {
    "code": -10001,
    "msg": "该用户已存在"
  }
  ```
