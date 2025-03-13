// config.js


require("dotenv").config();

const mongoDbConfig = {
  username: process.env.MONGO_DB_USERNAME,
  password: process.env.MONGO_DB_PASSWORD,
  host: process.env.MONGO_DB_HOST,
  port: process.env.MONGO_DB_PORT,
  name: process.env.MONGO_DB_NAME,
  authSource: process.env.MONGO_DB_NAME,
};

export const mongodb = {
 //uri:`mongodb://${mongoDbConfig.username}:${mongoDbConfig.password}@${mongoDbConfig.host}:${mongoDbConfig.port}/${mongoDbConfig.name}?authSource=${mongoDbConfig.authSource}`
 uri: `mongodb://${mongoDbConfig.host}:${mongoDbConfig.port}/${mongoDbConfig.name}?authSource=${mongoDbConfig.authSource}`,
};

export const constants = {
  Corporate:"Corporate Registry Agent",
  Finance: 'Financial Data Agent',
  Web: 'Web Research Media Agent',
  Processing: 'Processing',
  Completed: 'Completed'
  
};
