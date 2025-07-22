import React, { useContext } from 'react'
import logo from "../../assets/Login/logo.png"
import icon from "../../assets/Top-Bar/icon.png"
import { CiBellOn } from "react-icons/ci";
import { AuthContext, GetterContext } from '../Context/NewContext';
const Top_Bar = () => {
  const { employees, myRole } = useContext(GetterContext);
  const { userData } = useContext(AuthContext);
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

            <div className='flex flex-col'>
              <span className='text-xl'>Welcome, <b>{employees.find(e => e.id == userData.id)?.name}</b></span>
            </div>
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