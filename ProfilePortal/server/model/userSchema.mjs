import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    date:{
      type:Date,
      default:Date.now
    },
    messages:[
      {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        phone:{
            type:Number,
            required:true
        },
        message:{
            type:String,
            required:true
        }
      }
    ],
    phone:{
        type:Number,
        required:true
    },
    work:{
        type:String,
        required:true
    },
    tokens:[
        {
          token:{
            type:String,
            required:true
          }
        }
    ]

})





//hashing password
userSchema.pre('save',async function(next){
    console.log('Pre method called');
      if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,12);
        this.cpassword=await bcrypt.hash(this.cpassword,12);
      }
      next()
});


//generating jwt token
userSchema.methods.generateAuthToken=async function(){
    /* this keyword doesn't work with flat arrow function
    , that's why we r using the regular javascript ftn */
    console.log('Token Method Called')
    try{
        let token=jwt.sign({
            _id:this._id
        },process.env.SECRET_KEY)

        /*jwt.sign(payload,secretOrPrivateKey,[options])
        payload must be unique--> we can use _id */

        this.tokens=this.tokens.concat({
            token:token
        });

        await this.save();//imp
        return token;
    }
    catch(err){
          console.log(err)
    }
}

//store new messages
userSchema.methods.addMessage=async function(name,email,phone,message){
    try{

        console.log('ADD MESSAGE CALLED')
        this.messages=this.messages.concat({
            name,
            email,
            phone,
            message
        });

        await this.save();

        return this.messages;

    }
    catch(error){
    
        console.log(error)
    }
}

//collection creation
const User=mongoose.model('USER',userSchema);
export default User;
