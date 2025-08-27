import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getEmployees,
} from "../../Api/Endpoints/endpoints";
import { AuthContext, GetterContext } from "../Context/NewContext";
import { createBadge } from "../../Api/Endpoints/BadgesEndpoints.js/endpoint";

const BadgesForm = () => {
  const { employees } = useContext(GetterContext);
  const { userData } = useContext(AuthContext);

// Tracks monthly badge count in localStorage, resetting to 0 when a new month starts.
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const currentBadgeMonth = `${currentYear}-${currentMonth}`;
  const [num, setNum] = useState(() => {
    const savedMonth = localStorage.getItem("badgemonth");
    const savedCount = localStorage.getItem("badgecount");
    if (savedMonth !== currentBadgeMonth) {
      localStorage.setItem("badgemonth", currentBadgeMonth);
      localStorage.setItem("badgecount", 0);
      return 0;
    }
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

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

  // ✅ API Call
  const onSubmit = async (formData) => {
    const payload = {
      giver_name: employees.find((e) => e.id == userData.id)?.name,
      receiver_name: formData.employeeName,
      comment: formData.comment,
      status: "Pending",
    };

    try {
      const data = await createBadge(payload);
      console.log(data?.result?.data?.totalCount);

      if (data.error === null) {
        const newCount = data?.result?.data?.totalCount;

        // ✅ Update count & month in localStorage
        localStorage.setItem("badgecount", newCount);
        localStorage.setItem("badgemonth", currentBadgeMonth);

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
          <p>You have {num} / 3 Badges Remaining this Month</p>
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
