const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');

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
  await Review.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '69047f1d7b687bf94fe902fc',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: 'https://res.cloudinary.com/drhm7ccan/image/upload/v1762328915/Camp%20Quest/ajshyssaoojy2w5pw7nb.jpg',
          filename: 'Camp Quest/ajshyssaoojy2w5pw7nb'
        },
        {
          url: 'https://res.cloudinary.com/drhm7ccan/image/upload/v1762328915/Camp%20Quest/gdtni00fy0py0ugfdnwa.jpg',
          filename: 'Camp Quest/gdtni00fy0py0ugfdnwa'
        },
        {
          url: 'https://res.cloudinary.com/drhm7ccan/image/upload/v1762328915/Camp%20Quest/jgi0tdm8rvuxfwkvvbb6.jpg',
          filename: 'Camp Quest/jgi0tdm8rvuxfwkvvbb6'
        }
      ],
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto tenetur laudantium labore cupiditate, optio, illum, asperiores quisquam tempora in quam corporis neque! Nesciunt nostrum eveniet ipsa, molestias alias labore laborum.',
      price
});
await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
})