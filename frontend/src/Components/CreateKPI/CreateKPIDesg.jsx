import React, { useState } from 'react'
import SearchBar from '../SearchBar/SearchBar'
import Modal from '../Modal'
import DisplayKPIDepartments from './DisplayKPIDepartments'
import DisplayKPIDesignations from './DisplayKPIDesignations'
import KPITable from './KPITable'
import CreateKPIForm from './CreateKPIForm'
import { ToastContainer } from 'react-toastify'
import { useParams } from 'react-router-dom'

const CreateKPI = () => {

  const [modal, setmodal] = useState(false)
  const handlemodal = () => setmodal(true)
  const [searchWord, setChangeWord] = useState("")
  const [dept, setDept] = useState('');
  const [deptID, setDeptID] = useState(0);
  const [desg, setDesg] = useState('');
  const [desgID, setDesgID] = useState(0)
  const { desg_id } = useParams();


  return (
    <>
      <ToastContainer />
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
          <CreateKPIForm modalSet={_ => setmodal(false)} />
        </Modal>
      }

      <SearchBar title_text={"Select KPI"} searchTextChanged={text => { setChangeWord(text) }} />
      <KPITable designation={desg_id} searchWord={searchWord} />
    </>
  )
}

export default CreateKPI