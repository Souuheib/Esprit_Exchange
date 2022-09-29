const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const catchAsync = require('./utils/catchAsync');
const Campground = require('./models/campground'); 
const { send, nextTick } = require('process');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const localStrategy =require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./models/user'); 



const {campgroundSchema} =require('./schemas.js');

const campgroundRoutes = require('./routes/campgrounds');
const userRoutes = require('./routes/users');

mongoose.connect('mongodb://localhost:27017/esprit-echange' ,{
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
}); 

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs'); // so you can render('index')
app.set('views', path.join(__dirname, 'views')); 

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//setting up session
const sessionConfig = {
    secret: 'thisismysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: Date.now() + 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));

//using flash midd
app.use(flash());

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash middlware
app.use((req,res,next) =>{
    if(!['/login','/'].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//routes
app.use('/campgrounds', campgroundRoutes);
app.use('/',userRoutes)

//public static middleware
app.use(express.static(path.join(__dirname, 'public')));


//try passport 
app.get('/fakeUser', async (req,res) =>{
    const user = new User({email: 'sou@gmail.com', username: 'sou'})
    const newUser = await User.register(user,'chicken');
    res.send(newUser);
})



//joi validation middleware
const validateCampground = (req,res, next) => {
    
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else {
        next();
    }
  

}

app.get('/', (req,res) => {
    //res.send('HELLO FROM YELP')
    res.render('home')
})




//error handling for all paths with *
app.all('*', (req, res, next) =>{
    next(new ExpressError('Page Not Found', 404))
})

 //error handling with middlware
//  app.use((req,res) => {
//     res.status(404).send('NOT FOUND');
//  })
//generic error handler
app.use((err,req,res,nect) =>{
    const { statusCode = 500, message = 'Something went wrong'} = err;
    res.status(statusCode).render('error',{err});
})

app.listen(3000, () => {
    
    console.log('serving on port 3000')
}) 