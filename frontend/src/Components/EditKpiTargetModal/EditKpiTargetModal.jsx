import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { updateEmployeeTarget } from "../../Api/Endpoints/endpoints";
import { ToastContainer, toast } from "react-toastify";

const EditKpiTargetModal = ({ rowdata, handleCloseModal }) => {
  const { emp_id } = useParams();

  const kpi_id = rowdata.id;
  const int = parseInt(emp_id);
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      employee_id: int,
      target: rowdata.target,
      kpi_id: kpi_id,
    },
  });
  const onSubmit = async (data) => {
    const response = await updateEmployeeTarget(kpi_id, data);
    if (response) {
      console.log(response);
    } else {
      console.log("Something Went Wrong From Frontend");
    }
  };

  // useEffect(() => {
  //   if (rowdata.target === null) {
  //     return toast.error("KPI Has No Target");
  //   }
  // }, [rowdata]);
  return (
    <>
      {rowdata.target === null ? (
        <>
          <p
            className="text-2xl text-left m-2 text-red-800
"
          >
            Unable To Update KPI Because It Has No Target
          </p>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <label htmlFor="" className="text-2xl mt-5 px-3">
              Enter Target
            </label>
            <div className="px-4 w-full">
              <input
                required
                className="text-xl mt-5 w-full p-3 mb-5 rounded-xl"
                {...register("target")}
              />
            </div>
            <input
              onClick={() => {
                handleCloseModal();
                alert("KPI Updated Successfully");
              }}
              type="submit"
              className=" text-white text-xl p-2  cursor-pointer bg-[#2B2D5B] rounded-xl "
            />
          </form>
        </>
      )}
      <ToastContainer />
    </>
  );
};

export default EditKpiTargetModal;
