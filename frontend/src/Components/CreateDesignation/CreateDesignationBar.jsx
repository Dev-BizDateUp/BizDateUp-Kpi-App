import React, { useState } from 'react'
import CreateDesignationModal from './CreateDesignationModal'
import Designation from './Designation'
import SearchBar from '../SearchBar/SearchBar'
import Modal from '../Modal'
const CreateDesignationBar = () => {

  const [modal, setmodal] = useState(false)
  const handlemodal = () => setmodal(true)
  const [searchWord, setChangeWord] = useState("")

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
          <Modal isOpen={modal} title={"Create Designation"} onClose={() => {setmodal(false)}}>
            <CreateDesignationModal />
          </Modal>
        </> : ""
      }
      <SearchBar title_text="Designnations" searchTextChanged={(word) => { setChangeWord(word) }} />
      <Designation searchWord={searchWord} />
    </>
  )
}

export default CreateDesignationBar