import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    tokenBalance: {
      type: Number,
      default: 3,
      min: 0,
    },

},{
    timestamps : true
})

const User = mongoose.model('User', userSchema);

export default User;