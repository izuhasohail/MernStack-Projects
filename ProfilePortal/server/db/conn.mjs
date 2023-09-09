import mongoose from "mongoose";

const conn=async()=>await mongoose.connect(process.env.DATABASE_URI)
        .then(()=>{
            console.log('Connection Successful!!!')
        })
        .catch((error)=>{
            console.log(error)
        })

export default conn