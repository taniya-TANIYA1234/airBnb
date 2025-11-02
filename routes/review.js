const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewschema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const validationReview = (req,res,next)=>{
      let {error} = reviewschema.validate(req.body);
         if(error){
            let errMsg = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
         } else {
            next();
         }
      }

router.post("/",
    validationReview,
   wrapAsync(async (req,res)=>{
    
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Successfully added a review");
    res.redirect(`/listings/${listing._id}`);
})
);
router.delete("/:reviewid", wrapAsync(async (req,res)=>{
    const {id, reviewid} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}});
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/listings/${id}`);
}));

module.exports = router; 