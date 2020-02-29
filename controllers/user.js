const validator = require('validator');
const User = require('../models/User');

exports.getLogin = (req, res) => {
    if (req.user) {
      return res.redirect('/');
    }
    console.log("redirecting it");
    res.render('account/login', {
      title: 'Login'
    });
  };


  exports.getSignup = (req, res) => {
    if (req.user) {
      return res.redirect('/');
    }
    res.render('account/signup', {
      title: 'Create Account'
    });
  };


  exports.postSignup = (req, res, next) => {
    console.log("signup route visited");
    const validationErrors = [];
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
    if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
    if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });
  
    if (validationErrors.length) {
      req.flash('errors', validationErrors);
      return res.redirect('/signup');
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
  
    const user = new User({
      email: req.body.email,
      password: req.body.password
    });
  
    User.findOne({ email: req.body.email }, (err, existingUser) => {
      if (err) { return next(err); }
      if (existingUser) {
        req.flash('errors', { msg: 'Account with that email address already exists.' });
        return res.redirect('/signup');
      }
      user.save((err) => {
        if (err) { return next(err); }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect('/');
        });
      });
    });
    
  };