const shortid = require('shortid');
const urlModel = require("../model/urlModel")

const createShortUrl = async function (req, res) {
    try {
        const longUrl = req.body.longUrl

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
   
        return res.status(302).send({ status: true, data: `Found. Redirecting to ${getData.longUrl}`})

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

module.exports = { createShortUrl, getUrl }