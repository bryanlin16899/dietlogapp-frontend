"use client";
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
                                                                                                                                                        
 interface UserInfo {                                                                                                                                   
   googleId: string;                                                                                                                                    
   userId: string;                                                                                                                                      
   name: string;                                                                                                                                        
   email: string;                                                                                                                                       
   picture?: string;                                                                                                                                    
 }                                                                                                                                                      
                                                                                                                                                        
 interface UserContextType {                                                                                                                            
   userInfo: UserInfo | null;                                                                                                                           
   setUserInfo: (info: UserInfo | null) => void;                                                                                                        
 }                                                                                                                                                      
                                                                                                                                                        
 const UserContext = createContext<UserContextType>({                                                                                                   
   userInfo: null,                                                                                                                                      
   setUserInfo: () => {},                                                                                                                               
 });                                                                                                                                                    
                                                                                                                                                        
 export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {                                                                     
   const [userInfo, setUserInfo] = useState<UserInfo | null>(null);                                                                                     
                                                                                                                                                        
   useEffect(() => {                                                                                                                                    
     const storedUserInfo = localStorage.getItem('userInfo');                                                                                                
     if (storedUserInfo) {                                                                                                                              
       setUserInfo(JSON.parse(storedUserInfo));                                                                                                         
     }                                                                                                                                                  
   }, []);                                                                                                                                              
                                                                                                                                                        
   useEffect(() => {                                                                                                                                    
     if (userInfo) {                                                                                                                                    
       localStorage.setItem('userInfo', JSON.stringify(userInfo));                                                                                      
     } else {                                                                                                                                           
       localStorage.removeItem('userInfo');                                                                                                             
     }                                                                                                                                                  
   }, [userInfo]);                                                                                                                                      
                                                                                                                                                        
   return (                                                                                                                                             
     <UserContext.Provider value={{ userInfo, setUserInfo }}>                                                                                           
       {children}                                                                                                                                       
     </UserContext.Provider>                                                                                                                            
   );                                                                                                                                                   
 };                                                                                                                                                     
                                                                                                                                                        
 export const useUser = () => useContext(UserContext);