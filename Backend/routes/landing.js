const express = require("express");
const router = express.Router();

router.get('/', (req, res)=> {
    res.header('Content-Type', 'text/html').send("<html>LANDING PAGE :)</html>");
})

module.exports = router;