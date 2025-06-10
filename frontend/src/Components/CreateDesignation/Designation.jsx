import React from 'react'
import SearchBar from '../SearchBar/SearchBar';
import { useAppContext } from '../Context/Context';

const Designation = ({ searchWord, designation, setKnowMore }) => {
  // const { designation } = useAppContext();
  function search(des) {
    return des.name.toUpperCase().includes(searchWord.toUpperCase());
  }

  if (designation.length === 0) return <p className='text-center text-[25px] mt-10'>No Designation Yet!</p>
  return (
    <>
      <div
        className='flex flex-row flex-wrap'
      >
        {/* <SearchBar searchTextChanged={setChangeWord} title_text="Designations" /> */}

        {
          designation.filter(search).map((item, index) =>
          (
            <div className="bg-[#295F98] rounded-xl flex flex-col items-start items-center  shadow-md gap-5 pt-5 p-5 m-2">
              <div className='flex flex-row'>
                <p className="text-white text-[25px] mr-12">{item.name}</p>
                <button className="bg-white shadow text-black px-5 py-1 rounded hover:bg-gray-200 transition cursor-pointer"
                  onClick={_ => setKnowMore(item)}>
                  {item.dept_name}
                </button>
              </div>
              <div className='flex flex-row align-start text-white'>
                <div className='relative flex justify-center mx-3 '>
                  <img src='/guy_man_dude.svg' className='z-20' />
                  <img src='/guy_man_dude.svg' className='absolute left-[10px] z-30' />
                  <img src='/guy_man_dude.svg' className='absolute left-[-10px] z-10' />
                </div>
                2 bajillion Employees
              </div>

            </div>
          )
          )
        }
      </div>


    </>
  )
}

export default Designation