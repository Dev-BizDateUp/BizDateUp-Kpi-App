import React, { useState } from 'react'
import SearchBar from '../SearchBar/SearchBar';
import Modal from '../Modal'
const AddKPIData = () => {
  const [addEntryModal,setAddModal] = useState(false);

  return (
    <>
      <div>
          <div className='text-3xl'>
            KPI Entries
          </div>
      </div>
    </>
  )
}

export default AddKPIData