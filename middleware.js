const {campgroundJoiSchema, reviewJoiSchema} = require('./joiSchemas');
const Campground = require('./models/campground');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');

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

//function used as middleware for campground validation
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundJoiSchema.validate(req.body);
  if (error) {
    console.log(error);
    const message = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, message);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewJoiSchema.validate(req.body);
  if (error) {
    console.log(error);
    const message = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, message);
  } else {
    next();
  }
}

module.exports.isAuthor = async (req, res, next) => {
  const {id} = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that.');
    return res.redirect(`/campgrounds/${campground._id}`);
  }
  next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const {id, reviewId} = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that.');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
}

