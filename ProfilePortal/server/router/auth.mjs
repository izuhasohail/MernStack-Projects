import express from 'express'
import User from '../model/userSchema.mjs';
import bcrypt from 'bcryptjs'
import Authenticate from '../middleware/authenticate.mjs';
const router=express.Router();
router.get('/',(req,res)=>{
    res.send(`Hello World from the Auth.mjs`);
    
});

//using promies
// router.post('/register',(req,res)=>{
//     console.log(req.body.name+" "+req.body.email);

//     const {name,email,password,cpassword,phone,work}=req.body;

//     if(!name || !email || !password || !cpassword ||!phone ||!work){
//         return res.status(422).json({
//             error:'ALL FIELDS ARE REQUIRED'
//         })
//         /* 400-499 are the client side errors */
//     }

//     User.findOne({email})
//     .then((userExist)=>{
//         if(userExist){
//             return res.status(422).json({error:'Email already exists'})
//         }

         //if key:value are same -> name:name , then simply we can write ->name
//          const user=new User({name,email,password,cpassword,phone,work})

//         user.save().then(()=>{
//         res.status(201).json({
//             message:`User: ${name}  created successfully`
//         })
        
//     }).catch((err)=>res.status(500).json({
//         error:`Failed to register : ${err}`
//     }))



//     })
//     .catch(err=>res.status(500).json(err=>console.log(err)))

    

// });


//using async-await

router.post('/register',async(req,res)=>{
    const {name,email,password,cpassword,phone,work}=req.body;

         if(!name || !email || !password || !cpassword ||!phone ||!work){
         return res.status(422).json({
             error:'ALL FIELDS ARE REQUIRED'
           })
         /* 400-499 are the client side errors */
        }

        try{

            const userExists=await User.findOne({email});

            if(userExists){
                return res.status(422).json({
                    error:'Email already exsits'
                })
            }
            else if(password != cpassword){
                return res.status(422).json({
                    message:'password are not matched'
                })
            }
            else{
                const user=new User({name,email,password,cpassword,phone,work});
                const registeredUser=await user.save();

                console.log(registeredUser);

            if(registeredUser){
                res.status(201).json({
                    message:`User : '${email}' created successfully!!`
                })
            }

            }

            
        }
        catch(error){
            console.log(error);
            res.status(500).json({
                error:error
            })
        }
});


//login route

router.post('/signin',async(req,res)=>{
    console.log(req.body);
    const {email,password}=req.body;

    try{
        if(!email || !password){
            return res.status(400).json({
                message:"ALL FIELDS ARE FREQUIRED"
            })
        }

        const userLogin= await User.findOne({email});
        const token=await userLogin.generateAuthToken();
        console.log('THE TOKEN GENERATED IS ',token);

        res.cookie("jwtoken",token,{
            expires:new Date(Date.now()+2589200000),
            httpOnly:true,
            // sameSite: 'none',
            // secure: true
            //30*24*60*60*60=2589200000 millisec=30 days
        })

        //console.log("HERE'S MY COOKIE: ",cookie);

        if(userLogin){
            const isMatch=await bcrypt.compare(password,userLogin.password)


            if(!isMatch){
               res.send(400).json({
                error:'Incorrect Credentials'
               })
                
            }
            else{
                 res.status(200).json({
                    message:'User Signed In Successfully'
                })
            }
        }
        else{
            res.status(400).json({
                error:'Invalid Credentials'
            })
        }

       
       



    }
    catch(error){

    }


});

//ABOUT PAGE

router.get('/about',Authenticate,(req,res)=>{
    console.log('About Page')
    res.send(req.rootUser);
})

//CONTACT PAGE

router.get('/contact',Authenticate,(req,res)=>{
    console.log('Contact Page Called');
    res.send(req.rootUser);
})

//MESSAGE FROM CONTACT PAGE
router.post('/message',Authenticate,async(req,res)=>{
  try{
      const {name,email,phone,message}=req.body;

      if(!name || !email || !phone || !message){
        console.log('Error in response form')
        return res.json({
            error:"PLz fill all the fields"
        })
      }

      const userContact=await User.findOne({_id:req.UserID});//remember we added this in AUthenticate method
      if(userContact){
        const userMessgae=await userContact.addMessage(name,email,phone,message)

        await userContact.save()

        res.status(201).json({
            message:"Message added successfully"
        })
      }
  }
  catch(err){
    console.log(err)
  }


});


//HOME PAGE
router.get('/home',Authenticate,(req,res)=>{
  console.log('HOME PAGE CALLED')
  res.send(req.rootUser);
})

//LOGOUT FUNCTIONALITY

router.get('/logout',(req,res)=>{
    console.log('Hello logout Page')
    res.clearCookie('jwtoken',{path:'/'})
    res.status(200).send('User loggedOut');
})


export default router