import mongoose from "mongoose";

const conn=async()=>{
   await mongoose.connect(process.env.DATABASE_URI)
   .then(()=>{
    console.log('Connection to db successful')
   })
   .catch((err)=>{
    console.log(err);
   })
}

export default conn