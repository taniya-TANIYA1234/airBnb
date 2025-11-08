const express = require("express");
const app = express();
const mongoose = require("mongoose");
const requests = require('method-override'); 
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");

const listings = require("./routes/listing.js"); 
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash"); 
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine" , "ejs");
app.engine("ejs" , ejsMate);
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname , "/public")));
app.use(requests('_method'));

main()
.then(()=>{
    console.log("connected");
})
.catch((err)=>{
console.log(err);
});


const sessionOptions = {
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
res.locals.currentUser = req.user;
next();
});
// app.get("/demoUser", async (req,res)=>{
// let fakeUser = new User ({
//     email:"student@gmail.com",
//     username:"delta-student"
// });
// let registeredUser =  await User.register(fakeUser , "pass12345");
// res.send(registeredUser);
// });
app.use("/listings", listings );
app.use("/listings/:id/reviews",reviews); 
app.use("/",user);


async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/pnp')
}

app.listen(8000,(req,res)=>{
    console.log("app is listning");
});

app.get("/",(req,res)=>{
    res.send("Hi! User");
});

app.get("/test" , async (req,res)=>{
 let sample = new Listing({
    title : "My Home",
    description : "By the road",
    price : 1200,
    location:"panipat",
    country:"India"
 });
await sample.save();
res.send("saved successfully");
});



app.use((err,req,res,next)=>{
    const {statusCode = 500, message = "Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.render("listings/error.ejs",{err});
});


