var express = require('express');
var router = express.Router();

// login
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', function (req, res, next) {
  console.log(req.body);
  res.render('login')
})

module.exports = router;