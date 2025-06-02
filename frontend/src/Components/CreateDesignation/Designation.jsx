import React from 'react'
import { useAppContext } from '../Context/Context';

const Designation = () => {
  const { designation } = useAppContext();
  console.log(designation);
  
    if (designation.length === 0) return <p className='text-center text-[25px] mt-10'>No Designation Yet!</p>
  return (
   <>
   {
    designation.map((item,index)=>{
        return(
             <div className="grid-cols-2  bg-[#0E3F86] rounded-xl flex flex-col justify-center items-center  shadow-md gap-5 pt-5 pb-5">
      <p className="text-white text-[25px]">{item.name}</p>
      <button className="bg-white text-black px-5 py-1 rounded hover:bg-gray-200 transition cursor-pointer">
        Know More
      </button>
    </div>
        )
    })
}
   
   </>
  )
}

export default Designation