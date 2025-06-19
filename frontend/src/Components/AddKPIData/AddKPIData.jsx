import React, { useEffect, useState } from 'react'
import SearchBar from '../SearchBar/SearchBar';
import Modal from '../Modal';
import { ToastContainer } from 'react-toastify';
// import AddKPIForm from './AddKPIForm';
import KpiDataEmployees from './KpiDataEmployees';
import { getDepartments, getDesignation } from '../../Api/Endpoints/endpoints';

const AddKPIData = () => {
  const [addEntryModal, setAddModal] = useState(false);
  const [depts, setDepts] = useState([]);
  const [selectDept, setSelDept] = useState(null);
  const [selectDesg, setSelDesg] = useState(null);
  const [desg, setDesg] = useState([]);
  // const [empID, setEmpID] = useState(null);
  // const [kpiID, setKpiID] = useState(null);

  useEffect(_ => {
    (
      async () => {
        try {
          const dp = await getDepartments();
          // console.log(dp);
          setDepts(dp)
        } catch (ex) {
          console.log('failed to get departments');
        }
      }
    )();

    (
      async () => {
        try {
          const dp = await getDesignation();
          setDesg(dp)
          console.log(dp)
        } catch (ex) {
          console.log('failed to get departments');
        }
      }
    )();

  }, []);

  return (
    <>
      <ToastContainer />
      {/* <SearchBar title_text={'KPI Entries'} searchTextChanged={s => { }} /> */}

      <div className='flex flex-col flex-wrap gap-5 p-7'>
        <div className='flex flex-row gap-5'>
          {
            selectDept == null &&
            depts.map(d => (
              <>
                <div
                  className='flex flex-col p-7 px-15 bg-[#312F52] rounded-lg items-center gap-2 justify-between'
                >
                  <span className='text-2xl text-white'>{d.name}</span>
                  <button
                    onClick={_ => setSelDept(d)}
                    className='px-4 text-black bg-white rounded text-lg hover:cursor-pointer'
                  >Select</button>
                </div>
              </>
            ))
          }
        </div>

        <div className='flex flex-row gap-5 flex-wrap'>
          {
            selectDept && !selectDesg &&
            desg.filter(k => k.department_id == selectDept.id).map(
              d => (
                <>
                  <div
                    className='flex flex-col p-7 px-15 bg-[#312F52] rounded-lg items-center gap-2 justify-between'
                  >
                    <span className='text-2xl text-white'>{d.name}</span>
                    <button
                      onClick={_ => setSelDesg(d)}
                      className='px-4 text-black bg-white rounded text-lg hover:cursor-pointer'
                    >Select</button>
                  </div>
                </>
              )
            )
          }
        </div>

        <div className='flex flex-row gap-5'>
          {
            selectDesg &&
            <KpiDataEmployees desg={selectDesg} onSelEmp={e => { }} />
          }
        </div>


        <div>
          <button
            className='px-4 p-2 text-white bg-[#F3B553] rounded text-lg hover:cursor-pointer'
            onClick={_ => {
              if (!selectDesg) {
                setSelDept(null)
              }
              else if (selectDesg) {
                setSelDesg(null)
              }
            }}
          >
            Back
          </button>
        </div>


      </div>
    </>
  )
}

export default AddKPIData