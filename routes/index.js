var express = require('express');
var router = express.Router();
var {getJobCard}= require('./JobCard');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(getJobCard);
  res.render('index', { title: 'Express' , JobCard : getJobCard });

});

module.exports = router;
