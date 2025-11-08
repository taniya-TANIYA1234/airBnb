const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewschema,listingSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,validationReview,isReviewer} = require("../middleware.js");


router.post("/",
    validationReview,
    isLoggedIn,
   wrapAsync(async (req,res)=>{
    
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
   newReview.reviewer = req.user._id;
    console.log("newReview:", newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Successfully added a review");
    res.redirect(`/listings/${listing._id}`);
})
);
router.delete("/:reviewid",
    isLoggedIn,
    isReviewer,
    wrapAsync(async (req,res)=>{
    const {id, reviewid} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}});
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/listings/${id}`);
}));

module.exports = router; 