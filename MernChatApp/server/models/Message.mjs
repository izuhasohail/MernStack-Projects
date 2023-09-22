import mongoose from "mongoose";

const messageSchema=mongoose.Schema(
    {
        sender:{
            type:mongoose.Schema.Types.ObjectId, ref:'User'
        },
        recipient:{
            type:mongoose.Schema.Types.ObjectId, ref:'User'

        },
        text:{
            type:String
        },
        file:{
            type:String
        }
    },{
        timestamps:true
    }
)

const Message=mongoose.model('Message',messageSchema);

export default Message