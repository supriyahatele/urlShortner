const mongoose = require('mongoose')

const urlschema = new mongoose.Schema({
   
    urlCode:{
        type:String,
        require:true,
        trim:true,
        unique:true,
        lowercase: true
    },
    longUrl:{
        type:String,
        require:true,
        unique:true,
        trim:true,
    },
    shortUrl:{
        type:String,
        require:true,
        unique:true,
        trim:true,
        lowercase: true
    }


}, { timestamps: true })

module.exports = mongoose.model('url',urlschema )