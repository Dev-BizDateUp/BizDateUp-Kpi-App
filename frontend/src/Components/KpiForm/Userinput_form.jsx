import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { GetterContext } from "../Context/NewContext";
import { getKPIsForEmployee } from "../../Api/Endpoints/endpoints";
import { Toaster } from "react-hot-toast";

const Userinput_form = ({
  heading,
  onSubmitApi,
  defaultValues,
  onDateChange,
}) => {
  const { me } = useContext(GetterContext);
  const [fetchpersonal, setfetchpersonal] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const today = new Date();
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(today.getDate() - 2);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      entry_date: formatDate(today),
    },
  });

  /* 🔹 Fetch KPIs */
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }

    getKPIsForEmployee(me.id)
      .then((res) => {
        setfetchpersonal(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load KPIs");
      });
  }, [defaultValues, reset, me.id]);

  const activeKpis = fetchpersonal.filter(
    (kpi) => kpi.target !== null && kpi.is_active !== false
  );

  /* 🔹 Submit handler */
  const onSubmit = async (formData) => {
    if (!onSubmitApi) return;

    const payload = {
      entry_date: formData.entry_date,
      kpis: activeKpis.map((kpi) => ({
        kpi_id: kpi.id,
        value: Number(formData.values?.[kpi.id]),
      })),
    };

    try {
      setSubmitting(true);
      const data = await onSubmitApi(payload);
      // console.log(data);  
      toast.success("KPI Data Submitted Successfully");
      reset({ entry_date: formData.entry_date });
    } catch (error) {
      // console.log(error);
      if (error?.response?.status === 409) {
        toast.error(error.response.data.message);
        // console.log(error.response.data.message); 
      } else {
        toast.error("Something went wrong. Please try again");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
              <Toaster position="top-right" />
      {activeKpis.length > 0 ? (

        <div className="p-6">
          <h2 className="text-2xl text-center mb-6">{heading}</h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="shadow-lg p-6 rounded-lg"
          > 
            {/* DATE INPUT */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">Select Date</label>
              <input
                type="date"
                {...register("entry_date", { required: true })}
                // min={formatDate(twoDaysAgo)}
                // max={formatDate(today)}
                onChange={(e) => onDateChange?.(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>

            {/* KPI INPUTS */}
            {activeKpis.map((kpi) => (
              <div key={kpi.id} className="flex justify-between mb-4">
                <p className="font-medium">{kpi.title}</p>
                <input
                  type="number"
                  {...register(`values.${kpi.id}`, {
                    valueAsNumber: true,
                  })}
                  className="bg-[#F2EDED] p-2 rounded w-32"
                />
              </div>
            ))}

            <button
              type="submit"
              // disabled={submitting}
              className="mt-6 w-full bg-[#687FE5] text-white p-3 rounded-lg disabled:opacity-50"
            >
              submit
            </button>
          </form>
        </div>
      ) : (
        <p className="text-center text-red-600 font-bold text-3xl">
          No KPI Assigned yet
        </p>
      )}
    </>
  );
};

export default Userinput_form;
