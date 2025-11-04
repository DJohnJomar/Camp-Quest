const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.newReview = async (req, res) => {
  console.log('Request Body: ' + req.body);
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'Successfully Created New Review!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const {id, reviewId} = req.params;
  await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}}); //pull removes from an array matching a condition.
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully Deleted Review!');
  res.redirect(`/campgrounds/${id}`);
}