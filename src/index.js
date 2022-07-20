const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());



let url = "mongodb+srv://supriyahatele:vE25ShJqu2IFbCtY@cluster0.qldb2.mongodb.net/group72Database"
mongoose.connect(url, {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


app.use('/', route)



const serverDetails= {
    runningPort: process.env.PORT || 4000
}

app.listen(serverDetails.runningPort, function () {
    console.log('Express app running on port ' + (serverDetails.runningPort))
});

module.exports.serverDetails = serverDetails



