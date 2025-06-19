import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import ErrorBox from '../ErrorBox'
import { IoMdClose } from "react-icons/io";
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppContext } from '../Context/Context';
import { createDesignation } from '../../Api/Endpoints/endpoints';
import Modal from '../Modal';

const CreateDesignationModal = ({ designation, setDesign, onComplete }) => {
  const { dept } = useAppContext();

  const [created, setCreated] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setCreated(false);

      const response = await createDesignation({
        department_id: parseInt(data.department_name),
        name: data.designation_name
      });
      // console.log(response);
      if (response.message == 'Designation created successfully') {
        setCreated(true);
        setDesign([
          ...designation,
          {
            department_id: response.data.department_id,
            dept_name: response.data.dept_name,
            id: response.data.id,
            name: data.designation_name,
            emp_count: 0 // Assuming initial employee count is 0
          }
        ])
        toast.success('Designation created successfully!');
        onComplete();

      } else {
        // console.log("Error while creating designation!")
        // console.log(`error is ${response.data.error}`)
        setErr(response.data.error)
        toast.error('Unexpected response from server.');
      }
    } catch (err) {
      const message = err?.response?.data.error || err.message || 'Something went wrong';
      console.log(`Could not create designation ${err}`);
      setErr(err);
      toast.error(message);
    }
  };

  const [err, setErr] = useState("");

  return (
    <>
      {created &&
        <>
          <div className='font-xl text-green-500'>
            Created designation sucessfully!
          </div>
        </>
      }
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Department Name Dropdown */}
        <div>
          <label className="block mb-1 font-medium text-black">Select Dept Name</label>
          <select
            {...register('department_name', { required: 'Department is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            defaultValue={dept[0].name}
          >
            <option value="" disabled>
              Dept Name
            </option>
            {
              dept.map((item) => {
                return (
                  <option value={item.id}>{item.name}</option>
                )
              })
            }
          </select>
          {errors.department && (
            <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
          )}
        </div>

        {/* Designation Input */}
        <div>
          <label className="block mb-1 font-medium text-black">Enter Designation</label>
          <input
            name='name'
            type="text"
            placeholder="Designation"
            {...register('designation_name', { required: 'Designation is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.designation && (
            <p className="text-red-500 text-sm mt-1">{errors.designation.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-[#312F52] text-white font-semibold rounded-md hover:cursor-pointer hover:bg-blue-500 transition"
        >
          Submit
        </button>
      </form>

    </>
  );
};

export default CreateDesignationModal