import React, { useEffect, useState } from 'react'
import SearchBar from '../SearchBar/SearchBar';
import Modal from '../Modal';
import { ToastContainer } from 'react-toastify';
// import AddKPIForm from './AddKPIForm';
import KpiDataEmployees from './KpiDataEmployees';
import { getDepartments, getDesignation } from '../../Api/Endpoints/endpoints';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner';
import { useAppContext } from '../Context/Context';


const AddKPIData = () => {
  const [depts, setDepts] = useState([]);
  const [selectDept, setSelDept] = useState(null);
  const { dept } = useAppContext();
  const [selectDesg, setSelDesg] = useState(null);
  const [selEmp, setSelEmp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  function search(dept) {
    return dept.id.toString().toUpperCase().includes(searchText.toUpperCase()) || dept.name.toUpperCase().includes(searchText.toUpperCase())
  }


useEffect(() => {
  console.log("This is From useEffect");
  setDepts(dept);
}, [dept]);

  return (
    <>
      <ToastContainer />
      <SearchBar title_text={'KPI Entries'} searchTextChanged={s => { setSearchText(s) }} />
      {
        loading &&
        <Spinner />
      }
      <div className='flex flex-col flex-wrap gap-5 p-7'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {
            selectDept == null &&
            depts.filter(search).map((d, index) => (
              <div
                key={index}
                className="flex flex-col p-7 px-15 bg-[#312F52] rounded-lg items-center gap-4 justify-between"
              >
                <span className="text-2xl text-white">{d.name}</span>
                <Link
                  to={"" + encodeURIComponent(d.id)}
                  className="px-4 py-2 text-black bg-white rounded text-lg hover:cursor-pointer"
                >
                  Select
                </Link>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default AddKPIData