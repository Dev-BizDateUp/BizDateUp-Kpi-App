import React, { useEffect, useState } from 'react'
import { getDepartments } from '../../Api/Endpoints/endpoints'
import ErrorBox from '../ErrorBox'
const Departments = ({ searchWord, departments, setdepartments,setKnowMore }) => {
  // const [departments, setdepartments] = useState([])

  function search(dep) {
    return dep.name.toUpperCase().includes(searchWord.toUpperCase());
  }

  useEffect(() => {
    const fetchDept = async () => {
      const response = await getDepartments()
      console.log(response);
      setdepartments(response)
    }
    console.log("This is From Know More Modal");
    
    fetchDept()
  }, [])


  if (departments.length === 0) return <p className='text-center text-[25px] mt-10'>No Departments Yet!</p>
  return (
    <>
      <div className="grid grid-cols-6 gap-4 px-10 mt-10">
        {
          departments.filter(search).map((item, index) => (
            <div className="grid-cols-4  bg-[#0E3F86] rounded-xl flex flex-col justify-center items-center  shadow-md gap-5 pt-5 pb-5">
              <p className="text-white text-[25px] text-center">{item.name}</p>
              <button
                onClick={_ => {setKnowMore(item)}}
                className="bg-white shadow text-black px-5 py-1 rounded hover:bg-gray-200 transition cursor-pointer"
              >
                Know More
              </button>
            </div>
          ))
        }

        {departments.filter(search).length <= 0 &&
          <ErrorBox>
            No department found :(
          </ErrorBox>
        }
      </div>
    </>
  )
}

export default Departments