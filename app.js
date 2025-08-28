const { error } = require("console");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const requests = require('method-override'); 

const path = require("path");

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));

app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname , "public")));

app.use(requests('_method'));
main()
.then(()=>{
    console.log("connected");
})
.catch((err)=>{
console.log(err);
});


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

app.get("/listings", async (req, res)=>{
const allListings = await Listing.find({});
res.render("listings/index.ejs", { allListings });
});

app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs");
});
app.post("/listings", async (req, res)=>{
    const listings = req.body.listing;

    await Listing.insertOne(listings);
    res.redirect("/listings");
   
});
app.get("/listings/:id/edit", async (req, res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

app.put("/listings/:id/edit", async (req,res)=>{
    const {id} = req.params;
    const updatedListing = req.body.listing;
    await Listing.findByIdAndUpdate(id, updatedListing);
    res.redirect(`/listings`);
});
app.delete("/listings/:id/delete", async (req,res)=>{
   const {id} = req.params;
   await Listing.findByIdAndDelete(id);
   res.redirect("/listings");
});
app.get("/listings/:id", async (req, res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});


