const mongoose = require("mongoose");
const Data = require("./data.js");
const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/pnp");
}

main()
.then(()=>{
    console.log("connect to initialize data");
})
.catch((err)=>{
    console.log(err);
});

const initDB = async ()=>{
 await Listing.deleteMany({});
 await Listing.insertMany(Data.data);
 console.log("data was initialized");
}

initDB();