const Listing = require("./models/listing.js");

module.exports.isLoggedIn =(req,res,next)=>{
     if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in first!");
        return res.redirect("/login");
     }
    next();
};
module.exports.saveUrl = (req,res,next)=>{
if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
}
next();
}
module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)){
        req.flash("error","You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
};