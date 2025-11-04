const express = require('express');
const router = express.Router();
const Campground = require('../models/campground.js');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js');
const campgrounds = require('../controllers/campgrounds.js');

//Index, home show
router.get('', campgrounds.index);

//Creating new
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, validateCampground, campgrounds.createCampground);

//Show
router.get('/:id', campgrounds.showCampground);

//Updating
router.patch('/:id', isLoggedIn, isAuthor, validateCampground, campgrounds.updateCampground);


//Edit show
router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm);

//Delete 
router.delete('/:id', isLoggedIn, isAuthor, campgrounds.deleteForm);

module.exports = router;