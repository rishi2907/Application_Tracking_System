var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    loggedIn:false,
    email:"noreply@SpeechGrammarList.com"
 });
});

module.exports = router;
