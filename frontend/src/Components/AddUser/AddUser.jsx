import React, { useState, useSyncExternalStore, useContext } from 'react'
import AddUserBtn from './AddUserBtn'
import SearchBar from '../SearchBar/SearchBar';
import Table from '../Table/Table';
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { GetterContext, SetterContext } from "../Context/NewContext";
import Pagination from '../Pagination/Pagination';

const AddUser = () => {

  const table_header = [
    "id", "Name", "Email", "Department", "Designation", "Status", "Edit"
  ]
  const [searchWord, setChangeWord] = useState("")
  return (
    <>
      <AddUserBtn />
      <SearchBar title_text="Total No Of Users" searchTextChanged={(word) => { setChangeWord(word) }} />
    
      <Table headers={table_header} searchWord={searchWord} />
    </>
  )
}

export default AddUser