import React from 'react'
import logo from "../../assets/Login/logo.png"
import icon from "../../assets/Top-Bar/icon.png"
import { CiBellOn } from "react-icons/ci";
const Top_Bar = () => {
  return (
   <>
    <section className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <img
          src={logo} 
          alt="Logo"
          className="h-10"
        />
         <div className="flex justify-between items-center gap-20">
    <button className="relative p-2">
        <span className=''>
        <CiBellOn className='text-4xl bg-[#F1F5F9] rounded-2xl cursor-pointer w-[30px]'/>
        </span>
      
          <span className="absolute top-0 right-0 bg-[#312F52] p-2 text-white text-sm rounded-full w-4 h-4 flex items-center justify-center cursor-pointer ">
            3
          </span>
        </button>
      <div className="flex  w-[150] h-[100px]">
        <div className="bg-[#F2F8FF] shadow-lg rounded-lg w-90  p-2 flex flex-row items-center ">
          <img
     src={icon}
            className="w-[70px]"
          />
          <div className="p-4">
            <h3 className="text-xl font-semibold">Aalain</h3>
            <h3 className="text-xl font-medium text-[#5E6E78]">aalain@gmail.com</h3>
          </div>
        </div>
      </div>
    </div>
      </div>

      {/* Card Section */}
  
    </section>
   
   </>
  )
}

export default Top_Bar