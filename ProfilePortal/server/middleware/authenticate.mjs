import jwt from 'jsonwebtoken'
import User from '../model/userSchema.mjs'
const Authenticate=async(req,res,next)=>{
   console.log('AUTHENTICATE CALLED')
    try{
 
        const token=req.cookies.jwtoken;
        const verifyToken=jwt.verify(token,process.env.SECRET_KEY)

        console.log('TOKEN VERIFIED',verifyToken);

        const rootUser=await User.findOne({
            _id:verifyToken._id,
            "tokens.token":token
        })

        if(!rootUser){
            throw new Error("User not found")
        }

        req.token=token
        req.rootUser=rootUser
        req.UserID=rootUser._id

        next()


    }
    catch(err){
        res.status(401).send('Unauthorized: Not token provided');
        console.log(err);
    }


}

export default Authenticate