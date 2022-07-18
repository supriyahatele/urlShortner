const shortid = require('shortid');
// const validUrl = require('valid-url');
const urlModel = require("../model/urlModel")


// let linkCheck = /(https?:\/\/.*\.)/i
let linkCheck = /^https?\:\/\/([a-zA-Z0-9]+\.)?[a-zA-Z0-9]+\.[a-zA-Z0-9]+\/?[\w\/\-\.\_\~\!\$\&\'\(\)\*\+\,\;\=\:\@\%]+?$/

const createShortUrl = async function (req, res) {
    try {

        const longUrl = req.body.longUrl

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Field cannot be empty" })

        const existingURL= await urlModel.findOne({longUrl:longUrl})
        if (existingURL) return res.status(400).send({ status: false, message: "URL already exists" })

        // if (!validUrl.isUri(longUrl)) return res.status(400).send({ status: false, message: " Please enter valid URL" })
        if (!linkCheck.test(longUrl)) return res.status(400).send({ status: false, message: "Invalid URL. Please enter valid URL" })

        const urlCode = shortid.generate(longUrl)

        const shortUrl = "http://localhost:3000/"+ urlCode

        const data = { longUrl, shortUrl, urlCode }

        const saveData= await urlModel.create(data)

        const resData = {
            longUrl: saveData.longUrl,
            shortUrl: saveData.shortUrl,
            urlCode: saveData.urlCode}

        return res.status(201).send({ status: true, data: resData })



    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}



const getUrl = async function (req, res) {
    try {

        const urlCode = req.params.urlCode

        let getData = await urlModel.findOne({ urlCode: urlCode }).select({longUrl:1, _id:0})

        if (!getData) return res.status(404).send({ status: false, message: "No data found with this urlCode" })
   
        return res.status(302).send({ status: true, data: `Found. Redirecting to ${getData.longUrl}`})

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

module.exports = { createShortUrl, getUrl }