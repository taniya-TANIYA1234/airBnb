const { error } = require("console");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");


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

