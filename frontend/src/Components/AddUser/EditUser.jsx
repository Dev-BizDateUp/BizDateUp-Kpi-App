import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAppContext } from "../Context/Context";
import { editEmployee } from "../../Api/Endpoints/endpoints";

const EditUser = ({ employeeData, setEmployees, employees }) => {
  const { register, handleSubmit } = useForm();
  const { dept, designation } = useAppContext();

  const [deptID, setDeptID] = useState(employeeData.department_id || "");
  const [filteredDesignations, setFilteredDesignations] = useState([]);
  const [designationError, setDesignationError] = useState("");
  const [canSend, setCanSend] = useState(true);

  // Filter designations based on selected department
  useEffect(() => {
    if (!designation || designation.length === 0) return;

    const filtered = designation.filter(d => d.department_id == deptID);
    setFilteredDesignations(filtered);

    if (filtered.length === 0) {
      setDesignationError("No Designation Available for this Department");
    } else {
      setDesignationError("");
    }
  }, [designation, deptID]);

  const onSubmit = async (data) => {
    if (!canSend) return toast.warn("Please wait");

    setCanSend(false);
    const updatedEmployee = {
      name: data.emp_name,
      department_id: parseInt(data.emp_department),
      designation_id: parseInt(data.emp_role),
      company: data.emp_company,
      employee_type: data.emp_type,
      phone: data.emp_phone_number,
      email: data.emp_email,
      image: data.emp_image,
    };

    try {
      const response = await editEmployee(employeeData.employee_id, updatedEmployee);
      if (response?.id || response?.success) {
        toast.success("Employee edited successfully!");
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    }

    setCanSend(true);
  };

  const inputStyle = "m-1 p-2 rounded-md border border-black";
  const containerStyle = "flex flex-col";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 flex flex-col overflow-y-auto max-h-[80vh]">
        <h2 className="text-3xl">Edit Employee</h2>

        {/* Employee Name */}
        <div className={containerStyle}>
          <label>Enter Employee Name</label>
          <input
            className={inputStyle}
            defaultValue={employeeData.name}
            {...register("emp_name")}
          />
        </div>

        {/* Department Select */}
        <div className={containerStyle}>
          <label>Select Department</label>
          <select
            className={inputStyle}
            {...register("emp_department")}
            value={deptID}
            onChange={(e) => setDeptID(e.target.value)}
          >
            <option value="" disabled>Select Employee Department</option>
            {dept.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Designation Select */}
        <div className={containerStyle}>
          <label>Select Designation</label>
          <select
            className={inputStyle}
            {...register("emp_role")}
            defaultValue={employeeData.designation_id}
          >
            {filteredDesignations.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          {designationError && (
            <p className="text-red-500 text-sm">{designationError}</p>
          )}
        </div>

        {/* Company Name */}
        <div className={containerStyle}>
          <label>Enter Company Name</label>
          <input
            className={inputStyle}
            defaultValue={employeeData.company}
            {...register("emp_company")}
          />
        </div>

        {/* Employee Type */}
        <div className={containerStyle}>
          <label>Select Employee Type</label>
          <select
            className={inputStyle}
            defaultValue={employeeData.employee_type}
            {...register("emp_type")}
          >
            <option value="full-time">Permanent</option>
            <option value="intern">Trainee</option>
            <option value="contractor">On Contract</option>
            <option value="temporary">Temporary</option>
          </select>
        </div>

        {/* Phone */}
        <div className={containerStyle}>
          <label>Phone Number</label>
          <input
            className={inputStyle}
            defaultValue={employeeData.phone}
            {...register("emp_phone_number")}
          />
        </div>

        {/* Email */}
        <div className={containerStyle}>
          <label>Email</label>
          <input
            className={inputStyle}
            type="email"
            defaultValue={employeeData.email}
            {...register("emp_email")}
          />
        </div>

        {/* Image URL */}
        <div className={containerStyle}>
          <label>Image URL</label>
          <input
            className={inputStyle}
            defaultValue={employeeData.image ?? ""}
            {...register("emp_image")}
          />
        </div>

        <button
          className="rounded-md p-2 bg-[#312F52] text-white hover:opacity-90"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default EditUser;
