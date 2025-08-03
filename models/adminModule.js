const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
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

const Admin = mongoose.model('Admin',adminSchema)
module.exports = Admin

