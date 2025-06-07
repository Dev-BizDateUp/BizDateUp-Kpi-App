import React, { useState } from 'react'
import SearchBar from '../SearchBar/SearchBar'
import Modal from '../Modal'
import DisplayKPIDepartments from './DisplayKPIDepartments'
import DisplayKPIDesignations from './DisplayKPIDesignations'

const CreateKPI = () => {

  const [modal, setmodal] = useState(false)
  const handlemodal = () => setmodal(true)
  const [searchWord, setChangeWord] = useState("")
  const [dept, setDept] = useState('');
  const [deptID, setDeptID] = useState(0);
  const [desg, setDesg] = useState('');
  const [desgID, setDesgID] = useState(0)
  return (
    <>

      <div className="bg-[#DDDDDD] p-3">
        <button
          onClick={handlemodal}
          className="text-xl bg-white text-black px-1.5 py-1.5 rounded-lg cursor-pointer"
        >
          Create KPI
        </button>

      </div>
      {
        modal &&
        <Modal isOpen={modal} onClose={() => { setmodal(false) }} title={"Create KPI"}>
          form for creating a kpi
        </Modal>
      }
      {
        dept.trim() == '' ?
          <>
            <SearchBar title_text={"Select Department for KPI"} searchTextChanged={text => { setChangeWord(text) }} />
            <DisplayKPIDepartments searchWord={searchWord} onSelectDept={d => { setDept(d.name); setDeptID(d.id) }} />
          </>
          :
          <>
            <div className='flex flex-row justify-start'>
              <button
                className='px-4 py-2 m-3 bg-[#F3B553] text-xl text-white rounded shadow-lg hover:cursor-pointer'
                onClick={_ => { setDept("") }}
              >
                Back
              </button>
              <button
                className='px-4 py-2 m-3 text-xl rounded shadow-lg hover:cursor-pointer'
                onClick={_ => { setDesg("") }}
              >
                {dept}
              </button>
              <img src='./chevron_right.svg' />

            </div>
            <SearchBar title_text={"Select designation for KPI"} searchTextChanged={text => { setChangeWord(text) }} />
            <DisplayKPIDesignations deptID={deptID} onSelectDesignation={d => { setDesg(d.name); setDeptID(d.id) }} />
          </>
      }
    </>
  )
}

export default CreateKPI