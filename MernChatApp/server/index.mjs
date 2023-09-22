import express from 'express'
import { config } from 'dotenv';
import conn from './db/conn.mjs';
import cors from 'cors'
import User from './models/User.mjs';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import cookieParser from 'cookie-parser';
import { WebSocketServer } from 'ws';
import Message from './models/Message.mjs';
import fs from 'fs'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname=dirname(fileURLToPath(import.meta.url));
config();
//connect to db
conn();

const app=express();
app.use('/uploads',express.static(__dirname+'/uploads'))
app.use(cookieParser())
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}))
app.use(express.json())

async function getUserDataFromRequest(req){

    return new Promise((resolve,reject)=>{

        try{
            const token=req.cookies?.token;
        if(token){
            jwt.verify(token,process.env.SECRET_KEY,{},(err,userData)=>{
                if(err) throw err;
                resolve(userData)
             })
        }
        else{
            reject('no token')
        }
    
        }
        catch(err){
            console.log(err)
        }

    })


   
}

app.get('/',(req,res)=>{
   res.json('test ok')
})

app.get('/messages/:userId',async(req,res)=>{
    const {userId}=req.params;
    const userData=await getUserDataFromRequest(req);
    const ourUserId=userData.userId;
    const messages=await Message.find({
        sender:{$in:[userId,ourUserId]},
        recipient:{$in:[userId,ourUserId]},
    }).sort({createdAt:1});//desc

    res.json(messages)

});

app.get('/people',async(req,res)=>{
    const users=await User.find({},{'_id':true,username:true});
    res.json(users);
})

app.get('/profile',(req,res)=>{
    try{
        const token=req.cookies?.token;
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,{},(err,userData)=>{
            if(err) throw err;
            res.json(userData);
         })
    }
    else{
        res.status(401).json('no token')
    }

    }
    catch(err){
        console.log(err)
    }
    
})
app.post('/register',async(req,res)=>{
    let{username,password}=req.body;
    // Check if the username already exists in the database
    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    const salt=await bcrypt.genSalt(12);
    const  hashedPassword= await bcrypt.hash(password,salt);

     try{

        const createdUser=await User.create(
            {
                username:username,
                password:hashedPassword
            })


        jwt.sign({ userId: createdUser._id ,username}, process.env.SECRET_KEY, (err, token) => {
             if (err) throw err;
     
             res.cookie('token', token,
             {expires:new Date(Date.now()+25920000),httpOnly:true,sameSite:'none',secure:true})
             .status(201).json({
                 _id:createdUser._id
             });
             //samesite and secure options are necessary so that on refreshing the page
             //user will still be logged in
     
             //5*24*60*60*60=25920000 milisec=5 days
         })
         
     }
     catch(err){
        if(err) throw err;
        res.status(500).json('error')
     }

   
   
})


app.post('/login',async(req,res)=>{
    const {username,password}=req.body;

    const foundUser=await User.findOne({username});

    if(foundUser){
        const passOk=bcrypt.compare(password,foundUser.password)
        if(passOk){
            jwt.sign({userId:foundUser._id,username},process.env.SECRET_KEY,{},(err,token)=>{
                res.cookie('token',token,{
                    expires:new Date(Date.now()+25920000),
                    httpOnly:true,
                    sameSite:'none',
                    secure:true
                }).status(201).json({
                    id:foundUser._id
                })
            })
        }
    }
    


});

app.post('/logout',(req,res)=>{
    res.cookie('token','',{sameSite:'none',secure:true}).json('ok')
})

const server=app.listen(4000,()=>{
    console.log('Server running on port 4000')
})

//web socket server
const wss=new WebSocketServer({server});

wss.on('connection',(connection,req)=>{

    function notifyAboutOnlinePpl(){
        //notify everyone about the online people(when someone connects)
    [...wss.clients].forEach(client=>{
        client.send(JSON.stringify(
        { 
            online:[...wss.clients].map(c=>(
                {
                    userId:c.userId,
                    username:c.username
                }
            ))
        }
        ));

    });
    }


    connection.isAlive=true;

    connection.timer=setInterval(()=>{
        connection.ping();
        connection.deathTimer=setTimeout(() => {
            connection.isAlive=false;
            clearInterval(connection.timer);
            connection.terminate();
            notifyAboutOnlinePpl();
            console.log('dead')
        }, 1000);
    },5000);


    connection.on('pong',()=>{
        //console.log('pong');
        clearTimeout(connection.deathTimer);
    })

    //read username and id from the cookie for this connection
    const cookies=req.headers.cookie;
    if(cookies){
        //if there many cookies
       const tokenCookieString=  cookies.split(';').find(str=>str.startsWith('token='));
       //console.log('Token String : ',tokenCookieString);
       if(tokenCookieString){
        const token=tokenCookieString.split('=')[1];


        if(token){
           // console.log('\nToken: ',token);
            jwt.verify(token,process.env.SECRET_KEY,{},(err,userData)=>{
                if(err) throw err;
                
                const {userId,username}=userData;

                connection.userId=userId;
                connection.username=username;
 
            })
        }
       }
    }


    connection.on('message',async(message)=>{
        const messageData=JSON.parse(message)
        const {recipient,text,file}=messageData;
        let filename=null;

        if(file){
            //console.log({file});
            const parts=file.name.split('.');
            const extension=parts[parts.length-1];
            filename=Date.now()+'.'+extension;
            const path=__dirname+'/uploads/'+filename;
            //data is base65 encoded... so we have to decode it 
            const buffterData=new Buffer(file.data.split(',')[1],'base64');
        
            fs.writeFile(path,buffterData,()=>{
                console.log('File Saved! '+path)
            })

        }


        if(recipient && (text || file)){

            //adding message to the database
            const messageDoc=await Message.create(
                {
                    sender:connection.userId,
                    recipient,
                    text,
                    file:file ? filename : null,
                }
            );


            [...wss.clients]
            .filter(c=>c.userId===recipient)
            .forEach(c=>c.send(
                JSON.stringify(
                    {
                        text,
                        sender:connection.userId,
                        _id:messageDoc._id,
                        file:file ? filename : null,
                        recipient
                    
                    }
                    )
            ))
        }
    })


  //  console.log([...wss.clients].map(c=>c.username));
    notifyAboutOnlinePpl();
     

    

});



