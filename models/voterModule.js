const mongoose = require('mongoose')
const bycrypt = require('bcrypt');


const voterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [1, "Name cannot be empty"]
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
        min: [18, "Age must be at least 18"]  // example rule
    },
    aadharNumber: {
        type: Number,
        required: [true, "Aadhar number is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    role: {
        type: String,
        enum: ["admin", "voter"],
        default: "voter"
    },
    isVoted: {
        type: Boolean,
        default: false
    }
});



voterSchema.pre('save', async function(next) {
    try {
        const candidateData = this;
        if(!candidateData.isModified('password')) return next();

        // Hash the password before saving
        const salt = await bycrypt.genSalt(10);
        const hashpassword = await bycrypt.hash(candidateData.password,salt);
        candidateData.password = hashpassword;
        next();
    } catch (error) {
        next(error)       
    }
})


voterSchema.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch = await bycrypt.compare(candidatePassword,this.password)
        return isMatch;
    }catch(error){
        throw new Error(error);
    }
}
const Voter = mongoose.model('Voter',voterSchema)
module.exports = Voter 
