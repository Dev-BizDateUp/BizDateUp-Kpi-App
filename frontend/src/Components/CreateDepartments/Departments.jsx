import React, { useEffect, useState } from 'react'
import { getDepartments } from '../../Api/Endpoints/endpoints'

const Departments = () => {
    const [departments, setdepartments] = useState([])

  useEffect(() => {
   const fetchDept = async ()=>{
        const response = await getDepartments()
        console.log(response);
       setdepartments(response)
    }
    fetchDept()
  }, [])
  

    // if (departments.length === 0) return <p className='text-center text-[25px] mt-10'>No Departments Yet!</p>
  return (
<>
{/* <p>There is Departments</p> */}
<div class="grid grid-cols-6 gap-4 px-10 mt-10">
{
    departments.map((item,index)=>{
        return(
             <div className="grid-cols-4  bg-[#0E3F86] rounded-xl flex flex-col justify-center items-center  shadow-md gap-5 pt-5 pb-5">
      <p className="text-white text-[25px]">{item.emp_dept}</p>
      <button className="bg-white text-black px-5 py-1 rounded hover:bg-gray-200 transition cursor-pointer">
        Know More
      </button>
    </div>
        )
    })
}
</div>
</>
  )
}

export default Departments