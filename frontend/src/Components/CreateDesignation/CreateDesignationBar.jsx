import React, { useState, useEffect, useContext } from 'react'
import CreateDesignationModal from './CreateDesignationModal'
import Designation from './Designation'
import SearchBar from '../SearchBar/SearchBar'
import Modal from '../Modal'
import { getDepartments, getDesignation } from '../../Api/Endpoints/endpoints'
import { ToastContainer, toast } from 'react-toastify';
import { GetterContext } from '../Context/NewContext'

const CreateDesignationBar = () => {

  const [modal, setmodal] = useState(false)
  const handlemodal = () => setmodal(true)
  const [searchWord, setChangeWord] = useState("")
  const [knowMore, setKnowMore] = useState(null);
  // const [designation, setDesign] = useState([]);
  // const [departments, setDepartments] = useState([]);
  const { designations } = useContext(GetterContext);

  return (
    <>
      <ToastContainer />

      <div className="bg-[#DDDDDD] p-3">
        <button
          onClick={handlemodal}
          className="text-xl bg-white text-black px-1.5 py-1.5 rounded-lg cursor-pointer"
        >
          Create Designation
        </button>

      </div>
      {
        modal ? <>
          <Modal isOpen={modal} title={"Create Designation"} onClose={() => { setmodal(false) }}>
            <CreateDesignationModal onComplete={_ => { setmodal(false) }} />
          </Modal>
        </> : ""
      }
      {
        knowMore != null &&
        <Modal isOpen={knowMore != null} onClose={setKnowMore(null)} title={`Information on ${knowMore.className}`}>
          {JSON.stringify(knowMore)}
        </Modal>
      }
      <SearchBar title_text="Totat no of designations" searchTextChanged={(word) => { setChangeWord(word) }} />
      {
        designations &&
        <Designation searchWord={searchWord} />
      }
    </>
  )
}

export default CreateDesignationBar