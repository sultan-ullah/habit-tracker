const logger = require('./Logger')('habit-manager');
const dbConnector = require('./DbConnector');
const userManager = require('./UserManager');
const COLLECTION_NAME = "habits";
let habitManager;

class HabitManager { 
  async create(username, habitName, habitNotes, habitStartDateTime) {
    logger.info(`Creating habit ${habitName} for user ${username}: ${username}`);
    const collection = await dbConnector.getCollection(COLLECTION_NAME);
    await collection.insertOne({
      username,
      habitName,
      habitNotes,
      habitStartDateTime: habitStartDateTime,
    });
  }
  
  async read(username, habitName) {
    logger.info(`Getting info for habit: ${habitName} for user: ${username}`);
    const collection = await dbConnector.getCollection(COLLECTION_NAME);
    const habitDocument = await collection.findOne({ username , habitName });
    return habitDocument;
  }

  async readAllForUser(username) {
    logger.info(`Getting all habits for user: ${username}`);
    const collection = await dbConnector.getCollection(COLLECTION_NAME);
    const array = await collection.find({ username }).toArray();
    return array;
  }

  async update(username, habitName, changes) {
    logger.info(`changes: ${JSON.stringify(changes)}`)
    logger.info(`Getting habit ${habitName} for user ${username}`);
    const collection = await dbConnector.getCollection(COLLECTION_NAME);
    const result = await collection.updateOne(
      { username, habitName },
      { $set: { ...changes } },
      { upsert: true }
    );
    logger.info(result);
    return result.acknowledged;
  }


  async delete(username, habitName) {
    logger.info(`Deleting habit ${habitName} for user with username: ${username}`);
    const collection = await dbConnector.getCollection(COLLECTION_NAME);
    await collection.deleteOne({ username, habitName })
  }

  async readAll() {
    logger.info("Getting all habits in collection...");
    const collection = await dbConnector.getCollection(COLLECTION_NAME);
    const array = await collection.find().toArray();
    return array;
  }
}

if (!habitManager) {
  module.exports = new HabitManager();
} else {
  module.exports = habitManager;
}

