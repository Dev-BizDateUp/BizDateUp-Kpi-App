import React, { useState, useSyncExternalStore } from 'react'
import AddUserBtn from './AddUserBtn'
import SearchBar from '../SearchBar/SearchBar';
import Table from '../Table/Table';
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
const AddUser = () => {
  const data = [
    {
      id: 1253,
      name: "John Doe",
      email: "johndoe@example.com",
      department: "HR",
      designation: "Manager",
      status: "Active",
      edit: <MdEdit />,
      delete: <MdDeleteForever />
    },
    {
      id: 1253,
      name: "John Doe",
      email: "johndoe@example.com",
      department: "HR",
      designation: "Manager",
      status: "Active",
      edit: <MdEdit />,
      delete: <MdDeleteForever />
    }
  ];

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