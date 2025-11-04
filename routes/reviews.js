const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review');
const Campground = require('../models/campground');
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware.js');
const reviews = require('../controllers/reviews');

//New Review
router.route('/')
    .post(isLoggedIn, validateReview, reviews.newReview)

//Delete Review
router.route('/:reviewId')
    .delete(isLoggedIn, isReviewAuthor, reviews.deleteReview)

module.exports = router;