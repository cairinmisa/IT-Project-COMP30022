var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var templateSchema = new Schema({
    userID : Number,
    dateCreated : String,
    dateUpdates : String,
    downloadable : Boolean,
    public : Boolean,
    categories : String,
    version : Number,
    comments : String,
    title : String,
    rating : Number,
}, {collection : 'Templates'});

const User = mongoose.model('template', templateSchema);
module.exports = Template;