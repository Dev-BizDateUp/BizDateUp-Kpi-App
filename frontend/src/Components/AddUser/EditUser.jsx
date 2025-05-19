import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const EditUser = ({ employeeData }) => {
  const { register, handleSubmit, reset } = useForm();

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
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Employee Name</label>
        <input {...register("emp_name")} />
      </div>

      <div>
        <label>Department</label>
        <input {...register("emp_department")} />
      </div>

      <div>
        <label>Role</label>
        <input {...register("emp_role")} />
      </div>

      <div>
        <label>Company</label>
        <input {...register("emp_company")} />
      </div>

      <div>
        <label>Employee ID</label>
        <input {...register("emp_id")} />
      </div>

      <div>
        <label>Employee Type</label>
        <select {...register("emp_type")}>
          <option value="contractor">Contractor</option>
          <option value="fulltime">Full-time</option>
        </select>
      </div>

      <div>
        <label>Phone Number</label>
        <input {...register("emp_phone_number")} />
      </div>

      <div>
        <label>Email</label>
        <input type="email" {...register("emp_email")} />
      </div>

      <div>
        <label>Image URL</label>
        <input {...register("emp_image")} />
      </div>

      <div>
        <label>Status</label>
        <select {...register("status")}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default EditUser;
