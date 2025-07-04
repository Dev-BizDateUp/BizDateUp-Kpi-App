import React from 'react'
import logo from "../../assets/Login/logo.png"
import icon from "../../assets/Top-Bar/icon.png"
import { CiBellOn } from "react-icons/ci";
const Top_Bar = () => {
  function SignOut() {
    localStorage.removeItem('bizToken');
    location.reload();
  }
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

            {/* <div className="flex  w-[150] h-[100px]">
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
            </div> */}
            <button
            className=' border-red-400 border-3 text-red-500 py-1 px-3 rounded-xl font-bold hover:cursor-pointer'
              onClick={SignOut}
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Card Section */}

      </section>

    </>
  )
}

export default Top_Bar