const express = require('express');
const router = express.Router();
const { createShortUrl, getUrl } = require("../controllers/shortUrl")


router.post("/url/shorten", createShortUrl)
router.get("/:urlCode", getUrl)


router.all("/*", function (req, res) {
    res.status(400).send({ status: false, message: "This URL is not valid" })
})


module.exports = router;