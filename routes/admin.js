var express = require('express');
var router = express.Router();
var adminController = require('../controllers/admin');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });



router.get('/register', adminController.getSignup);
router.post('/register', adminController.postSignup);
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/', function(req, res, next) {
  if(req.user){
    console.log(req.user);
    res.render('admin/admin',
    {
      name: req.user.name,
      usertype: req.user.usertype });
  }
  else{
      res.redirect('/admin/login');
      
 }
 });

module.exports = router;
