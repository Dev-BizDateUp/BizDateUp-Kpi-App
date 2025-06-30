import React, { useEffect, useState } from "react";
import { getEmployees } from "../../Api/Endpoints/endpoints";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdOutlineAppRegistration } from "react-icons/md";
import EditUser from "../AddUser/EditUser";
import ErrorBox from "../ErrorBox";
import Status_Modal from "../Status_Modal/Status_Modal";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { useAppContext } from "../Context/Context";
import Modal from "../Modal";

const Table = ({ headers, searchWord, employees, setEmployees }) => {
  // const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let data = await getEmployees();
        // console.log(data.employees)
        setEmployees(
          data.employees
        );
      } catch (err) {
        setError("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div class="text-center">
    <div role="status">
        <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
    </div>
</div>
    );
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
                    employees.sort((a,b) => a.name.localeCompare(b.name)).filter(search).map((datum) => (
                      <tr
                        key={datum.employee_id}
                        className="hover:bg-[#f7f7f7] transition-colors"
                      >
                        <td className="px-2 py-4">{datum.employee_id }</td>
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
              setEmployees={setEmployees}
              onSuccess={_ => setmodal(false)}
            />
          </Modal>

        )}
        {
          emp_status && (
            <Status_Modal emp_status={emp_status} modal={editModal} setmodal={setEditModal} onChanged={(id, status) => {
              let nemp = employees;
              for (let i = 0; i < employees.length; i++) {
                if(employees[i].employee_id == id){
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
