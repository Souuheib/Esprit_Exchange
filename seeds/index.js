
const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp' ,{
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
}); 

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample= array => array[Math.floor(Math.random() * array.length)];

const seeDB = async () => {
    await Campground.deleteMany({});
    // const c = new Campground({title: 'purple field'});
    // await c.save();
    for (let i= 0; i< 50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campground({
            author:'6311f44ed9c8e0e935519a2b',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title:  `${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum quaerat a enim debitis deleniti at, quod necessitatibus repellat quo reiciendis sed ad eaque doloremque, quia porro veritatis. Ad, assumenda minus?' 
        })
        await camp.save();

    }
}

seeDB().then(() =>{
    mongoose.connection.close();
});