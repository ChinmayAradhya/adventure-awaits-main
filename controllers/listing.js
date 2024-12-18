const Listing = require('../models/listing.js');

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path : 'reviews',
        populate : {
            path : 'author'
        }
    })
    .populate('owner');
    // console.log(listing);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect('/listings')
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    // console.log(url, "...", filename);
    req.flash("success", "New Listing Created!");
    res.redirect('/listings');
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect('/listings')
    }
    res.render('listings/edit.ejs', { listing });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    // if (!req.body.listing) {
    //     throw new ExpressError(400, 'Send valid data for listing')
    // }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });    //destruct and create new listing
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listings');
}