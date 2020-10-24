var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


function generateID(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 


router.post('/', multipartMiddleware, function(req, res) {
    var fs = require('fs');
    console.log(req.files.upload.path)
    fs.readFile(req.files.upload.path, function (err, data) {
        var newID = generateID(20)
        var newPath = __dirname + '/../public/uploads/' + newID + req.files.upload.name;
        fs.writeFile(newPath, data, function (err) {
            if (err)  {
                console.log({err: err})
                res.send({error:"Error"});
            }
            else {
                // html = "";
                // html += "<script type='text/javascript'>";
                // html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
                // html += "    var url     = \"/uploads/" + req.files.upload.name + "\";";
                // html += "    var message = \"Uploaded file successfully\";";
                // html += "";
                // html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
                // html += "</script>";
                res.send({"url": "http://localhost:8000/uploads/"+ newID + req.files.upload.name});
            }
        });
    });
});

module.exports = router;