// loads the express module
var express = require('express');
// then uses it to get an exress.Router object
var router = express.Router();

// then specifies a route on the object
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// finally exports the router from the module (to be imported to app.js)
module.exports = router;
