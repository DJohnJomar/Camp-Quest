const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');


router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to Camp Quest!');
        res.redirect('/campgrounds');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register');
    }

});

router.get('/login',(req, res) => {
  res.render('users/login');
});

router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}),async (req, res) => {
//If we made it in this part, we know that the info passed in is authenticated successfully
    req.flash('success', 'Welcome back!');
    res.redirect('/campgrounds');
})

module.exports = router;