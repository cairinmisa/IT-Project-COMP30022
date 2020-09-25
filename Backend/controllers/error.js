const User = require('../models/dbschema/user');


exports.error = (res,string, code) => {
    res.status(code);
    res.send({"error" : string});
}
