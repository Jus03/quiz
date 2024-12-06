var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('quiz_files/about', { title: 'About Music' });
});

module.exports = router;
