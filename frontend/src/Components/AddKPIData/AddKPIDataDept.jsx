import React, { useEffect, useState } from 'react'
import SearchBar from '../SearchBar/SearchBar';
import Modal from '../Modal';
import { ToastContainer } from 'react-toastify';
// import AddKPIForm from './AddKPIForm';
import KpiDataEmployees from './KpiDataEmployees';
import { getDepartments, getDesignation } from '../../Api/Endpoints/endpoints';
import { Link, useParams } from 'react-router-dom'
import Spinner from '../Spinner';

const AddKPIData = () => {
  // const [addEntryModal, setAddModal] = useState(false);
  const [selectDept, setSelDept] = useState(null);
  const [selectDesg, setSelDesg] = useState(null);
  const [selEmp, setSelEmp] = useState(null);
  const [desg, setDesg] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const { dept_id } = useParams();

  function search(dept) {
    return dept.id.toString().toUpperCase().includes(searchText.toUpperCase()) || dept.name.toUpperCase().includes(searchText.toUpperCase())
  }


  useEffect(_ => {
    (
      async () => {
        try {
          const dp = await getDepartments();
          setSelDept(dp.find(d => d.id == dept_id));
        } catch (ex) {
          console.log('failed to get departments');
        }
      }
    )();

    (
      async () => {
        setLoading(true)
        try {
          const dp = await getDesignation();
          setDesg(dp)
          console.log(dp)
        } catch (ex) {
          console.log('failed to get departments');
        }
      }
    )().then(() => {
      setLoading(false);
    });

  }, []);

  return (
    <>
      <ToastContainer />
      <SearchBar title_text={'KPI Entries'} searchTextChanged={s => { setSearchText(s) }} />
      {
        loading &&
        <Spinner />
      }
      <div className='flex flex-col flex-wrap gap-5 p-7'>
        <div className='flex flex-row gap-5 flex-wrap'>
          {
            selectDept &&
            desg.filter(search).filter(k => k.department_id == selectDept.id).map(
              d => (
                <>
                  <div
                    className='flex flex-col p-7 px-15 bg-[#312F52] rounded-lg items-center gap-2 justify-between'
                  >
                    <span className='text-2xl text-white'>{d.name}</span>
                    <Link
                      to={"" + encodeURIComponent(d.id)}
                      className='px-4 text-black bg-white rounded text-lg hover:cursor-pointer'
                    >Select</Link>
                  </div>
                </>
              )
            )
          }

        </div>

        <div className='flex flex-row gap-5'>
          {
            selectDesg &&
            <KpiDataEmployees desg={selectDesg} onSelEmp={e => { setSelEmp(e) }} />
          }
        </div>





      </div>
    </>
  )
}

export default AddKPIData