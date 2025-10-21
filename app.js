const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const {campgroundJoiSchema} = require('./joiSchemas.js');

const app = express();

app.engine('ejs', ejsMate);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('tiny')); //Logs requests (method, url, status code,  size, response size, response time)

//Connect to db
main()
  .then(() => {
    console.log('Connected to DB!')
  })
  .catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/camp-quest');
};

//function used as middleware for campground validation
const validateCampground = (req, res, next) => {
  //Joi Schema
  const { error } = campgroundJoiSchema.validate(req.body);
  if (error) {
    console.log(error);
    const message = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, message);
  }else{
    next();
  }
};

app.get('/', (req, res) => {
  res.render('home');
});

//Index, home show
app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find();
  res.render('campgrounds/index', { campgrounds });
});

//Creating new
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.post('/campgrounds', validateCampground, async (req, res, next) => {
  // if(!req.body.campground) return next(new ExpressError('Invalid campground data', 400));
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});


//Show
app.get('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/show', { campground });
});


//Updating
app.patch('/campgrounds/:id', validateCampground, async (req, res, next) => {
  // if(!req.body.campground) return next(new ExpressError('Invalid campground data', 400));
  const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, { new: true, runValidators: true });
  res.redirect(`/campgrounds/${campground._id}`);
});


//Edit show
app.get('/campgrounds/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
});

//Delete 
app.delete('/campgrounds/:id', async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect('/campgrounds');
});

//fallback route when no route is matched in the requests
app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found!'));
});

//Error handling middleware
//Renders the error page
app.use((err, req, res, next) => {
  const { status = 500, message = 'Something went wrong!' } = err;
  res.status(status).render('error', { err });
});

app.listen(3000, () => {
  console.log('Serving on port 3000');
});