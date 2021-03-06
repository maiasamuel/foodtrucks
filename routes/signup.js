"use strict"

var express = require('express');
var router = express.Router();
var queries = require('../db/queries');
//var swal = require('sweetalert');


// signup
router.get('/', function (req, res, next) {
  res.render('signup')
});

/*
router.post('/', function (req, res, next) {
  if(req.body.userSignupPassword === req.body.userSignupPassword2){
    console.log('Password match');
    queries.getSingleUserByUsername(req.body.userSignupUsername).then(function(data){
      if(req.body.userSignupUsername===data[0].username){
        console.log('Username not avaliable for User Account Creation');
        res.redirect('/');
      }
    }).catch(function(){
      next();
    })
  }
  else {
    console.log('Passwords do not match for User Account Creation');
    res.redirect('/signup');
  }
})
*/
router.post('/', function (req, res, next) {
    queries.getSingleOwnerByUsername(req.body.userSignupUsername).then(function(data){ // To lowercase
      if(data.length===0){
        queries.getSingleUserByUsername(req.body.userSignupUsername).then(function(data){
          if(data.length===0){
            next();
          }
          else{
            res.render('signup',{errorMessage:"Username Already Taken Error # 4!"});
          }
        })
      }
      else {
        res.render('signup',{errorMessage:"Username Already Taken Error # 3!"});
      }
    })
})


router.post('/', function (req, res, next) {
  queries.addNewUser(req.body.userSignupFirst, req.body.userSignupLast, req.body.userSignupUsername, req.body.userSignupPassword, req.body.userSignupEmail,req.body.userPic).then(function(data){
    res.redirect('/');
  })
});

// Truck signup
router.get('/truck', function (req, res, next) {
  return queries.User().where('username', req.user)
  .then(function(user) {
      console.log(req.user);
      res.render('truckSignUp', {loggedIn: "yes", user: user[0]})
    })
   .catch(function(error) {return next(error);
  });
});

router.post('/owner', function (req, res, next) {
    queries.getSingleUserByUsername(req.body.ownerSignupUsername).then(function(data){
      if(data.length===0){
        queries.getSingleOwnerByUsername(req.body.ownerSignupUsername).then(function(data){
          if(data.length===0){
            next();
          }
          else{
            res.render('signup',{errorMessage:"Username Already Taken Error # 2!"});
          }
        })
      }
      else {
        res.render('signup',{errorMessage:"Username Already Taken Error # 1!"});
      }
    })
})

router.post('/owner', function (req, res, next) {
  queries.addNewOwner(req.body.ownerSignupFirst, req.body.ownerSignupLast, req.body.ownerSignupUsername, req.body.ownerSignupPassword, req.body.ownerSignupEmail).then(function(data){
    res.redirect('/');
  })
});

module.exports = router;
