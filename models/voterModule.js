const mongoose = require('mongoose')

const voterSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    aadharNumber:{
        type:Number,
        required:true,
        uniq:true
    },
    password:{
        type:String,
        required: true
    },
    role:{
        type:String,
        enum:['admin','voter'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false,
    }
})

const Voter = mongoose.model('Voter',voterSchema)
module.exports = Voter 
