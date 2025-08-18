import React, { useContext } from 'react'
import logo from "../../assets/Login/logo.png"
import icon from "../../assets/Top-Bar/icon.png"
import { CiBellOn } from "react-icons/ci";
import { AuthContext, GetterContext } from '../Context/NewContext';
import { IoMdMenu } from "react-icons/io";

const Top_Bar = ({toggleMenu}) => {
  const { employees, myRole } = useContext(GetterContext);
  const { userData } = useContext(AuthContext);
  function SignOut() {
    localStorage.removeItem('bizToken');
    location.reload();
  }
  return (
    <>
      <section className="p-6 space-y-6 xl:block lg:block hidden">
        <div className="flex items-center justify-between xl:flex-row lg:flex-row flex-col xl:gap-10 gap-5">
          <img
            src={logo}
            alt="Logo"
            className="h-10"
          />
          <div className="flex justify-between items-center xl:gap-10 gap-5 xl:flex-row lg:flex-row flex-col">

              <span className='text-xl'>Welcome, <b>{employees.find(e => e.id == userData.id)?.name}</b></span>
            <button
              className=' border-red-400 border-3 text-red-500 py-1 px-3 rounded-xl font-bold hover:cursor-pointer'
              onClick={SignOut}
            >
              Sign out
            </button>
            <IoMdMenu className='cursor-pointer text-2xl xl:hidden lg:hidden block md:block' onClick={toggleMenu} />

          </div>
        </div>  

        {/* Card Section */}

      </section>
   <section className="p-6 space-y-6 xl:hidden lg:hidden block">
        <div className="flex items-center flex-col gap-5 w-full">
       <div className="flex justify-between items-center w-full">
           <img
            src={logo}
            alt="Logo"
            className=" w-[115px]"
          />
              <span className='text-[14px]'>Welcome, <b>{employees.find(e => e.id == userData.id)?.name}</b></span>
       </div>

          <div className="flex  items-center xl:gap-10 gap-5 flex-row justify-between w-full ">

            <button
              className=' border-red-400 border-3 text-red-500 py-1 px-3 rounded-xl font-bold hover:cursor-pointer'
              onClick={SignOut}
            >
              Sign out
            </button>
            <IoMdMenu className='cursor-pointer text-2xl xl:hidden lg:hidden block md:block' onClick={toggleMenu} />

          </div>
        </div>  

        {/* Card Section */}

      </section>
    </>
  )
}

export default Top_Bar