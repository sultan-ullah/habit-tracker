const logger = require("./Logger")("user-manager");
const dbConnector = require("./DbConnector");
const COLLECTION_NAME = "users";
let userManager;

class UserManager {
  async create(username, encryptedHash) {
    logger.info(`Creating user with username: ${username}`);
    const collection = await dbConnector.getCollection(COLLECTION_NAME);
    await collection.insertOne({
      username,
      encryptedHash,
    });
  }

  async read(username) {
    logger.info(`Getting info for user: ${username}`);
    const collection = await dbConnector.getCollection(COLLECTION_NAME);
    const userDocument = await collection.findOne({ username });
    return userDocument;
  }

  async update(username, encryptedHash) {
    logger.info(`Updating password for user: ${username}`);
    const collection = await dbConnector.getCollection(COLLECTION_NAME);
    const result = await collection.updateOne(
      { username },
      { $set: { encryptedHash } },
      { upsert: true }
    );
    logger.info(result);
    return result.acknowledged;
  }

  async delete(username) {
    logger.info(`Deleting user with username: ${username}`);
    const collection = await dbConnector.getCollection(COLLECTION_NAME);
    await collection.deleteOne({ username });
  }

  async readAll() {
    logger.info("Getting all users in collection...");
    const collection = await dbConnector.getCollection(COLLECTION_NAME);
    const array = await collection.find().toArray();
    return array;
  }
}

if (!userManager) {
  module.exports = new UserManager();
} else {
  module.exports = userManager;
}
