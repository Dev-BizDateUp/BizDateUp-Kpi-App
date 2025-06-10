import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoMdClose } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify'
import { createEmployee } from '../../Api/Endpoints/endpoints';
import { data } from 'react-router-dom';
import { useAppContext } from '../Context/Context';
// import { add } from 'lodash';
const AddUserBtn = ({ employees, setEmployees }) => {
  const { designation, dept } = useAppContext()
  const [step, setStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, trigger, reset } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [status, newstatus] = useState('Active');

  const [deptID, setDeptID] = useState(1);

  const onSubmit = async (data) => {

    if (imagePreview) {
      const formData = new FormData();
      formData.append('image', imagePreview);

    }
    try {
      const added = { ...data, image: imagePreview, status: status };
      console.log(added);

      const response = await createEmployee(added);
      if (response?.id || response?.success) {
        toast.success('Employee created successfully!');
        reset();
        setEmployees([
          ...employees,
          added
        ]);
      } else {
        toast.error(`Could not create new employee: ${response.error}`);
      }
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Something went wrong';
      toast.error(JSON.stringify(err));
    }
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    console.log(file);
    console.log(URL.createObjectURL(file))
    if (file) {
      setImagePreview(URL.createObjectURL(file));
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
          <div className="fixed inset-0 bg-[#05050580]   flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md xl:w-[800px]">

              {/* Stepper UI */}
              <div className="flex justify-between items-center mb-6">
                {["Basic Details", "Advance Details"].map((label, index) => {
                  const current = index + 1 === step;
                  const completed = index + 1 < step;
                  console.log("This is current index " + index);


                  return (
                    <div key={index} className="flex items-center w-full relative ">
                      <div className={`rounded-full h-8 w-8 flex items-center justify-center font-bold text-white 
                      ${completed ? "bg-green-500" : current ? "bg-blue-600" : "bg-gray-300"}`}>
                        {completed ? "✓" : index + 1}
                      </div>
                      <span className="ml-2 text-sm">{label}</span>
                      {index < 1 && (
                        <div className={`flex-grow h-1 mx-2 ${step > index + 1 ? "bg-green-500" : "bg-gray-300"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
              {step === 1 && (

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold mb-4 bluecolor">      Basic Employee Details
                    </h2>
                    <IoMdClose className='text-3xl  cursor-pointer' onClick={() => closeModal()} />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Enter Employee Name</label>
                    <input
                      type="text"
                      {...register("name", { required: "Employee name is required" })}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder='Enter Employee Name'
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Select Employee Department</label>
                    <select
                      {...register("department_id", { required: "Department is required" })}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="" disabled>Select Employee Department</option>
                      {
                        dept?.map((item, index) => {
                          return (
                            <option>
                              {item.name}
                            </option>
                          )
                        })
                      }
                    </select>
                    {errors.department_id && <p className="text-red-500 text-sm">{errors.department_id.message}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Select Employee Role</label>
                    <select
                      {...register("designation_id", { required: "Role is required" })}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="" disabled>Select Role</option>
                      {
                        designation.map((item, index) =>
                        (
                          <>
                            <option>
                              {item.name}
                            </option>
                          </>
                        )
                        )
                      }
                    </select>

                    {errors.designation_id && <p className="text-red-500 text-sm">{errors.designation_id.message}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Enter Employee Company</label>
                    <input
                      type="text"
                      {...register("company", { required: "Company is required" })}
                      className="w-full p-2 border border-gray-300 rounded" placeholder='Enter Employee Company'
                    />
                    {errors.company && <p className="text-red-500 text-sm">{errors.company.message}</p>}
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

              {/* Step 2 (Add more fields or logic here) */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 bluecolor">      Advance Employee Details
                  </h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">

                    {/* Employee ID */}
                    <div>
                      <label className="block mb-1 text-sm">Employee ID</label>
                      <input
                        type="text"
                        {...register("employee_id", { required: "Employee ID is required" })}
                        className="border px-2 py-1 w-full text-sm" placeholder='Enter Employee ID'
                      />
                      {errors.employee_id && (
                        <p className="text-red-500 text-sm">{errors.employee_id.message}</p>
                      )}
                    </div>

                    {/* Employee Type */}
                    <div>
                      <label className="block mb-1 text-sm">Employee Type</label>
                      <select
                        {...register("employee_type", { required: "Employee Type is required" })}
                        className="border px-2 py-1 w-full text-sm"
                      >
                        <option value="">Select Employee Type</option>
                        <option value="full-time">Full-time</option>
                        <option value="intern">Intern</option>
                        <option value="contractor">Contractor</option>
                      </select>
                      {errors.employee_type && (
                        <p className="text-red-500 text-sm">{errors.employee_type.message}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block mb-1 text-sm">Phone Number</label>
                      <input
                        type="text" placeholder='Enter Phone Number'
                        {...register("phone", {
                          required: "Phone Number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Phone Number must be 10 digits",
                          },
                        })}
                        className="border px-2 py-1 w-full text-sm"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block mb-1 text-sm">Email</label>
                      <input
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        className="border px-2 py-1 w-full text-sm" placeholder='Enter Email'
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Employee Image Upload */}
                    <div>
                      <label className="block mb-1 text-sm">Upload Employee Image</label>
                      <input
                        type="file" placeholder='Upload  Employee Image'
                        accept="image/*"
                        {...register("image", { required: "Employee Image is required" })}
                        onChange={handleImageUpload}
                        className="border px-2 py-1 w-full text-sm"
                      />
                      {errors.image && (
                        <p className="text-red-500 text-sm">{errors.image.message}</p>
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
              {/* Close Modal Button */}
              <div className="flex justify-end mt-4">
                {/* <buttononClick={closeModal}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Close
              </buttononClick=> */}
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>

  );
};

export default AddUserBtn;
