import React, { useState } from 'react'
import SearchBar from '../SearchBar/SearchBar'
import Modal from '../Modal'
import DisplayKPIDepartments from './DisplayKPIDepartments'

const CreateKPI = () => {

  const [modal, setmodal] = useState(false)
  const handlemodal = () => setmodal(true)
  const [searchWord, setChangeWord] = useState("")
  const [dept, setDept] = useState('');
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
      <div>{dept}</div>
      <SearchBar title_text={"Select Department for KPI"} searchTextChanged={text => { setChangeWord(text) }} />
      <DisplayKPIDepartments searchWord={searchWord} onSelectDept={d => setDept(d)} />
    </>
  )
}

export default CreateKPI