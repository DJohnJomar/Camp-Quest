const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, function (error) {
            if (error) {
                return next(error);
            }
            req.flash('success', 'Welcome to Camp Quest!');
            res.redirect('/campgrounds');
        });

    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register');
    }

}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = async (req, res) => {
    //If we made it in this part, we know that the info passed in is authenticated successfully
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout(function (error) {
        if (error) {
            return next(error);
        }
        req.flash('success', 'Logged out successfuly!');
        res.redirect('/campgrounds');
    });

}