import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { editEmployee, patchEmployee } from "../../Api/Endpoints/endpoints";
import { GetterContext, SetterContext } from "../Context/NewContext";

const maxImageSize_KB = 50; // Maximum image size in KB


const EditUser = ({ employeeData, onSuccess }) => {
  const { register, handleSubmit } = useForm();
  const { departments, designations } = useContext(GetterContext);
  let { employees } = useContext(GetterContext);
  const { setEmployees } = useContext(SetterContext)

  const [deptID, setDeptID] = useState(employeeData.department_id || "");
  const [filteredDesignations, setFilteredDesignations] = useState([]);
  const [designationError, setDesignationError] = useState("");
  const [canSend, setCanSend] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);


  // Filter designations based on selected department
  useEffect(() => {
    console.log("Edit employee data ", employeeData)
    if (!designations || designations.length == 0) return;

    const filtered = designations.filter(d => d.department_id == deptID);
    setFilteredDesignations(filtered);

    if (filtered.length == 0) {
      setDesignationError("No Designation Available for this Department");
    } else {
      setDesignationError("");
    }
  }, [designations, deptID]);

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file.size > maxImageSize_KB * 1000) {
      toast.error(
        `Image size should be less than ${maxImageSize_KB}KB! Use an online image compressor to reduce the size, and/or reduce the image dimensions(size).`
      );
      setImagePreview(null);
      e.target.value = null; // Reset the file input
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (jpg, png, jpeg, etc.)");
      setImagePreview(null);
      e.target.value = null; // Reset the file input
      return;
    }
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const onSubmit = async (data) => {
    if (!canSend) return toast.warn("Please wait");

    setCanSend(false);
    const updatedEmployee = {
      name: data.emp_name,
      department_id: parseInt(data.emp_department),
      designation_id: (data.emp_role),
      company: data.emp_company,
      employee_type: data.emp_type,
      phone: data.emp_phone_number,
      email: data.emp_email,
      image: data.emp_image,
    };

    // console.log("data ",data); 
    // console.log("edditting employee ",updatedEmployee);

    const formData = new FormData();
    if (image) {
      formData.append("image", image); // actual File object
    }
    for (const key in updatedEmployee) {
      formData.append(key, updatedEmployee[key]);
    }

    try {
      console.log('edit employee form', formData);
      const response = await patchEmployee(employeeData.id, formData);
      if (response?.id || response?.success) {
        toast.success("Employee edited successfully!");
        // console.log("EMployees are ", employees)
        // console.log("response employee is ", response)
        const index = employees.findIndex(e => e.id == response.employee.id)
        employees[index] = response.employee
        employees[index].department = departments.find(d => d.id == employees[index].department_id).name
        employees[index].designation = designations.find(d => d.id == employees[index].designation_id).name
        setEmployees(employees)
        console.log("resultant employee is ", response)
        onSuccess();
      } else {
        toast.error("Unexpected response from server." + response.error);
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
            {departments.map((d) => (
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
            defaultValue={employeeData.designation_id + ""}
          >
            <option value={''}>
              Select Designation
            </option>
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
          <label>Image</label>
          <input
            className={inputStyle}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
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
