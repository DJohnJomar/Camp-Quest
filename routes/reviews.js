const express = require('express');
const router = express.Router({ mergeParams: true });
const {reviewJoiSchema} = require('../joiSchemas');
const Review = require('../models/review');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn} = require('../middleware.js');

const validateReview = (req, res, next) => {
  const { error } = reviewJoiSchema.validate(req.body);
  if (error) {
    console.log(error);
    const message = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, message);
  } else {
    next();
  }
}

//New Review
router.post('/', isLoggedIn, validateReview, async (req, res) => {
  console.log('Request Body: ' + req.body);
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'Successfully Created New Review!');
  res.redirect(`/campgrounds/${campground._id}`);
});

//Delete Review
router.delete('/:reviewId', isLoggedIn, async (req, res) => {
  const {id, reviewId} = req.params;
  await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}}); //pull removes from an array matching a condition.
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully Deleted Review!');
  res.redirect(`/campgrounds/${id}`);
})

module.exports = router;