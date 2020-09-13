var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eportfolioSchema = new Schema({
    iD : Number,
    userID : Number,
    templateID : Number,
    title : String,
    version : String,
    dateCreated : String,
    dateUpdated : String,
}, {collection : 'EPortfolios'});

const Eportfolio = mongoose.model('eportfolio', eportfolioSchema);
module.exports = Eportfolio;