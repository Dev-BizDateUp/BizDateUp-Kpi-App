
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDepartments } from '../../Api/Endpoints/endpoints';
const AppContext = createContext();
export const AppProvider = ({ children }) => {
    const [dept, setdept] = useState([])
const getDepartmentss = async()=>{
   try{
     const response = await getDepartments()
    if (response){
 setdept(response)
    }
   }
   catch(e){
    return e
   }
}
  useEffect(() => {
    getDepartmentss();
  }, []);
  return (
    <AppContext.Provider value={{ dept}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
