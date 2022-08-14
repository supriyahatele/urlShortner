const shortid = require('shortid');
const urlModel = require("../model/urlModel")
const redis = require("redis");   //to connect with redis db

const { promisify } = require("util");
//Connects to redis
const redisClient = redis.createClient(
  19418,//port
  "redis-19418.c212.ap-south-1-1.ec2.cloud.redislabs.com", //kinda cluster
  { no_ready_check: true }
);
//password
redisClient.auth("K9OxQeQuWSr47H7f8z0iUEeSi4kuEy9Z", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


/* /^[A-Za-z 0-9]+$*/
/*.to.*/ 
/^[0-9]{3,6}$/
let linkCheck = /^https?\:\/\/([a-zA-Z0-9]+\.)?[a-zA-Z0-9]+\.[a-zA-Z0-9]+\/?[\w\/\-\.\_\~\!\$\&\'\(\)\*\+\,\;\=\:\@\%]+?$/

//-----------------------------------------------------------------------------------------------------------------------------

const createShortUrl = async function (req, res) {
    try {

        const longUrl = req.body.longUrl

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Field cannot be empty" })

        const existingURL= await urlModel.findOne({longUrl:longUrl}).select({longUrl:1,shortUrl:1,urlCode:1,_id:0})
        if (existingURL) return res.status(400).send({ status: true, data:existingURL })

        if (!linkCheck.test(longUrl)) return res.status(400).send({ status: false, message: "Invalid URL. Please enter valid URL" })

        const urlCode = shortid.generate()

  

        const shortUrl = `http://localhost:3000/${urlCode}`

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
        if(urlData) {

          let obj=JSON.parse(urlData)
          // console.log(obj.longUrl)
          return res.status(302).redirect(obj.longUrl)//chache hit
       } else {
        let getData = await urlModel.findOne({ urlCode: urlCode }).select({longUrl:1, _id:0})  //chache miss
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