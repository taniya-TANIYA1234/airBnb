const mongoose = require("mongoose");
const Review = require("./review.js");
const User = require("./user.js");

const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    imageUrl : {
        type : String,
        set:(v) =>v===" "?"https://plus.unsplash.com/premium_photo-1749751600727-3fb5c8af5c29?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDF8Ym84alFLVGFFMFl8fGVufDB8fHx8fA%3D%3D" 
        : v,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing; 