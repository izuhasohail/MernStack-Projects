import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext=createContext({})


export function UserContextProvider({children}){

    const [username,setUsername]=useState(null)
    const [id,setId]=useState(null);
    const getProfile=async()=>{
         axios.get('/profile')
        .then(response=>{
            console.log('Profile response :',response.data)

            setId(response.data.userId)
            setUsername(response.data.username)
            
        })
    }

    useEffect(()=>{
        getProfile();
  
    },[])


    return (
        <UserContext.Provider value={{username,setUsername,id,setId}}>
            {children}
        </UserContext.Provider>
    )
}