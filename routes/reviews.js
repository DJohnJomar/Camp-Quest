const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review');
const Campground = require('../models/campground');
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware.js');
const reviews = require('../controllers/reviews');


//New Review
router.post('/', isLoggedIn, validateReview, reviews.newReview);

//Delete Review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviews.deleteReview)

module.exports = router;