import React, { useContext, useEffect, useState } from "react";
import { getEmployees } from "../../Api/Endpoints/endpoints";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdOutlineAppRegistration } from "react-icons/md";
import EditUser from "../AddUser/EditUser";
import ErrorBox from "../ErrorBox";
import Status_Modal from "../Status_Modal/Status_Modal";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
// import { useAppContext } from "../Context/Context";
import Modal from "../Modal";
import { GetterContext, SetterContext } from "../Context/NewContext";
import Pagination from "../Pagination/Pagination";

const Table = ({ headers, searchWord }) => {
  // const [employees, setEmployees] = useState([]);
  const { employees, designations, departments } = useContext(GetterContext)
  const { setEmployees } = useContext(SetterContext);

  var filter = employees.filter((i) => i.status === "Active")
  console.log(filter);

  // Code For Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem)
  // Code For Pagination

  const [error, setError] = useState(null);
  const [formdata, setformdata] = useState(null)
  const [emp_status, set_emp_status] = useState(null)
  const [modal, setmodal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [filterStatus, setfilterStatus] = useState("All")
  const handleEdit = (id) => {
    const data = employees.find((row) => row.employee_id === id)
    setformdata(data)
    setmodal(true)
  };
  const handlestatus = (id) => {
    const data = employees.find((row) => row.employee_id === id)
    set_emp_status(data)
    setEditModal(true)

  };

  useEffect(() => {
  }, [employees])

  function search(emp) {
    return emp.employee_id.toUpperCase().includes(searchWord.toUpperCase()) || emp.name.toUpperCase().includes(searchWord.toUpperCase()) || emp.email.toUpperCase().includes(searchWord.toUpperCase()) || emp.department.toUpperCase().includes(searchWord.toUpperCase());
  }

  const filteredEmployees = currentItems.filter((i) => filterStatus === "All" ? true : i.status === filterStatus
  );
  console.log(filteredEmployees);
  

  return (
    <>
      <div className="px-5 flex">
        <p className='text-xl'>Filter Employees</p>
        <select name="" id="" className='mx-5 border-black border-1 text-xl cursor-pointer ' onChange={(e) => setfilterStatus(e.target.value)}>
          <option className=' text-black capitalize'>All</option>
          <option className=' text-black capitalize'>Active</option>
          <option className=' text-black capitalize'>In Active</option>
        </select>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto w-full rounded-2xl shadow-lg flex flex-center justify-center">
          {
            filteredEmployees.filter(search).length > 0 ?
              <table className="w-full divide-y divide-gray-200 ">
                <thead className="bg-[#2b2d5b] text-white">
                  <tr>
                    {headers.map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-lg font-medium tracking-wide"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {
                    filteredEmployees.sort((a, b) => a.name.localeCompare(b.name)).filter(search).map((datum) => (
                      <tr
                        key={datum.employee_id}
                        className="hover:bg-[#f7f7f7] transition-colors"
                      >
                        <td className="px-2 py-4">{datum.employee_id}</td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          <div>
                            {/* <img src={datum.image ?? './account_circle.svg'} alt={datum.name} className="w-10 h-10 rounded-full mr-2 inline-block" /> */}
                            {datum.name}
                          </div>

                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {datum.email}
                        </td>
                        <td className="px-6 py-4">{departments.find(d => d.id == datum.department_id)?.name}</td>
                        <td className="px-6 py-4">{designations.find(d => d.id == datum.designation_id)?.name}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`bg-${datum.status == "Active" ? "green-500" : "red-500"} hover:cursor-pointer text-white text-lg font-semibold px-3 py-1 rounded shadow flex flex-row flex-wrap items-center justify-evenly`}
                            onClick={() => handlestatus(datum.employee_id)}
                          >
                            <span>{datum.status}</span>
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                          </span>
                        </td>
                        <td
                          className="px-6 py-4 text-xl text-center"
                          onClick={() => handleEdit(datum.employee_id)}
                        >
                          <div
                            className="flex flex-row justify-center py-2 rounded hover:cursor-pointer"
                          >
                            <MdEdit />
                          </div>

                        </td>

                      </tr>
                    )
                    )}
                </tbody>
              </table> :
              <ErrorBox>
                No user found :(
              </ErrorBox>
          }


        </div>
        {formdata && (
          <Modal isOpen={modal} onClose={_ => { setmodal(false) }}>
            <EditUser
              employeeData={formdata}
              employees={employees}
              setEmployees={es => setEmployees(es)}
              onSuccess={_ => setmodal(false)}
            />
          </Modal>

        )}
        {
          emp_status && (
            <Status_Modal emp_status={emp_status} modal={editModal} setmodal={setEditModal} onChanged={(id, status) => {
              let nemp = employees;
              for (let i = 0; i < employees.length; i++) {
                if (employees[i].employee_id == id) {
                  employees[i].status = status;
                }
              }
              setEmployees(nemp)
            }} />
          )
        }
      </div>
      <div className="flex px-5 justify-end">
        <Pagination
          totalItems={employees.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
      <ToastContainer />
    </>
  );
};

export default Table;
