const express = require('express');
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
res.render("users/signup.ejs");
});
router.post("/signup",wrapAsync(async(req,res)=>{
    try{
  let {username , email , password} = req.body;
   const newUser = new User({email,username});
  const registeredUser = await User.register(newUser , password );
  req.login(registeredUser,(err)=>{
    if(err){ return next(err);}
    req.flash("success","Welcome to Searching Place");
res.redirect("/listings");
  });

    } catch (e) {
        req.flash("error", "already registered");
        res.redirect("/signup");
    }
  
}));
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})
router.post("/login",saveUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res,next)=>{
req.flash("success","welcome back!");
res.redirect(res.locals.redirectUrl||"/listings");
});
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Goodbye!");
        res.redirect("/listings");
    });
});
module.exports = router;