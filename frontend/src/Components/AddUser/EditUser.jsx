import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppContext } from '../Context/Context';
import { getDepartments } from '../../Api/Endpoints/endpoints';


const EditUser = ({ employeeData }) => {
  const { register, handleSubmit, reset } = useForm();
  const { dept, designation } = useAppContext()

  useEffect(() => {
    // console.log(employeeData)
    // if (employeeData) {
    //   reset(employeeData);
    // }
  }, [employeeData, reset]);
  const onSubmit = async (data) => {
    // console.log(data);

    try {
      const response = await createEmployee(added);
      if (response?.id || response?.success) {
        toast.success('Employee created successfully!');
        reset();
      } else {
        toast.error('Unexpected response from server.');
      }
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Something went wrong';
      toast.error(message);
    }
  };
  const inputStyle = 'm-1 p-2 rounded-md border-1 border-black';
  const containerStyle = 'flex flex-col';
  return (
    <form onSubmit={handleSubmit(onSubmit)} >
      <div className="space-y-4 flex flex-col overflow-y-auto max-h-[80vh] scroll-smooth md:scroll-auto">
        <div className='text-3xl'>Edit Employee</div>
        <div className={containerStyle}>
          <label>Employee Name</label>
          <input className={inputStyle} defaultValue={employeeData.name} {...register("emp_name")} />
        </div>

        <div className={containerStyle}>
          <label>Department</label>
          <select
            {...register("emp_department")}
            className='p-2 border-1 border-black rounded-md'
          >
            {
              dept.map(d => (
                <option value={d.name}>
                  {d.name}
                </option>
              ))
            }
          </select>
          {/* <input className={inputStyle} defaultValue={employeeData.department} {...register("emp_department")} /> */}
        </div>

        <div className={containerStyle}>
          <label>Designation</label>
          <select
            className='p-2 border-1 border-black rounded-md'
            {...register("emp_role")}
          >
            {
              designation.map(d => (
                <option value={d.name}>
                  {d.name}
                </option>
              ))
            }
          </select>
          {/* <input className={inputStyle} defaultValue={employeeData.designation} {...register("emp_role")} /> */}
        </div>

        <div className={containerStyle}>
          <label>Company</label>
          <input className={inputStyle} defaultValue={employeeData.company} {...register("emp_company")} />
        </div>

        <div className={containerStyle}>
          <label>Employee Type</label>
          <select defaultValue={employeeData.employee_type} className={inputStyle} {...register("emp_type")}>
            <option value="contractor">Contractor</option>
            <option value="fulltime">Full-time</option>
          </select>
        </div>

        <div className={containerStyle}>
          <label>Phone Number</label>
          <input defaultValue={employeeData.phone} className={inputStyle} {...register("emp_phone_number")} />
        </div>

        <div className={containerStyle}>
          <label>Email</label>
          <input defaultValue={employeeData.email} className={inputStyle} type="email" {...register("emp_email")} />
        </div>

        <div className={containerStyle}>
          <label>Image URL</label>
          <input defaultValue={employeeData.image ?? ""} className={inputStyle} {...register("emp_image")} />
        </div>

        <div className={containerStyle}>
          <label>Status</label>
          <select defaultValue={employeeData.status} className={inputStyle} {...register("status")}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button className='border-2 border-green-500 rounded-md p-2 hover:cursor-pointer hover:bg-green-500 hover:text-white' type="submit">Submit</button>
      </div>

    </form>
  );
};

export default EditUser;
