const validator = require('validator');
const passport = require('passport');
const User = require('../models/User');
var {getJobCard}= require('../routes/JobCard');
const JobSchema = require('../models/JobSchema');



exports.clickButton1 = (req, res) => {
  res.redirect('/');
};


exports.clickButton2 = async (req, res) => {
  var data = await JobSchema.find({openingtype:"nontechnical", status:"open"});
  if(req.user){
   res.render('index', {
     name: req.user.name,
     Jobdata: data,
   });
 
  }else{
   res.render('index', { 
     name:"login_req",
     Jobdata: data,
  });
 
 }
 
};



exports.getLogin = (req, res) => {
    if (req.user) {
      return res.redirect('/');
    }
    res.render('account/login', {
      title: 'Login'
    });
  };

  exports.applyNow = (req, res) => {
    if (req.user) {
      return res.render('stepper');
    }
    return res.redirect('/login');
    
  };

  // exports.logDone = (req, res) => {
  //   console.log("logging int");
  //   console.log(req.user);
  //   res.render('index', {
  //     name: req.user.name,
  //     JobCard : getJobCard,
  //     tag: 1
  //   });
  // };

  exports.logoutDone = (req, res) => {
     req.logout();
     res.redirect("/");
  };


  exports.getSignup = (req, res) => {
    if (req.user) {
      return res.redirect('/');
    }
    res.render('account/signup', {
      title: 'Create Account'
    });
  };

  exports.postLogin = (req, res, next) => {
    const validationErrors = [];
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
    if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' });
  
    if (validationErrors.length) {
      req.flash('errors', validationErrors);
      return res.redirect('login');
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
  
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('errors', info);
        return res.redirect('/login');
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        req.flash('success', { msg: 'Success! You are logged in.' });
        /*res.redirect(req.session.returnTo || '/');*/
        res.redirect('/');
        

      });
    })(req, res, next);
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
    // var name = req.body.name[0].toUpperCase() +  
    //         req.body.name.slice(1);

    var name=req.body.name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      name: name
    }); 
  
    User.findOne({ email: req.body.email }, (err, existingUser) => {
      if (err) { return next(err); }
      if (existingUser) {
        req.flash('errors', { msg: 'Account with that email address already exists.' });
        return res.redirect('/signup');
      }
      user.save((err) => {
        if (err) { return next(err); }
        res.redirect('/login');
        /*req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect('/');
        });*/
      });
    });
    
  };