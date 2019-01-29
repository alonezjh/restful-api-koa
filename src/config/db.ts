import './env';
import * as Sequelize from 'sequelize';

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

sequelize
  .authenticate()
  .then(() => {
    console.log(`数据库连接成功 => ${process.env.DB_DATABASE}`);
  })
  .catch(err => {
    console.error(`数据库连接失败`);
  });

export default sequelize;
