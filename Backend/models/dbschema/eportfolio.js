var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eportfolioSchema = new Schema({
    iD : {type : Number, required: true},
    userID : { type : Number, required : true},
    templateID : {type : Number},
    data : {type : String},
    title : {type : String, required : true},
    version : {type :String},
    dateCreated : {type : Date},
    dateUpdated : {type : Date},
}, {collection : 'EPortfolios'});

const Eportfolio = mongoose.model('eportfolio', eportfolioSchema);
module.exports = Eportfolio;