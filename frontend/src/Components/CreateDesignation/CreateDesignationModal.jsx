import React from 'react'
import { useForm } from 'react-hook-form';
import { IoMdClose } from "react-icons/io";
import { useAppContext } from '../Context/Context';
import { createDesignation } from '../../Api/Endpoints/endpoints';
const CreateDesignationModal = () => {
  const { dept } = useAppContext();


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await createDesignation(data);
      if (response?.id || response?.success) {
        //  toast.success('Employee created successfully!');
        //  reset();
        //  setTimeout(() => {
        //    closeModal();
        //  }, 1000); 
      } else {
        //  toast.error('Unexpected response from server.');
      }
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Something went wrong';
      //  toast.error(message);
    }
  };

  return (



      <>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Department Name Dropdown */}
          <div>
            <label className="block mb-1 font-medium text-black">Select Dept Name</label>
            <select
              {...register('department_name', { required: 'Department is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              defaultValue=""
            >
              <option value="" disabled>
                Dept Name
              </option>
              {
                dept.map((item)=>{
                  return(
                  <option value={item.name}>{item.name}</option>
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
              type="text"
              placeholder="Designation"
              {...register('designation_name', { required: 'Designation is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.designation && (
              <p className="text-red-500 text-sm mt-1">{errors.designation.message}</p>
            )}
          </div>

      {/* Designation Input */}
      <div>
        <label className="block mb-1 font-medium text-black">Enter Designation</label>
        <input
          type="text"
          placeholder="Designation"
          {...register('designation', { required: 'Designation is required' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.designation && (
          <p className="text-red-500 text-sm mt-1">{errors.designation.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 bg-[#312F52] text-white font-semibold rounded-md  transition"
      >
        Submit
      </button>
    </form>
      
      </>
  );
};

export default CreateDesignationModal