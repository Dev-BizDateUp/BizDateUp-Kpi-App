import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppContext } from '../Context/Context'
import SearchBar from '../SearchBar/SearchBar'

const Designation_Part = () => {
  const { desname } = useParams()
  const { employees } = useAppContext()
  console.log(employees);

  const filteredEmployees = employees.filter((e) => e.designation === desname);
  console.log(filteredEmployees);

  return (
    <>
      <SearchBar title_text="Select Employee For Dashboard " />

      {
        filteredEmployees.length === 0 ? (
          <p className="text-center text-red-700 mt-30 text-3xl">
            There is No Employee For This Designation
          </p>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-7">
            {filteredEmployees.map((e, index) => (
              <Link to={`/dashboard/departments/emp/${encodeURIComponent(e.id)}`}>
                <div
                  key={index}
                  className="flex flex-col p-7 bg-[#312F52] rounded-lg items-center gap-2 justify-between"
                >
                  <span className="text-2xl text-white">{e.name}</span>
                  <button className="px-4 text-black bg-white rounded text-lg hover:cursor-pointer">
                    Select
                  </button>
                </div>
              </Link>
            ))}
          </div>

        )
      }
    </>
  )
}

export default Designation_Part