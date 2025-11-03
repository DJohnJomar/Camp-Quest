const express = require('express');
const router = express.Router();
const Campground = require('../models/campground.js');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js');

//Index, home show
router.get('', async (req, res) => {
  const campgrounds = await Campground.find();
  res.render('campgrounds/index', { campgrounds });
});

//Creating new
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Successfuly Created New Campground!');
  res.redirect(`/campgrounds/${campground._id}`);
});


//Show
router.get('/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate({path: 'reviews',populate: {path: 'author'}}).populate('author');
  if (!campground) {
    req.flash('error', 'Campground Not Found!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
});


//Updating
router.patch('/:id', isLoggedIn, isAuthor, validateCampground, async (req, res, next) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, { new: true, runValidators: true });
  req.flash('success', 'Successfuly Updated Campground!');
  res.redirect(`/campgrounds/${campground._id}`);
});


//Edit show
router.get('/:id/edit', isLoggedIn, isAuthor, async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash('error', 'Campground Not Found!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
});

//Delete 
router.delete('/:id', isLoggedIn, isAuthor,async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash('success', 'Campground Deleted Successfully!');
  res.redirect('/campgrounds');
});

module.exports = router;