import React, { useState, useEffect } from 'react'
import CreateDesignationModal from './CreateDesignationModal'
import Designation from './Designation'
import SearchBar from '../SearchBar/SearchBar'
import Modal from '../Modal'
import { getDesignation } from '../../Api/Endpoints/endpoints'
import { ToastContainer, toast } from 'react-toastify';

const CreateDesignationBar = () => {

  const [modal, setmodal] = useState(false)
  const handlemodal = () => setmodal(true)
  const [searchWord, setChangeWord] = useState("")
  const [knowMore, setKnowMore] = useState(null);
  const [designation, setDesign] = useState([]);

  useEffect(() => {
    const fetchDept = async () => {
      const response = await getDesignation()
      setDesign(response);
    }
    fetchDept();
  }, [])

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
            <CreateDesignationModal onComplete={_ => { setmodal(false) }} designation={designation} setDesign={setDesign} />
          </Modal>
        </> : ""
      }
      {
        knowMore != null &&
        <Modal isOpen={knowMore != null} onClose={setKnowMore(null)} title={`Information on ${knowMore.className}`}>
          {JSON.stringify(knowMore)}
        </Modal>
      }
      <SearchBar title_text="Designations" searchTextChanged={(word) => { setChangeWord(word) }} />
      {
        designation &&
        <Designation setKnowMore={setKnowMore} designation={designation} searchWord={searchWord} />
      }
    </>
  )
}

export default CreateDesignationBar