const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));


main()
.then(() => {
  console.log('Connected to DB!')
})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/camp-quest');
};

app.get('/', (req, res) => {
  res.render('home');
});


app.listen(3000, () => {
  console.log('Serving on port 3000');
});