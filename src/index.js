const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


let url = "mongodb+srv://supriyahatele:vE25ShJqu2IFbCtY@cluster0.qldb2.mongodb.net/group72Database"
mongoose.connect(url, {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


app.use('/', route)

// app.all('*', function (req, res) {
//     throw new Error("Bad Request");
// })

// app.use(function (e, req, res, next) {
//     if (e.message == "Bad Request") return res.status(400).send({ error: e.message });

// })
const serverDetails= {
    localPort: 4000
}

app.listen(process.env.PORT || serverDetails.localPort, function () {
    console.log('Express app running on port ' + (process.env.PORT || serverDetails.localPort))
});

module.exports.serverDetails = serverDetails



