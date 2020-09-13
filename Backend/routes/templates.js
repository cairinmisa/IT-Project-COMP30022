const express = require("express");
const router = express.Router();

router.get('/', (req, res)=> {
    res.header('Content-Type', 'text/html').send("<html>Create a new template here</html>");
})

module.exports = router;