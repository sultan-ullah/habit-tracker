const express = require("express");
const router = express.Router();
const basicAuth = require("express-basic-auth");
const logger = require('./Logger')("habits-router");
const userManager = require('./UserManager')
const habitManager = require('./HabitManager');

async function myAuthorizer(username, encryptedHash) {
  logger.info(`Authentication attempted for username: ${username}`)
  const user = await userManager.read(username);

  if (user === null) {
    logger.info("Username does not exist");
    return false;
  }

  logger.info(`User found: ${username}`);
  logger.info(user.encryptedHash)
  logger.info(encryptedHash);

  if (encryptedHash !== user.encryptedHash) {
    logger.info('Incorrect password');
    return false;
  }

  logger.info("User authenticated");
  return true;
}

router.get("/:username/habits", basicAuth({ authorizer: myAuthorizer }), async (req, res) => {
  logger.info(req.params.username);
  logger.info(req.auth)
  if (req.params.username === req.auth.user) {
    logger.info("User is authenticated to view habits");
    const habits = await habitManager.readAll(req.auth.username);
    return res.json(habits.map(({ habitName, habitNotes, habitStartDateTime }) => ({habitName, habitNotes, habitStartDateTime})));
  }
  logger.info("User does not have authentication to view habits");
  res.sendStatus(404);
})

router.post("/:username/habits", async function (req, res, next) {
  const name = req.body.habitName;
  const notes = req.body.notes || '';
  const startDateTime = req.body.habitStartDateTime || new Date();

  if (!name) {
    logger.error("Habit name required");
    res.sendStatus(400);
  }

  await habitManager.create(req.params.username, name, notes, startDateTime);
  
  res.sendStatus(201);
})

router
  .route("/:username/habits/:habitName")
  .all(basicAuth({ authorizer: myAuthorizer }), async (req, res, next) => {
    if (req.auth.user !== req.params.username) {
      logger.info("User does not have authenticated to view habits");
      return res.sendStatus(404);
    }
    next();
  })
  .get(async function (req, res, next) {
    const habit = await habitManager.read(req.params.username, req.params.habitName);
    
    if (habit === null) {
      logger.error("No habit found");
      return res.sendStatus(404);
    }

    logger.info("Habit found");
    const { habitName, habitNotes, habitStartDateTime } = habit;
    res.json({ habitName, habitNotes, habitStartDateTime });
  })


  .put(async function (req, res, next) {
    const habit = await habitManager.read(req.params.username, req.params.habitName, req.body);

    if (habit === null) {
      logger.error("No habit found");
      return res.sendStatus(404);
    }

    logger.info("Habit found");
    const result = await habitManager.update(req.params.username, req.params.habitName, req.body);

    logger.info("Successfully updated habit");
    if (result) return res.end();


    res.sendStatus(500);
  })
  .delete(async function (req, res, next) {
    const habit = await habitManager.read(req.params.username, req.params.habitName);
    if (habit === null) {
      logger.info("Habit not found");
      return res.sendStatus(404);
    }
    await habitManager.delete(req.params.username, req.params.habitName);
    res.end();
  });

module.exports = router;