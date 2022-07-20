const shortid = require('shortid');
const urlModel = require("../model/urlModel")
const server = require("../index")
const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
  19418,
  "redis-19418.c212.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("K9OxQeQuWSr47H7f8z0iUEeSi4kuEy9Z", function (err) {
  if (err) throw err;
});
//redis-19418.c212.ap-south-1-1.ec2.cloud.redislabs.com:19418
redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);




let linkCheck = /^https?\:\/\/([a-zA-Z0-9]+\.)?[a-zA-Z0-9]+\.[a-zA-Z0-9]+\/?[\w\/\-\.\_\~\!\$\&\'\(\)\*\+\,\;\=\:\@\%]+?$/

//-----------------------------------------------------------------------------------------------------------------------------

const createShortUrl = async function (req, res) {
    try {

        const longUrl = req.body.longUrl

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Field cannot be empty" })

        const existingURL= await urlModel.findOne({longUrl:longUrl})
        if (existingURL) return res.status(400).send({ status: false, message: "URL already exists" })

        if (!linkCheck.test(longUrl)) return res.status(400).send({ status: false, message: "Invalid URL. Please enter valid URL" })

        const urlCode = shortid.generate()

        let port = server.serverDetails.runningPort

        const shortUrl = `http://localhost:${port}/${urlCode}`

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

//----------------------------------------------------------------------------------------------------------------------

const getUrl = async function (req, res) {
    try {

        const urlCode = req.params.urlCode
        let urlData = await GET_ASYNC(urlCode)
        // console.log(urlData)
        // console.log(typeof(urlData))
        if(urlData) {
         res.status(302).send(urlData)
       } else {
        let getData = await urlModel.findOne({ urlCode: urlCode }).select({longUrl:1, _id:0})
        if (!getData) return res.status(404).send({ status: false, message: "No data found with this urlCode" })
        await SET_ASYNC(urlCode, JSON.stringify(getData))
   
        // return res.status(302).send({ status: true, data: `Found. Redirecting to ${getData.longUrl}`})
        return res.status(302).redirect(getData.longUrl)
       }

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}



module.exports = { createShortUrl, getUrl }