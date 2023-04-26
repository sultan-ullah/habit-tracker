const logger = require('./Logger')('db-connector');
const dotenv = require('dotenv');
dotenv.config();
// console.log(process.env);
const { MongoClient, ServerApiVersion } = require("mongodb");
const URI = process.env.DB_URI;
const DB_NAME = process.env.DB_NAME;
let dbConnector;

class DbConnector {
  constructor() {
    logger.info("Creating new db client");
    this.client = new MongoClient(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
  }

  async getCollection(collectionName) {
    logger.info(`connecting to db client for collection: ${collectionName}`);
    await this.client.connect();
    return this.client.db(DB_NAME).collection(collectionName);
  }
}

if (!dbConnector) {
  module.exports = new DbConnector();
} else {
  module.exports = dbConnector;
}

