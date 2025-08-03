const mongoose = require('mongoose')

const candidateSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    age:{
        type:Number,
        required:true
    },
    party:{
        type:String,
        required:true
    },
    votes:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:true
            },
            votedAt:{
                type: Date,
                defualt:Date.now()
            }
        }
    ],
    voteCount:{
        type:Number,
        default:0
    }
})

const Candidate = mongoose.model('Candidate',candidateSchema)
module.exports = Candidate