import React, { useEffect, useState } from 'react'
import SearchBar from '../SearchBar/SearchBar';
import Modal from '../Modal';
import { ToastContainer } from 'react-toastify';
// import AddKPIForm from './AddKPIForm';
import KpiDataEmployees from './KpiDataEmployees';
import { getDepartments, getDesignation, getEmployeesUnderDesg } from '../../Api/Endpoints/endpoints';
import { Link, useParams } from 'react-router-dom'
import KPITable from '../CreateKPI/KPITable';
import KpiDataTable from './KpiDataTable';
import Spinner from '../Spinner';

const AddKPIData = () => {
  // const [addEntryModal, setAddModal] = useState(false);
  const [selectDept, setSelDept] = useState(null);
  const [selectDesg, setSelDesg] = useState(null);
  const [selEmp, setSelEmp] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const { emp_id, desg_id } = useParams();

  function search(dept) {
    return dept.id.toString().toUpperCase().includes(searchText.toUpperCase()) || dept.name.toUpperCase().includes(searchText.toUpperCase())
  }


  useEffect(_ => {
    (
      async () => {
        setLoading(true);
        const mps = await getEmployeesUnderDesg(desg_id);
        console.log(mps.data);
        setSelEmp(mps.data.find(e => e.id == emp_id))
        // setEmps(mps.data);
      }
    )().finally(() => { setLoading(false) });
  }, []
  )

  return (
    <>
      <ToastContainer />
      <SearchBar title_text={'KPI Entries'} searchTextChanged={s => { setSearchText(s) }} />
      {
        loading &&
        <Spinner />
      }
      <div className='flex flex-col flex-wrap gap-5 p-7'>
        {
          selEmp &&
          <div className='text-xl'>{selEmp.name }</div>

        }
        <div className='flex flex-row gap-5'>
          {
            <KpiDataTable emp={selEmp} setInspect={() => { }} />
          }
        </div>
      </div>
    </>
  )
}

export default AddKPIData