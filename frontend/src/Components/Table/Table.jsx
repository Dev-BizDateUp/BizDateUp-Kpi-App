import React, { useEffect, useState } from "react";
import { getEmployees } from "../../Api/Endpoints/endpoints";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdOutlineAppRegistration } from "react-icons/md";
import EditUser from "../AddUser/EditUser";

const Table = ({ headers }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [formdata, setformdata] = useState(null)

  const handleEdit = (id) => {
    const data = employees.find((row) => row.emp_id === id)
    console.log(data);
    setformdata(data)
  };

  
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
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
    <div className="p-6">
      <div className="overflow-x-auto rounded-2xl shadow-lg">
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
            {employees.map((datum) => (
              <tr
                key={datum.id}
                className="hover:bg-[#f7f7f7] cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">{datum.emp_id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {datum.emp_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {datum.emp_email}
                </td>
                <td className="px-6 py-4">{datum.emp_department}</td>
                <td className="px-6 py-4">{datum.emp_role}</td>
                <td className="px-6 py-4">
                  <span className="bg-[#77DD77] text-white text-lg font-semibold px-3 py-1 rounded shadow">
                    {datum.status}
                  </span>
                </td>
                <td
                  className="px-6 py-4 text-xl text-center"
                  onClick={() => handleEdit(datum.emp_id)}
                >
                  <MdEdit />
                </td>
                <td className="px-6 py-4 text-xl text-center">
                  <MdOutlineAppRegistration />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            {formdata && (
        <div className="mt-6">
          <EditUser
            employeeData={formdata}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
