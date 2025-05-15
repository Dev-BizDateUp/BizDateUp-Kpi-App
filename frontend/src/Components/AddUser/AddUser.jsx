import React from 'react'
import AddUserBtn from './AddUserBtn'
import SearchBar from '../SearchBar/SearchBar';
import Table from '../Table/Table';
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
const AddUser = () => {
  const data = [
{
  id:1253,
  name: "John Doe",
  email: "johndoe@example.com",
  department: "HR",
  designation: "Manager",
  status: "Active",
  edit:<MdEdit />,
  delete:<MdDeleteForever />
},
 {
  id:1253,
  name: "John Doe",
  email: "johndoe@example.com",
  department: "HR",
  designation: "Manager",
  status: "Active",
  edit:<MdEdit />,
  delete:<MdDeleteForever />
}
];
  const users = [
  { name: "Alice" },
  { name: "Bob" },
  { name: "Charlie" },
  { name: "David" },
  { name: "Eva" }
];


const table_header = [
  "id", "Name", "Email", "Department", "Designation", "Status", "Edit", "Change Status"
]
  return (
 <>
   <AddUserBtn/>
   <SearchBar data = {users} title_text = "Total No Of Users"/>
   <Table headers={table_header} data = {data}/>
    </>
  )
}

export default AddUser