const express = require("express");
const router = express.Router();

router.get('/', (req, res)=> {
    res.header('Content-Type', 'text/html').send("<html>Registration Page</html>");
})

module.exports = router;