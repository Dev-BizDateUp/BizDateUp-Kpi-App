import React, { useState } from "react";
import man from "../../assets/Table/man.png";
import { updateEmployeeStatus } from "../../Api/Endpoints/endpoints";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Status_Modal = ({ emp_status, modal, setmodal, onChanged }) => {

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newStatus = emp_status.status === "Active" ? "In Active" : "Active";
      await updateEmployeeStatus({
        id: emp_status.employee_id,
        status: newStatus,
      });
      toast.success("Employee status updated successfully ✅");
      setmodal(false);
      // window.location.reload();
      onChanged(emp_status.employee_id,newStatus);

    } catch (e) {
      console.error("Update failed:", e);
      toast.error("Failed to update employee status ❌");
    }
  };
  const handlemodal = () => {
    setmodal(false)
  }
  return (
    <>
      {
        modal ? <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handlemodal} >
              &times;
            </button>

            <h3 className="modal-title">
              Are you sure you want to{" "}
              {emp_status.status === "Active" ? "Inactivate" : "Activate"} this employee?
            </h3>

            <img className="modal-avatar" src={man} alt="employee" />

            <form onSubmit={handleSubmit}>
              <div className="flex justify-between gap-10 mt-4">
                <button
                  type="submit"
                  className="text-white bg-blue px-5 p-2 w-full rounded-2xl cursor-pointer hover:bg-black"
                >
                  Yes
                </button>

                <button
                  type="button"
                  className="text-white bg-blue px-5 p-2 w-full rounded-2xl cursor-pointer hover:bg-black"
                  onClick={handlemodal}
                >
                  No
                </button>
              </div>
            </form>
          </div>
        </div> : ""
      }
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Status_Modal;
