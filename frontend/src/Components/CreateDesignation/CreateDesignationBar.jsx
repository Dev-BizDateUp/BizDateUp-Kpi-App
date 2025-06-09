import React, { useState,useEffect } from 'react'
import CreateDesignationModal from './CreateDesignationModal'
import Designation from './Designation'
import SearchBar from '../SearchBar/SearchBar'
import Modal from '../Modal'
import { getDesignation } from '../../Api/Endpoints/endpoints'
const CreateDesignationBar = () => {

  const [modal, setmodal] = useState(false)
  const handlemodal = () => setmodal(true)
  const [searchWord, setChangeWord] = useState("")
  const [designation, setDesign] = useState([]);

  useEffect(() => {
    const fetchDept = async () => {
      const response = await getDesignation()
      console.log(response);
      setDesign(response)
    }
    fetchDept()
  }, [])

  return (
    <>
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
            <CreateDesignationModal designation={designation} setDesign={setDesign} />
          </Modal>
        </> : ""
      }
      <SearchBar title_text="Designnations" searchTextChanged={(word) => { setChangeWord(word) }} />
      {
        designation &&
        <Designation designation={designation} searchWord={searchWord} />
      }
    </>
  )
}

export default CreateDesignationBar