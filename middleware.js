module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Capture return path
        let returnTo = req.originalUrl;

        // If it's a review submission (POST to /campgrounds/:id/reviews)
        // redirect back to the campground show page instead
        if (returnTo.match(/\/campgrounds\/[^\/]+\/reviews/)) {//Regex: find match with /campgrounds/:id/review
            returnTo = returnTo.replace(/\/reviews.*$/, ''); // trim /reviews and anything after
        }

        req.session.returnTo = returnTo;
        req.flash('error', 'You must be signed in.');
        return res.redirect('/login');
    }
    next();
}

//Store return URL into locals since session is cleared after successful login
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

