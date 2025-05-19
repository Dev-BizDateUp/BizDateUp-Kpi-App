import { useForm } from 'react-hook-form';
import { IoMdClose } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify'
import { createEmployee } from '../../Api/Endpoints/endpoints';
import { useState } from 'react';
const CreateDepartments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const { register, handleSubmit, formState: { errors }, trigger } = useForm();
  const [status, newstatus] = useState('Active');
const onSubmit = async (data) => {
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
          
          
              <div>
               <h2 className="text-2xl font-bold mb-4 bluecolor">     Create Departments
</h2>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
       <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Enter Department  Name</label>
                  <input
                    type="text"
                    {...register("emp_dept", { required: "Department  Name is required" })}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder='Enter Department  Name'
                  />
                  {errors.emp_dept && <p className="text-red-500 text-sm">{errors.emp_dept.message}</p>}
                </div>

       <div className="flex justify-between">
                
                 <button
                  type="submit"
                  className="px-4 py-2 bg-blue cursor-pointer text-white rounded w-full"
                >
                  Submit
                </button>
              </div>
    </form>
             
              </div>
     
          </div>
        </div>
      )}
    </div>
     <ToastContainer />
</>
    
  );
};

export default CreateDepartments;
