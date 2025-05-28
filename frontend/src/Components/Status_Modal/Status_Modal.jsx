import React from "react";
import man from "../../assets/Table/man.png";
import { updateEmployeeStatus } from "../../Api/Endpoints/endpoints";

const Status_Modal = ({ emp_status, closeModal }) => {
  const updateStatus = async () => {
    try {
      const newStatus = emp_status.status === "Active" ? "In Active" : "Active";

      await updateEmployeeStatus({
        id: emp_status.id,
        status: newStatus,
      });

      console.log("Employee status updated");
      closeModal();
    } catch (e) {
      console.error("Update failed:", e);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>

        <h3 className="modal-title">
          Are you sure you want to{" "}
          {emp_status.status === "Active" ? "Inactivate" : "Activate"} this employee?
        </h3>

        <img className="modal-avatar" src={man} alt="employee" />

        <div className="flex justify-between gap-10 mt-4">
          <button
            type="button"
            className="text-white bg-blue px-5 p-2 w-full rounded-2xl cursor-pointer hover:bg-black"
            onClick={updateStatus}
          >
            Yes
          </button>

          <button
            type="button"
            className="text-white bg-blue px-5 p-2 w-full rounded-2xl cursor-pointer hover:bg-black"
            onClick={closeModal}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Status_Modal;
