const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const localStrategy =require('passport-local');

module.exports = router;


router.get('/register', (req,res) =>{
    res.render('users/register');
})

router.post('/register', catchAsync(async (req,res) =>{
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
        })
        req.flash('success', 'Bienvenue à ESPRIT Student Exchange');
        res.redirect('/campgrounds');
    } catch(e) {
        
        req.flash('error', e.message);
        
        res.redirect('register');
        // flash doesnt show here !! to fix
    }
}));

//login

router.get('/login', (req,res) =>{
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),  (req,res) =>{
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || "/campgrounds";
    //console.log(redirectUrl);
    res.redirect(redirectUrl);
    
});

router.get('/logout', (req, res, next) =>{
    //req.logout() is asynchronous in version 6.0
    req.logout(err => {
        if (err) { return next(err); }
        req.flash('success', 'You are successfully logged out');
        //redirect to home page
        res.redirect('/campgrounds');
    });  
})

module.exports = router;