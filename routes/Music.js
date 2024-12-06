var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('quiz_files/Music', { title: 'Music Life' });
});

module.exports = router;
