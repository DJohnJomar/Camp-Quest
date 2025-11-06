const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const maptilerClient = requrie('@maptiler/client')
maptiler.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find();
  res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
 
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  campground.images =  req.files.map( function(file) {
    return {url:file.path, filename: file.filename}
  })
  await campground.save();
  req.flash('success', 'Successfuly Created New Campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate({path: 'reviews',populate: {path: 'author'}}).populate('author');
  if (!campground) {
    req.flash('error', 'Campground Not Found!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
}

module.exports.updateCampground = async (req, res, next) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, { new: true, runValidators: true });
  const imgs = req.files.map( function(file) {
    return {url:file.path, filename: file.filename}
  })
  campground.images.push(...imgs);
  await campground.save();
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({$pull: {images:{filename:{$in : req.body.deleteImages}}}});
  }
  req.flash('success', 'Successfuly Updated Campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash('error', 'Campground Not Found!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
}

module.exports.deleteForm = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash('success', 'Campground Deleted Successfully!');
  res.redirect('/campgrounds');
}