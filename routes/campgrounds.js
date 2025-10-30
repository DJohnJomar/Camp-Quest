const express = require('express');
const router = express.Router();
const { campgroundJoiSchema } = require('../joiSchemas.js');
const Campground = require('../models/campground.js');
const ExpressError = require('../utils/ExpressError');

//function used as middleware for campground validation
const validateCampground = (req, res, next) => {
  const { error } = campgroundJoiSchema.validate(req.body);
  if (error) {
    console.log(error);
    const message = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, message);
  } else {
    next();
  }
};

//Index, home show
router.get('', async (req, res) => {
  const campgrounds = await Campground.find();
  res.render('campgrounds/index', { campgrounds });
});

//Creating new
router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

router.post('/', validateCampground, async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  req.flash('success', 'Successfuly Created New Campground!');
  res.redirect(`/campgrounds/${campground._id}`);
});


//Show
router.get('/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate('reviews');
  if (!campground) {
    req.flash('error', 'Campground Not Found!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
});


//Updating
router.patch('/:id', validateCampground, async (req, res, next) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, { new: true, runValidators: true });
  req.flash('success', 'Successfuly Updated Campground!');
  res.redirect(`/campgrounds/${campground._id}`);
});


//Edit show
router.get('/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash('error', 'Campground Not Found!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
});

//Delete 
router.delete('/:id', async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash('success', 'Campground Deleted Successfully!');
  res.redirect('/campgrounds');
});

module.exports = router;