import React, { useContext, useEffect, useState } from 'react'
import { getDepartments } from '../../Api/Endpoints/endpoints'
import ErrorBox from '../ErrorBox'
import Spinner from '../Spinner';
import { GetterContext } from '../Context/NewContext';
const Departments = ({ searchWord, setKnowMore }) => {
  // const [departments, setdepartments] = useState([])

  const { departments } = useContext(GetterContext)

  function search(dep) {
    return dep.name.toUpperCase().includes(searchWord.toUpperCase());
  }

  if (departments.length == 0) return (
    <>
      <Spinner />
    </>
  )
  return (
    <>
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-1 gap-4 px-10 mt-10">

        {
          departments.filter(search).map((item, index) => (
            <div className="grid-cols-1  bg-[#0E3F86] rounded-xl flex flex-col justify-center items-center  shadow-md gap-5 pt-5 pb-5">
              <p className="text-white text-[25px] text-center">{item.name}</p>
              <button
                onClick={() => { setKnowMore(item) }}
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