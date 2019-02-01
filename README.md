# restful-api-koa
使用koa框架开发的RESTFul API项目

## 开发文档

- [response中间件开发文档](./doc/response-v2.md)

- [logger中间件开发文档](./doc/logger.md)

## 已集成服务

`dotenv` [官方文档](https://github.com/motdotla/dotenv)

> 从文件中加载环境变量，用来进行不同的环境配置

``` ts
const path = {
  development: '.env.development',
  staging: '.env.staging',
  production: '.env.production',
}[process.env.NODE_ENV || 'development'];

dotenv.config({ path });
```

`nodemon` [官方文档](https://github.com/remy/nodemon#nodemon)

> 自动重启node服务，在nodemon.json中进行相关配置

``` ts
{
  "watch": ["src"],
  "ext": "ts",
  "ignore": ["node_modules"],
  "exec": "ts-node"
}
```

`sequelize` [官方文档](http://docs.sequelizejs.com)

> 基于Nodejs的异步ORM框架，同时支持PostgreSQL, MySQL, SQLite and MSSQL多种数据库

``` ts
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false,
  operatorsAliases: false,
  define: {
    underscored: false,
    freezeTableName: false,
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci',
    },
    timestamps: true,
  },
  sync: { force: false },
  pool: { max: 5, min: 0, idle: 10000 },
});
```

## 环境配置示例

`.env.development`
`.env.staging`
`.env.production`

注：env配置文件应该加入`.gitignore`文件中


### 开发环境

根目录下：`.env.development`

``` bash
# 开发环境配置文件

# 服务端口配置
SERVER_PORT = 3333

# 数据库配置
DB_HOST     = localhost
DB_USERNAME = root
DB_PASSWORD = 123456
DB_DATABASE = koa-dev
DB_PORT     = 8889
```

### 预发布环境

根目录下：`.env.staging`

``` bash
# 预发布环境配置文件

# 服务端口配置
SERVER_PORT = 3333

# 数据库配置
DB_HOST     = localhost
DB_USERNAME = root
DB_PASSWORD = 123456
DB_DATABASE = koa-staging
DB_PORT     = 8889
```

### 生产环境

根目录下：`.env.production`

``` bash
# 生产环境配置文件

# 服务端口配置
SERVER_PORT = 8090

# 数据库配置
DB_HOST     = localhost
DB_USERNAME = root
DB_PASSWORD = 123456
DB_DATABASE = koa-production
DB_PORT     = 3306
```

## 如何使用

### 下载

``` bash
git clone git@github.com:alonezjh/restful-api-koa.git
```

#### 安装依赖

``` bash
yarn
```

#### 预设命令

##### tslint检测

``` bash
yarn lint
```

##### 开发环境下运行

``` bash
yarn start:dev
```

##### 预发布环境下运行

``` bash
yarn start:stage
```

##### 生产环境下运行

``` bash
yarn start:prod
```

##### 打包项目

``` bash
yarn build
```
