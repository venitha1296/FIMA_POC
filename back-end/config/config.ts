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
  ClickAndCollect:"Click & Collect",
  Closed: 'Closed',
  Queued: 'Queued',
  PLUM: 'PLUM',
  LIFESPAN: 'LIFESPAN',
  PLUM_SHIPPING_CODE : 'Standard Partner Shipping - PLM',
  LIFESPAN_SHIPPING_CODE : 'Standard Partner Shipping - LFS',
  DEFAULT_SHIPPING_CODE : 'Standard Shipping - AusPost',
  PLUM_DIRECTORY : '/toysrus-sftp-storage/Plum/Orders/',
  LIFESPAN_DIRECTORY : '/toysrus-sftp-storage/Lifespan/Orders/',
  FULFILMENT_ORDER_DIRECTORY : '/toysrus-sftp-storage/FulfilmentOrders/',
  FULFILMENT_DIRECTORY: '/toysrus-sftp-storage/Fulfilments/',
  SHIPPING_COST: 'ShippingCost',
  FULFILMENT_UPDATE : 'FulfilmentUpdate',
  GIFT_CARD : 'Gift Card',
  SHOPIFY_TOY : 'toys-r-us-australia',
  SHOPIFY_BABY : 'babies-r-us-australia-development-store',
  SHOPIFY_HOBBY : 'hobby-warehouse-development',
  SHOPIFY_RAC : 'riot-art-and-craft',
  SHOPIFY_RACW : 'riotwholesale',
  RUBIES : 'Rubies Dropshipping',
  TOY : 'Toy',
  BABIES : 'Babies',
  HOBBY : 'Hobby',
  RAC : 'Rac',
  RACW : 'Rac Wholesale',
  ORDER_ACTION : 'create_or_update',
  WMS_DIRECTORY: '/toysrus-sftp-storage/WMS/',
  FULFILMENT_ACTION : 'create_or_update_fulfilment',
  INVENTORY_ACTION : 'create_or_update_inventory',
  WMS_INVENTORY_ACTION : 'update_inventory_wms',
  MYOB_INVENTORY_ACTION : 'update_inventory_myob',
  ORDER : 'Orders',
  INVENTORY : 'inventory',
  ORDER_FOLDER : 'shopify-orders',
  INVENTORY_FOLDER : 'shopify-inventory',
  TOY_CUSTOMER : '12682',
  BABY_CUSTOMER : '12683',
  HOBBY_CUSTOMER : '12684',
  RIOT_CUSTOMER : '12681',
  RIOT_WS_CUSTOMER : '12685'
};
