import React from 'react'
import SearchBar from '../SearchBar/SearchBar';
import { useAppContext } from '../Context/Context';
import ErrorBox from '../ErrorBox';
import Spinner from '../Spinner';

const Designation = ({ dept, searchWord, designation, setKnowMore }) => {
  // const { departments } = useAppContext();
  // console.log(departments);

  function search(des) {
    return des.name.toUpperCase().includes(searchWord.toUpperCase());
  }

  if (designation.length === 0) return (
    <Spinner />
  )
  return (
    <>
      <div
        className='flex flex-row flex-wrap'
      >
        {/* <SearchBar searchTextChanged={setChangeWord} title_text="Designations" /> */}

        <div className="grid grid-cols-4 gap-4">
          {
            designation.filter(search).map((ds, i) => (
              <div
                key={`${ds.dept_name}-${ds.name}-${i}`}
                className="bg-[#295F98] w-[300px] h-full text-white p-4 rounded-xl  shadow-md flex flex-col justify-between"
              >
                <div className="flex justify-between">
                  <div className="text-xl font-semibold mb-2">{ds.name}</div>

                  <div className="mb-3">
                    <span className="bg-white text-black text-sm px-3 py-1 rounded-md">
                      {ds.dept_name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center mt-auto">
                  <div className="relative flex w-[60px] h-8">
                    <img src="/guy_man_dude.svg" className="w-8 h-8 rounded-full z-30" />
                    <img src="/guy_man_dude.svg" className="w-8 h-8 rounded-full absolute left-4 z-20" />
                    <img src="/guy_man_dude.svg" className="w-8 h-8 rounded-full absolute left-8 z-10" />
                  </div>
                  <span className="ml-2 text-sm">{ds.emp_count} + Employees</span>
                </div>
              </div>
            ))
          }

        </div>

        {designation.filter(search).length <= 0 &&
          <ErrorBox>
            No Designation found :(
          </ErrorBox>
        }
      </div>


    </>
  )
}

export default Designation