const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner } = require("../middleware.js");





const validationList = (req,res,next)=>{
      let {error} = listingSchema.validate(req.body);
         if(error){
            let errMsg = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
         } else {
            next();
         }
}


router.get("/", async (req, res)=>{
const allListings = await Listing.find({});
res.render("listings/index.ejs", { allListings });
});

router.get("/new",isLoggedIn, (req, res)=>{
  
    res.render("listings/new.ejs");
});

router.post(
    "/",
    isLoggedIn,
    isOwner,
    validationList,
    wrapAsync(async (req, res)=>{
    const listings = new Listing(req.body.listing);
    listings.owner = req.user._id;
    await listings.save();
    req.flash("success","Successfully made a new listing");
    res.redirect("/listings");
   
}));

router.get("/edit/:id",isLoggedIn, async (req, res)=>{
    
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});
router.get("/:id",wrapAsync(async (req, res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");

    res.render("listings/show.ejs", {listing});
}));

router.put("/:id",isLoggedIn,isOwner,async (req,res)=>{
    const {id} = req.params;
    const updatedListing = req.body.listing;
    await Listing.findByIdAndUpdate(id, updatedListing);
    req.flash("success","Successfully updated the listing");
    res.redirect(`/listings`);
});

router.delete("/:id", isLoggedIn,isOwner, async (req,res)=>{
   const {id} = req.params;
   await Listing.findByIdAndDelete(id);
   req.flash("success","Successfully deleted a listing");
   res.redirect("/listings");
});
module.exports = router;