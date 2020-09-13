var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eportfolioSchema = new Schema({
    iD : {type : Number, required: true},
    userID : Number,
    templateID : Number,
    title : String,
    version : String,
    dateCreated : {type : Date, required: true},
    dateUpdated : {type : Date, required: true},
}, {collection : 'EPortfolios'});

const Eportfolio = mongoose.model('eportfolio', eportfolioSchema);
module.exports = Eportfolio;