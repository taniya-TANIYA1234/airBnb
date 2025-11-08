const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const express = require("express"); 
const { reviewschema,listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn =(req,res,next)=>{
     if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in first!");
        return res.redirect("/login");
     }
    next();
};
module.exports.saveUrl =(req,res,next)=>{
if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
}
next();
}
module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("owner");
    console.log("listing:", listing);
console.log("listing.owner:", listing?.owner);
console.log("req.user:", req.user);
    if(!listing.owner[0]._id.equals(req.user._id)){
       req.flash("error","You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewer = async (req,res,next)=>{
    let {id,reviewid} = req.params;
    const review = await Review.findById(reviewid).populate("reviewer");
    if(!review.reviewer._id.equals(req.user._id)){
       req.flash("error","You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validationList = async(req,res,next)=>{
      let {error} = listingSchema.validate(req.body);
         if(error){
            let errMsg = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
         } else {
            next();
         }
}

module.exports.validationReview = async(req,res,next)=>{
      let {error} = reviewschema.validate(req.body);
         if(error){
            let errMsg = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
         } else {
            next();
         }
      }