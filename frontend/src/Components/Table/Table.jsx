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

const Table = ({ headers, searchWord }) => {
  // const [employees, setEmployees] = useState([]);
  const { employees } = useContext(GetterContext)
  const { setEmployees } = useContext(SetterContext);

  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formdata, setformdata] = useState(null)
  const [emp_status, set_emp_status] = useState(null)
  const [modal, setmodal] = useState(false)
  const [editModal, setEditModal] = useState(false)

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

  function search(emp) {
    return emp.employee_id.toUpperCase().includes(searchWord.toUpperCase()) || emp.name.toUpperCase().includes(searchWord.toUpperCase()) || emp.email.toUpperCase().includes(searchWord.toUpperCase()) || emp.department.toUpperCase().includes(searchWord.toUpperCase());
  }



  // if (error) {
  //   return (
  //     <div className="text-center text-red-500 font-medium py-6">{error}</div>
  //   );
  // }

  return (
    <>
      <div className="p-6">
        <div className="overflow-x-auto w-full rounded-2xl shadow-lg flex flex-center justify-center">
          {
            employees.filter(search).length > 0 ?
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
                    employees.sort((a, b) => a.name.localeCompare(b.name)).filter(search).map((datum) => (
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
                        <td className="px-6 py-4">{datum.department}</td>
                        <td className="px-6 py-4">{datum.designation}</td>
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
                        {/* <td className="px-6 py-4 text-xl text-center border-black hover:border-b-1 transition-all duration-200"
                          onClick={() => handlestatus(datum.employee_id)}
                        >
                          <MdOutlineAppRegistration />
                        </td> */}
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
      <ToastContainer />
    </>
  );
};

export default Table;
