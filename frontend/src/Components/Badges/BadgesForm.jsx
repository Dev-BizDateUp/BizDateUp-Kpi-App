import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getEmployees,
} from "../../Api/Endpoints/endpoints";
import { AuthContext, GetterContext } from "../Context/NewContext";
import { createBadge, getEmployees_provided_badges } from "../../Api/Endpoints/BadgesEndpoints.js/endpoint";

const BadgesForm = () => {
  const { employees } = useContext(GetterContext);
  const { userData } = useContext(AuthContext);
  const [num, setNum] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [emps, setEmps] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getEmployees();
      setEmps(res.employees);
      const fetchbadges = await getEmployees_provided_badges(userData?.id)
      setNum(fetchbadges.result.finduser.length)
    })();
  }, []);

  const filteredname = emps.map((emp) => emp.name);

  const data = filteredname.filter(
    (name) =>
      name !== "Investor_Number" &&
      name !== "Aalain New" &&
      name !== "asdas" &&
      name !== employees.find((e) => e.id == userData.id)?.name
  );
  const onSubmit = async (formData) => {
    const payload = {
      giver_name: employees.find((e) => e.id == userData.id)?.name,
      receiver_name: formData.employeeName,
      comment: formData.comment,
      status: "Pending",
    };

    try {
      const data = await createBadge(payload);
      if (data.error === null) {
        const newCount = data?.result?.data?.totalCount;
        setNum(newCount);
        toast.success("Badge Given Successfully!");
        reset();
      } else {
        toast.error("You exceeded the limit of giving badges");
      }
    } catch (e) {
      toast.error("You exceeded the limit of giving badges");
    }
  };

  return (
    <div className="pt-5 ">
      <h2 className="xl:text-xl text-lg capitalize font-semibold mb-4">
        Give a badge To Employee
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Employee Name */}
        <div>
          <label className="block text-lg font-medium mb-1">
            Select Employee Name
          </label>
          <select
            {...register("employeeName", {
              required: "Employee name is required",
            })}
            className="w-full border rounded-md p-2 focus:outline-none"
          >
            <option value="" disabled>
              Select Employee Name
            </option>
            {data.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          {errors.employeeName && (
            <p className="text-red-500 text-lg">
              {errors.employeeName.message}
            </p>
          )}
        </div>

        {/* Comments */}
        <div>
          <label className="block text-lg font-medium mb-1">
            Comments <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter comment"
            {...register("comment", { required: "Comment is required" })}
            className="w-full border rounded-md p-2 focus:outline-none"
          />
          {errors.comment && (
            <p className="text-red-500 text-lg">{errors.comment.message}</p>
          )}
          <p>You have {num ? num : 0} / 3 Badges Remaining this Month</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-yellow-500 text-white font-medium py-2 rounded-md hover:bg-yellow-600 transition"
        >
          Submit
        </button>
      </form>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default BadgesForm;
