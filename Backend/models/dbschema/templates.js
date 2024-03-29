var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var templateSchema = new Schema({
    userID : {type : Number, required : true},
    templateID : {type : Number, required : true},
    dateCreated : {type : Date, required: true},
    dateUpdated : {type : Date, required : true},
    isPublic : {type : String, required : true},
    category : {type : String, required : true},
    data : String,
    comments : String,
    title : String,
    rating : Number,
    ratingTotal : Number,
    ratedUsers : [[Number]],
}, {collection : 'Templates'});

const Template = mongoose.model('template', templateSchema);
module.exports = Template;