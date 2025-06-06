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

const Table = ({ headers, searchWord }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formdata, setformdata] = useState(null)
  const [emp_status, set_emp_status] = useState(null)
  const [modal, setmodal] = useState(false)
  const [editModal,setEditModal] = useState(false)
  const handleEdit = (id) => {
    const data = employees.find((row) => row.emp_id === id)
    setformdata(data)
    setmodal(true)
  };
  const handlestatus = (id) => {
    const data = employees.find((row) => row.emp_id === id)
    set_emp_status(data)
    setEditModal(true)
  };

  function search(emp) {
    return emp.employee_id.toUpperCase().includes(searchWord.toUpperCase()) || emp.name.toUpperCase().includes(searchWord.toUpperCase()) || emp.email.toUpperCase().includes(searchWord.toUpperCase()) || emp.department.toUpperCase().includes(searchWord.toUpperCase());
  }

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data.employees);
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
      <div className="flex justify-center items-center h-40 text-xl text-[#2b2d5b] font-semibold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-medium py-6">{error}</div>
    );
  }

  return (
    <>
      <div className="p-6">
        <div className="overflow-x-auto rounded-2xl shadow-lg flex flex-center justify-center">
          {
            employees.filter(search).length > 0 ?
              <table className="min-w-full divide-y divide-gray-200">
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
                    employees.filter(search).map((datum) => (
                      <tr
                        key={datum.employee_id}
                        className="hover:bg-[#f7f7f7] cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4">{datum.employee_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {datum.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {datum.email}
                        </td>
                        <td className="px-6 py-4">{datum.department}</td>
                        <td className="px-6 py-4">{datum.designation}</td>
                        <td className="px-6 py-4">
                          <span className="bg-[#77DD77] text-white text-lg font-semibold px-3 py-1 rounded shadow">
                            {datum.status}
                          </span>
                        </td>
                        <td
                          className="px-6 py-4 text-xl text-center border-black hover:border-b-1 transition-all duration-200"
                          onClick={() => handleEdit(datum.emp_id)}
                        >
                          <MdEdit />
                        </td>
                        <td className="px-6 py-4 text-xl text-center border-black hover:border-b-1 transition-all duration-200"
                          onClick={() => handlestatus(datum.emp_id)}
                        >
                          <MdOutlineAppRegistration />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table> :
              <ErrorBox>
                No user found :(
              </ErrorBox>
          }


        </div>
        {formdata && (
          <Modal isOpen={modal} onClose={_ => {setmodal(false)}}>
            <EditUser
              employeeData={formdata}
            />
          </Modal>

        )}
        {
          emp_status && (
            <Status_Modal emp_status={emp_status} modal={editModal} setmodal={setEditModal} />
          )
        }
      </div>
      <ToastContainer />
    </>
  );
};

export default Table;
