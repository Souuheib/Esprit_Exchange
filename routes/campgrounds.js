const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');


const passport = require('passport');
const flash = require('connect-flash');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')



router.get('/', catchAsync(async (req,res) => {
    
    const campgrounds = await Campground.find();
    res.render('campgrounds/index',{campgrounds}); //{campgrounds} is to use campgrounds in rendered index.ejs
}))

//this one should be placed before router.get('/campgrounds/:id' , otherwise it will be taken as an id 
router.get('/new', isLoggedIn , (req,res) => {
    
    res.render('campgrounds/new')
})
// route for submitting the new campground form
router.post('/',  validateCampground, catchAsync( async (req,res,next) =>{
    const campground = new Campground(req.body.campground); //by default res.body is empty, that's why we should to router.use(express.urlencoded({extended: true}))
    campground.author = req.user._id;
    await campground.save();
    //console.log(req.body.campground)
    req.flash('success', 'Merci pour votre postulation !! ');
    res.redirect(`/campgrounds/${campground._id}`);
}))

// catchAsync is for catching async errors
//render the campgrounds by id
router.get('/:id',isLoggedIn, catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id).populate('author');
    console.log(campground)
    res.render('campgrounds/show',{campground});
}))

//UPDATE
router.get('/:id/edit',isAuthor ,catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Cannot find student');
        return res.redirect(`/campgrounds`)
    }
    res.render('campgrounds/edit',{campground});
}))

router.put('/:id', isAuthor, validateCampground,  catchAsync(async (req,res) =>{
    const {id} = req.params;
    
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    res.redirect(`/campgrounds/${campground._id}`);
}))

//DELETE
router.delete('/:id',isAuthor ,catchAsync(async (req,res) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    
     await Campground.findByIdAndDelete(id);  
     res.redirect('/campgrounds');
}))

module.exports = router ;