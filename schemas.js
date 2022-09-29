const Joi = require('joi');

//this schema is for the server side input control // a pattern for a JS object
//schema for joi validation middleware
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        name: Joi.string().required(),
        // price: Joi.number().required().main(0),
        mail: Joi.string().required(),
        gender: Joi.string().required(),
        dateBirth: Joi.date().required(),
        studentID: Joi.string().required(),
        moy: Joi.number().greater(10).required(),

        // the email joi control is to be done here 
    }).required()
})

