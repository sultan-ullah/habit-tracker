const express = require("express");
const router = express.Router();
const basicAuth = require("express-basic-auth");
function myAuthorizer(username, password) {
  console.log(username);
  console.log(password);
  return true;
}

function unauthorizedResponse(req) {
  console.log(req.url);
  return true;
}

router.route('/habits/:user_id')
.get((req, res, next) => {
  res.end("GET ALL habits CALLED")
})

router.route('/habits/:user_id/:habit_id')
.all(basicAuth({ authorizer: myAuthorizer, unauthorizedResponse }))
.get(function (req, res, next) {
  res.end("GET CALLED")
})
.put(function (req, res, next) {
  // just an example of maybe updating the user
  // req.user.name = req.params.name
  // save user ... etc
  res.end("PUT CALLED")
})
.post(function (req, res, next) {
  // next(new Error('not implemented'))
  res.end("POST CALLED")
})
.delete(function (req, res, next) {
  // next(new Error('not implemented'))
  res.end("DELETE CALLED")
})

module.exports = router;