var express=require("express");
var router=express.Router();
var bodyParser=require("body-parser");
var DBFunctions = require("./DBfunctions.js")
var middleToParseRequestBody=bodyParser.urlencoded({extended:false});

var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var flash = require('express-flash');

router.use(bodyParser.urlencoded());
router.use(cookieParser());
router.use(flash());
router.use(passport.initialize());
router.use(passport.session());


router.post('/', middleToParseRequestBody,function(req, res, next) {
  console.log("to forrgooot");
  res.render("forgotPass");
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      mongoose.model("users").findOne({ email: "asmaazakaria94@gmail.com" }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'asmaazakaria94@gmail.com',
          pass: 'samka12345'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'yallanotlob.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Your new password is:\n\n'
          +token.substring(0,6)
      };
      mongoose.model("users").update({"email":user.email },{$set:{"password":token.substring(0,6)}},function(err){
          if(err)
              console.log("error reset pass",err)
      });
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
});


module.exports=router;
