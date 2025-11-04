const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const {storeReturnTo} = require('../middleware');
const users = require('../controllers/users');

//Render register form, register user
router.route('/register')
    .get(users.renderRegisterForm)
    .post(users.register)

//Render login form, login user
router.route('/login')
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

//Logout Users
router.route('/logout')
    .get(users.logout)

module.exports = router;