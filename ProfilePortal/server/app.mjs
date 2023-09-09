import express from 'express'
import { config } from 'dotenv';
import conn from './db/conn.mjs';
import router from './router/auth.mjs';
import cors from 'cors'
import Authenticate from './middleware/authenticate.mjs';
import cookieParser from 'cookie-parser';
config();

const app=express();
const PORT=process.env.PORT;

conn();//connecting to the database

app.use(cookieParser())
//cors
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000",
}))

app.use(express.json())/*data we r receiving is in json format
by using express.json our data is being converted into an object 
*/


//linking the router
app.use(router)


// app.get('/about',(req,res)=>{
//     console.log('About Page')
//     res.send('Welcome to the about')
// })

// app.get('/contact',Authenticate,(req,res)=>{
//     res.cookie("testCookie",'zuha');
//     res.send('Welcome to the contacts')
// })


// app.get('/signin',(req,res)=>{
//     res.send('Welcome to the SignIN')
// })

// app.get('/signup',(req,res)=>{
//     res.send('Welcome to the SignUP')
// })

app.listen(PORT,()=>{
    console.log(`Server Running on port ${PORT}`)
})