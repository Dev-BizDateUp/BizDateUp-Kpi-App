import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { GetterContext } from "../Context/NewContext";

const Userinput_form = ({
  heading,
  onSubmitApi,
  defaultValues,
  onDateChange,
}) => {
  const { kpis } = useContext(GetterContext);

  const formatDate = (date) => date.toISOString().split("T")[0];
  const today = new Date();
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(today.getDate() - 2);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      entry_date: formatDate(today),
    },
  });

  // ✅ RESET WHEN GET DATA ARRIVES
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const activeKpis = kpis.filter(
    (kpi) => kpi.target !== null && kpi.is_active !== false
  );

  const onSubmit = async (formData) => {
    if (!onSubmitApi) return;

    const payload = {
      entry_date: formData.entry_date,
      kpis: activeKpis.map((kpi) => ({
        kpi_id: kpi.id,
        value: Number(formData.values?.[kpi.id]),
      })),
    };
reset();
    console.log("FINAL PAYLOAD", payload);
    await onSubmitApi(payload);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-center mb-6">{heading}</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow-lg p-6 rounded-lg"
      >
        {/* DATE */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Select Date</label>
          <input
            type="date"
            {...register("entry_date", { required: true })}
            min={formatDate(twoDaysAgo)}
            max={formatDate(today)}
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
              className="bg-[#F2EDED] p-2 rounded"
            />
          </div>
        ))}

        <button
          type="submit"
          className="mt-6 w-full bg-[#687FE5] text-white p-3 rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Userinput_form;
