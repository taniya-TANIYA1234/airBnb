const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");






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

router.get("/new", (req, res)=>{
    res.render("listings/new.ejs");
});

router.post(
    "/", 
    validationList,
    wrapAsync(async (req, res)=>{
    const listings = new Listing(req.body.listing);
    await listings.save();

    res.redirect("/listings");
   
}));

router.get("/edit/:id", async (req, res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});
router.get("/:id",wrapAsync(async (req, res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));

router.put("/:id",async (req,res)=>{
    const {id} = req.params;
    const updatedListing = req.body.listing;
    await Listing.findByIdAndUpdate(id, updatedListing);
    res.redirect(`/listings`);
});

router.delete("/:id", async (req,res)=>{
   const {id} = req.params;
   await Listing.findByIdAndDelete(id);
   res.redirect("/listings");
});
module.exports = router;