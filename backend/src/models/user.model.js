import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    clerkId: { type: String, required: true, unique: true },
    name : {
        type : String,
        
    },
    email : {
        type : String,
        required : true,
        unique : true
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