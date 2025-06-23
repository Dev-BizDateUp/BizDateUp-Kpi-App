import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAppContext } from '../Context/Context';
import { getDepartments, editEmployee } from '../../Api/Endpoints/endpoints';


const EditUser = ({ employeeData, setEmployees, employees }) => {
  const { register, handleSubmit, reset } = useForm();
  const { dept, designation } = useAppContext()
  const [selDept, setSelDept] = React.useState(0);
  const [selDesg, setSelDesg] = React.useState(0);

  const [canSend, setCanSend] = useState(true);


  useEffect(() => {
    // console.log(employeeData)
    // if (employeeData) {
    //   reset(employeeData);
    // }
  }, [employeeData, reset]);
  const onSubmit = async (data) => {
    // console.log('Form submitted with data:', data);
    // console.log(employeeData);
    // console.log(data);
    if (canSend) {
      setCanSend(false);
      const added = {
        name: data.emp_name,
        department_id: parseInt(data.emp_department),
        designation_id: parseInt(data.emp_role),
        company: data.emp_company,
        employee_type: data.emp_type,
        phone: data.emp_phone_number,
        email: data.emp_email,
        image: data.emp_image,
      };
      console.log("to be updated info : ", added);
      try {
        const response = await editEmployee(employeeData.employee_id, added);
        if (response?.id || response?.success) {
          toast.success('Employee editted successfully!');
          reset();
          // window.location.reload();
          // setEmployees([
          //   ...employees,
          //   added
          // ])
        } else {
          toast.error('Unexpected response from server.');
        }
      } catch (err) {
        const message = err?.response?.data?.message || err.message || 'Something went wrong';
        toast.error(message);
      }
    } else {
      toast.warn("Please wait")
    }
    setCanSend(true)
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
            onChange={e => { console.log(`department selection ${e.target.value}`); setSelDept(e.target.value) }}
          >
            {
              dept.map(d => (
                <option value={d.id}>
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
              designation.filter(p => p.department_id == selDept).map(d => (
                <option value={d.id}>
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
            <option value="fulltime">Intern</option>
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


        <button className='rounded-md p-2 hover:cursor-pointer bg-[#312F52] text-white' type="submit">Submit</button>
      </div>

    </form>
  );
};

export default EditUser;
