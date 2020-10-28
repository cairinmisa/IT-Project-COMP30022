var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

// Generates random string of specified length
function generateID(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 

// Route for uploading images
router.post('/', multipartMiddleware, function(req, res) {
    var fs = require('fs');
    fs.readFile(req.files.upload.path, function (err, data) {
        // Generate unique file name
        var newID = generateID(20)
        var newPath = __dirname + '/../public/uploads/' + newID + req.files.upload.name;

        // Write the file to the system
        fs.writeFile(newPath, data, function (err) {
            if (err)  {
                console.log({err: err})
                res.send({error:"Error"});
            }
            else {
                // Send back url to the stored image
                res.send({"url": "http://localhost:8000/uploads/"+ newID + req.files.upload.name});
            }
        });
    });
});

module.exports = router;