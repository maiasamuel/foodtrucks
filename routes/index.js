var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function (req, res, next) {
  res.render('signup')
});

router.post('/signup', function (req, res, next) {
  console.log(req.body);
  res.render('signup')
})

module.exports = router;
