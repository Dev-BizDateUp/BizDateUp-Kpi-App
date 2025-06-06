import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppContext } from '../Context/Context';

const EditUser = ({ employeeData }) => {
  const { register, handleSubmit, reset } = useForm();
  const { dept, designation } = useAppContext()

  useEffect(() => {
    if (employeeData) {
      reset(employeeData);
    }
  }, [employeeData, reset]);
  const onSubmit = async (data) => {
    console.log(data);


    //   try {
    //     const response = await createEmployee(added);
    //     if (response?.id || response?.success) {
    //      toast.success('Employee created successfully!');
    //       reset();
    //     } else {
    //       toast.error('Unexpected response from server.');
    //     }
    //   } catch (err) {
    //     const message = err?.response?.data?.message || err.message || 'Something went wrong';
    //     toast.error(message);
    //   }
  };
  const inputStyle = 'm-1 p-2 rounded-md border-1 border-black';
  const containerStyle = 'flex flex-col';
  return (
    <form onSubmit={handleSubmit(onSubmit)} >
      <div className="space-y-4 flex flex-col flex-wrap max-h-[80vh] scroll-smooth md:scroll-auto">
        <h1>Edit Employee</h1>
        <div className={containerStyle}>
          <label>Employee Name</label>
          <input className={inputStyle} {...register("emp_name")} />
        </div>

        <div className={containerStyle}>
          <label>Department</label>
          <input className={inputStyle} {...register("emp_department")} />
        </div>

        <div className={containerStyle}>
          <label>Role</label>
          <input className={inputStyle} {...register("emp_role")} />
        </div>

        <div className={containerStyle}>
          <label>Company</label>
          <input className={inputStyle} {...register("emp_company")} />
        </div>

        <div className={containerStyle}>
          <label>Employee ID</label>
          <input className={inputStyle} {...register("emp_id")} />
        </div>

        <div className={containerStyle}>
          <label>Employee Type</label>
          <select value="fulltime" className={inputStyle} {...register("emp_type")}>
            <option value="contractor">Contractor</option>
            <option value="fulltime">Full-time</option>
          </select>
        </div>

        <div className={containerStyle}>
          <label>Phone Number</label>
          <input className={inputStyle} {...register("emp_phone_number")} />
        </div>

        <div className={containerStyle}>
          <label>Email</label>
          <input className={inputStyle} type="email" {...register("emp_email")} />
        </div>

        <div className={containerStyle}>
          <label>Image URL</label>
          <input className={inputStyle} {...register("emp_image")} />
        </div>

        <div className={containerStyle}>
          <label>Status</label>
          <select value='Active' className={inputStyle} {...register("status")}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button className='border-2 border-green-400 rounded-md p-2 hover:cursor-pointer' type="submit">Submit</button>
      </div>

    </form>
  );
};

export default EditUser;
