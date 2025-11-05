const express = require('express');
const router = express.Router();
const Campground = require('../models/campground.js');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js');
const campgrounds = require('../controllers/campgrounds.js');
const {storage} = require('../cloudinary');
const multer  = require('multer')
const upload = multer({storage});

//Show campgrounds, create campground
router.route('/')
    .get(campgrounds.index)
    // .post(isLoggedIn, validateCampground, campgrounds.createCampground);
    .post(upload.array('image'), (req, res) => {
        console.log(req.files);
    })

//Show create new campground form
router.route('/new')
    .get(isLoggedIn, campgrounds.renderNewForm);

//Show campground, update campground, delete campground
router.route('/:id')
    .get(campgrounds.showCampground)
    .patch(isLoggedIn, isAuthor, validateCampground, campgrounds.updateCampground)
    .delete(isLoggedIn, isAuthor, campgrounds.deleteForm)

//Show edit campground form
router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, campgrounds.renderEditForm)

module.exports = router;