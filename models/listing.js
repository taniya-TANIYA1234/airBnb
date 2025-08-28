const mongoose = require("mongoose");

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
    country : String
});
const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing; 