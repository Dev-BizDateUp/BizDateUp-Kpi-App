import React, { useState } from 'react'
import Designation from './Designation'

const CreateDesignationBar = () => {

  const [modal, setmodal] = useState(false)
  const handlemodal = ()=> setmodal(true)
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
          modal ? <Designation/> :""
        }
  </>
  )
}

export default CreateDesignationBar