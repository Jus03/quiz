var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('quiz_files/myProfile', { title: 'Music Life' });
});

module.exports = router;
