var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var templateSchema = new Schema({
    userID : {type : Number, required : true},
    dateCreated : {type : Date, required: true},
    dateUpdated : {type : Date, required: true},
    downloadable : Boolean,
    public : {type : Boolean, required : true},
    categories : {type : String, required : true},
    version : Number,
    comments : String,
    title : String,
    rating : Number,
}, {collection : 'Templates'});

const Template = mongoose.model('template', templateSchema);
module.exports = Template;