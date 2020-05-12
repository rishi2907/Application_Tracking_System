const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.post('/postjob', adminController.postJobForm);
router.get('/postjob', adminController.getJobForm);
router.get('/register', adminController.getSignup);
router.get('/showChart', adminController.showChart);
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
