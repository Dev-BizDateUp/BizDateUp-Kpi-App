import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { createDepartments } from '../../Api/Endpoints/endpoints';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { IoClose } from "react-icons/io5";
import Departments from './Departments';
import SearchBar from '../SearchBar/SearchBar';

const CreateDepartments = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const openModal = () => {
    setIsClosing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsClosing(true); // Trigger fade-out
    setTimeout(() => {
      setIsModalOpen(false); // Actually unmount the modal
    }, 300); // Time matches transition
  };

  const [searchWord,setChangeWord] = useState("")

  const onSubmit = async (data) => {

    try {
      const response = await createDepartments(data);
      if (response?.id || response?.success) {
        toast.success('Employee created successfully!');
        reset();
        setTimeout(() => {
          closeModal();
        }, 1000); // Allow toast to show
      } else {
        toast.error('Unexpected response from server.');
      }
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Something went wrong';
      toast.error(message);
    }
  };

  return (
    <>
      <div>
        {/* Button to open the modal */}
        <div className="bg-[#DDDDDD] p-3">
          <button
            onClick={openModal}
            className="text-xl bg-white text-black px-1.5 py-1.5 rounded-lg cursor-pointer"
          >
            Create Departments
          </button>
        </div>

        <SearchBar title_text="Total No Of Departments" searchTextChanged={(word) => { setChangeWord(word) }} />


        {/* Modal */}
        {isModalOpen && (
          <div
            className={`fixed inset-0 bg-[#05050580] flex justify-center items-center z-50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'
              }`}
          >
            <div
              className={`bg-white p-6 rounded-lg shadow-md xl:w-[800px] transform transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                }`}
            >
              {/* ✨ Your Original Elements Start Here ✨ */}
              <div>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold mb-4 bluecolor">Create Departments</h2>
                  <IoClose size={24} className='cursor-pointer ' onClick={closeModal} />
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Enter Department Name</label>
                    <input
                      type="text"
                      {...register("name", { required: "Department Name is required" })}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Enter Department Name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name.message}</p>
                    )}
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
              {/* ✨ Your Original Elements End Here ✨ */}
            </div>
          </div>
        )}
      </div>
      <Departments searchWord={searchWord} />
      {/* Toast */}
      <ToastContainer />
    </>
  );
};

export default CreateDepartments;