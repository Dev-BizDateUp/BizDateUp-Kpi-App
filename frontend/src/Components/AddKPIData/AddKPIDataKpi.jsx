import React, { useEffect, useState } from 'react'
import SearchBar from '../SearchBar/SearchBar';
import Modal from '../Modal';
import { ToastContainer } from 'react-toastify';
// import AddKPIForm from './AddKPIForm';
import KpiDataEmployees from './KpiDataEmployees';
import { getDepartments, getEmployee, getDesignation, getEmployees, getEmployeesUnderDesg, getKPIsForEmployee } from '../../Api/Endpoints/endpoints';
import { Link, useParams } from 'react-router-dom'
import KPITable from '../CreateKPI/KPITable';
import KpiDataTable from './KpiDataTable';
import EntryTable from './EntryTable';

const AddKPIData = () => {
  // const [addEntryModal, setAddModal] = useState(false);
  const [selectDept, setSelDept] = useState(null);
  const [selectKpi, setSelKpi] = useState(null);
  const [selEmp, setSelEmp] = useState(null);
  const [kpis, setKpis] = useState([])
  const [searchText, setSearchText] = useState("");

  const { emp_id, kpi_id } = useParams();

  function search(dept) {
    return dept.id.toString().toUpperCase().includes(searchText.toUpperCase()) || dept.name.toUpperCase().includes(searchText.toUpperCase())
  }


  useEffect(_ => {
    (
      async () => {
        const ks = await getKPIsForEmployee(emp_id);
        // console.log(ks.data.data);
        setKpis(ks.data.data);
        setSelKpi(ks.data.data.find(k => k.id == kpi_id));
        const es = await getEmployee(emp_id);
        if (es.result) {
          setSelEmp(es.result.data)
          console.log("Set employe ",es.result.data);
          
        } else {
          console.log("Could not find employee with that ID")
        }

        // setEmps(mps.data);
      }
    )();
  }, []
  )

  return (
    <>
      <ToastContainer />
      <SearchBar title_text={'KPI Data'} searchTextChanged={s => { setSearchText(s) }} />

      <div className='flex flex-col flex-wrap gap-5 p-7'>
          <EntryTable emp={selEmp} kpi={selectKpi} />
      </div>
    </>
  )
}

export default AddKPIData