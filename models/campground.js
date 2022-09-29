const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    
        name: String,
        mail: String,
        gender: String,
        dateBirth: Date,
        studentID: String,
        moy: Number,

   
    
    author: {
        type: Schema.Types.ObjectId,
        ref:'User',
    },
});
module.exports = mongoose.model('Campground', CampgroundSchema);