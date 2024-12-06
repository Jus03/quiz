    var express = require('express');
    var router = express.Router();

    /* GET home page. */
    router.get('/', function(req, res, next) {
    res.render('quiz_files/game', { title: 'Music Life' });
    });

    module.exports = router;
