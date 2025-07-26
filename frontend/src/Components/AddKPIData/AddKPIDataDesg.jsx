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
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const { desg_id } = useParams();

  function search(dept) {
    return dept.id.toString().toUpperCase().includes(searchText.toUpperCase()) || dept.name.toUpperCase().includes(searchText.toUpperCase())
  }


  useEffect(_ => {
    (
      async () => {
        try {
          setLoading(true)
          const dp = await getDesignation();
          setSelDesg(dp.find(d => d.id == desg_id));
          console.log(dp)
        } catch (ex) {
          console.log('failed to get departments');
        }
      }
    )().finally(() => { setLoading(false) });

  }, [desg_id]);

  return (
    <>
      <ToastContainer />
      <SearchBar title_text={'KPI Entries'} searchTextChanged={s => { setSearchText(s) }} />
      {
        loading &&
        <Spinner />
      }
      <div className='flex flex-col flex-wrap gap-5 p-7'>
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