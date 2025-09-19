const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

main()
  .then(() => {
    console.log('Connected to DB!')
  })
  .catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/camp-quest');
};

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://picsum.photos/400?random=${Math.random()}`,

      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto tenetur laudantium labore cupiditate, optio, illum, asperiores quisquam tempora in quam corporis neque! Nesciunt nostrum eveniet ipsa, molestias alias labore laborum.',
      price 
    });
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
})