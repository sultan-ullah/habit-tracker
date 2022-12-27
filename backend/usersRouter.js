const express = require("express");
const router = express.Router();
const basicAuth = require("express-basic-auth");
const logger = require('./Logger')("users-router");
const userManager = require('./UserManager')


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

router.post('/signup', async (req, res) => {
  logger.info("Got a signup request");
  if (!req.body || !req.body.username || !req.body.encryptedHash) {
    logger.error("Invalid or missing signup parameters");
    return res.sendStatus(400);
  }

  const { username, encryptedHash } = req.body;

  logger.info("Checking for an existing user");

  const userDocument = await userManager.read(username);

  if (userDocument !== null) {
    logger.error("Username is already used");
    return res.sendStatus(409);
  }
  
  logger.info("No user exists, creating new one");
  await userManager.create(
    username,
    encryptedHash
  )

  return res.sendStatus(201);
});

router.get('/login', async (req, res) => {
  logger.info(`Log in attempted by user: ${req.body.username}`);
  const authenticated = await myAuthorizer(req.body.username, req.body.encryptedHash);
  if (!authenticated) {
    return res.sendStatus(401);
  }
  res.end();
});

router.get("/users", async (req, res) => {
  const users = await userManager.readAll();
  res.json(users);
})

router
  .route("/users/:username")
  .all(basicAuth({ authorizer: myAuthorizer }))
  .get(async function (req, res, next) {
    const user = await userManager.read(req.params.username);
    logger.info(user);
    const { username, encryptedHash } = user;
    res.json({ username, encryptedHash });
    res.end();
  })
  .put(async function (req, res, next) {
    if (!req.params.username || !req.body.oldEncryptedHash && !req.body.newEncryptedHash) {
      return res.sendStatus(400);
    }

    const user = await userManager.read(req.params.username);

    if (user.encryptedHash !== req.body.oldEncryptedHash) {
      logger.info("Incorrect old password");
      return res.sendStatus(400);
    }

    const result = await userManager.update(req.params.username, req.body.encryptedHash);
    logger.info("Successfully updated password");
    if (result) return res.end();


    res.sendStatus(500);
  })
  .delete(async function (req, res, next) {
    const user = await userManager.read(req.params.username);
    if (user === null) {
      logger.info("User not found");
      return res.sendStatus(404);
    }
    await userManager.delete(req.params.username);
    res.end();
  });

module.exports = router;
