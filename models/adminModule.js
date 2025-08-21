const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Name is required"],
        trim:true,
        minlength:[1, "Name cannot be empty"]
    },
    age:{
        type:Number,
        required:[true, "Age is required"],
        min:[18, "Age must be at least 18"]  // example rule
    },
    party:{
        type:String,
        required:[  true, "Party is required"],
        trim:true,
        minlength:[1, "Party cannot be empty"]
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

