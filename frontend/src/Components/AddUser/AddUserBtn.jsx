import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { createEmployee } from "../../Api/Endpoints/endpoints";
import { data } from "react-router-dom";
import { useAppContext } from "../Context/Context";
import { set } from "lodash";
// import { add } from 'lodash';
const AddUserBtn = ({ employees, setEmployees }) => {
  const { designation, dept } = useAppContext();
  const [step, setStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [status, newstatus] = useState("Active");
  const [image, setImage] = useState(null);
  const [filtered_dept, setfiltered_dept] = useState([])
  const [department_err, setdepartment_err] = useState("")
  const maxImageSize_KB = 50; // Maximum image size in KB

  const [deptID, setDeptID] = useState(1); // Default to first department if available

  useEffect(() => {
    setDeptID(dept.length > 0 ? dept[0].id : 1); // Set default department ID if available
  }, []);

  const [canSend, setCanSend] = useState(true);

// Logic That Filter Designation Based on Department
useEffect(() => {
   const check = () => {
    if (!designation || designation.length === 0) {
      return "No Designation Available";
    } else {
      const filterdesignation = designation?.filter(
        (d) => d.department_id == deptID
      );
      setfiltered_dept(filterdesignation);
      if (!filterdesignation || filterdesignation.length === 0) {
        setdepartment_err("No Designation Available for this Department");
      }
      else {
        setdepartment_err("");
      }
      return filterdesignation
    }
  };
  console.log("Filtered Designation: ", filtered_dept);
  
  check();
}, [designation, deptID]);


  const onSubmit = async (data) => {
    if (canSend) {
      setCanSend(false);
      try {
        const formData = new FormData();

        // Append image only if it exists
        if (image) {
          formData.append("image", image); // actual File object
        }

        // Append form fields
        for (const key in data) {
          formData.append(key, data[key]);
        }

        // Append custom fields
        formData.append("status", status);

        // Use the helper function you created
        const result = await createEmployee(formData);

        if (result?.id || result?.success) {
          toast.success("Employee created successfully!");
          reset();
          setIsModalOpen(false);
          setEmployees([...employees, result.employee || data]);
        } else {
          toast.error(
            `Could not create new employee: ${result?.error || "Unknown error"}`
          );
        }
      } catch (err) {
        const message =
          err?.response?.data?.message || err.message || "Something went wrong";
        toast.error(message);
      }
    } else {
      toast.warn("Please wait");
    }
    setCanSend(true);
  };

  const handleImageUpload = (e) => {
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

  const handleNextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div>
        {/* Button to open the modal */}
        <div className="bg-[#DDDDDD] p-3">
          <button
            onClick={openModal}
            className="text-xl bg-white text-black px-1.5 py-1.5 rounded-lg cursor-pointer"
          >
            Create Employees
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-[#05050580]  flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md xl:w-[800px]  ">
              {/* Stepper UI */}
              <div className="flex justify-between items-center mb-6">
                {["Basic Details", "Advance Details"].map((label, index) => {
                  const current = index + 1 === step;
                  const completed = index + 1 < step;

                  return (
                    <div
                      key={index}
                      className="flex items-center w-full relative "
                    >
                      <div
                        className={`rounded-full h-8 w-8 flex items-center justify-center font-bold text-white 
                      ${
                        completed
                          ? "bg-green-500"
                          : current
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                      >
                        {completed ? "✓" : index + 1}
                      </div>
                      <span className="ml-2 text-sm">{label}</span>
                      {index < 1 && (
                        <div
                          className={`flex-grow h-1 mx-2 ${
                            step > index + 1 ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              {step === 1 && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold mb-4 bluecolor">
                      {" "}
                      Basic Employee Details
                    </h2>
                    <IoMdClose
                      className="text-3xl  cursor-pointer"
                      onClick={() => closeModal()}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Enter Employee Name
                    </label>
                    <input
                      type="text"
                      {...register("name", {
                        required: "Employee name is required",
                      })}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Enter Employee Name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Select Employee Department
                    </label>
                    <select
                      {...register("department_id", {
                        required: "Department is required",
                      })}
                      className="w-full p-2 border border-gray-300 rounded"
                      onChange={(e) => {
                        setDeptID(e.target.value);
                      }}
                    >
                      <option value="" disabled>
                        Select Employee Department
                      </option>
                      {dept?.map((item, index) => {
                        return (
                          <option key={index} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                    {errors.department_id && (
                      <p className="text-red-500 text-sm">
                        {errors.department_id.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Select Employee Role
                    </label>
                    <select
                      {...register("designation_id", {
                        required: "Role is required",
                      })}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="" disabled>
                        Select Role
                      </option>
                      {filtered_dept
                        .map((item, index) => (
                          <>
                            <option value={item.id} key={index}>
                              {item.name}
                            </option>
                          </>
                        ))}
                    </select>
{
                      department_err.length  === 0 ?   null : (
                        <p className="text-red-500 text-sm">
                          {department_err}
                        </p>
                      )
}
                    {errors.designation_id && (
                      <p className="text-red-500 text-sm">
                        {errors.designation_id.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Enter Employee Company
                    </label>
                    <input
                      type="text"
                      {...register("company", {
                        required: "Company is required",
                      })}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Enter Employee Company"
                    />
                    {errors.company && (
                      <p className="text-red-500 text-sm">
                        {errors.company.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center w-full">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-blue text-center text-white px-10 py-2  rounded cursor-pointer w-50 mx-auto"
                    >
                      Next
                    </button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <div className="overflow-y-auto h-[500px]">
                  <div className="flex justify-between">
                    <h2 className="text-2xl font-bold mb-4 bluecolor">
                      {" "}
                      Advance Employee Details
                    </h2>
                    <IoMdClose
                      className="text-3xl  cursor-pointer"
                      onClick={() => closeModal()}
                    />
                  </div>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 p-4"
                  >
                    {/* Employee ID */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        {...register("employee_id", {
                          required: "Employee ID is required",
                        })}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter Employee ID"
                      />
                      {errors.employee_id && (
                        <p className="text-red-500 text-sm">
                          {errors.employee_id.message}
                        </p>
                      )}
                    </div>

                    {/* Employee Type */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Employee Type
                      </label>
                      <select
                        {...register("employee_type", {
                          required: "Employee Type is required",
                        })}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="">Select Employee Type</option>
                        <option value="full-time">Permanent</option>
                        <option value="intern">Trainee</option>
                        <option value="contractor">On Contract</option>
                        <option value="temporary">Temporary</option>
                      </select>
                      {errors.employee_type && (
                        <p className="w-full p-2 border border-gray-300 rounded">
                          {errors.employee_type.message}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Phone Number"
                        {...register("phone", {
                          required: "Phone Number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Phone Number must be 10 digits",
                          },
                        })}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                        })}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter Email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Employee Image Upload */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Upload Employee Image
                      </label>
                      <input
                        type="file"
                        placeholder="Upload  Employee Image"
                        accept="image/*"
                        {...register("image")}
                        onChange={handleImageUpload}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      {errors.image && (
                        <p className="text-red-500 text-sm">
                          {errors.image.message}
                        </p>
                      )}

                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => window.open(imagePreview, "_blank")}
                          className="bg-black text-white px-2 py-2 text-sm rounded cursor-pointer"
                        >
                          Preview Image
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-4 py-2 bg-black text-white rounded w-70 cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue cursor-pointer text-white rounded w-70"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default AddUserBtn;
