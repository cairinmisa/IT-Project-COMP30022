var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eportfolioSchema = new Schema({
    eportID : {type : Number, required : true},
    userID : { type : Number, required : true},
    templateID : {type : Number},
    isPublic : {type : String},
    data : {type : String},
    title : {type : String, required : true},
    isLatest : {type : String},
    version : {type :Number},
    dateCreated : {type : Date},
    dateUpdated : {type : Date},
}, {collection : 'EPortfolios'});

const Eportfolio = mongoose.model('eportfolio', eportfolioSchema);
module.exports = Eportfolio;