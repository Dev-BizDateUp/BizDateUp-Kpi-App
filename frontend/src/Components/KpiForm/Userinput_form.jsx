import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GetterContext } from "../Context/NewContext";
import { getKPIsForEmployee } from "../../Api/Endpoints/endpoints";

const Userinput_form = ({
  heading,
  onSubmitApi,
  defaultValues,
  onDateChange,
}) => {
  const { me } = useContext(GetterContext);

  const [assignedKpis, setAssignedKpis] = useState([]);
  const [loading, setLoading] = useState(false);
// console.log(assignedKpis);

  const formatDate = (date) => date.toISOString().split("T")[0];
  const today = new Date();
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(today.getDate() - 2);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      entry_date: formatDate(today),
    },
  });


  useEffect(() => {
    if (!me?.id) return;

    setLoading(true);
    getKPIsForEmployee(me.id) 
      .then((data) => {
     
        setAssignedKpis(
          data.data.data.filter(
            (kpi) => kpi.is_active !== false && kpi.target !== null
          )
        );
      })
      .finally(() => setLoading(false));
  }, [me]);

 
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);


  const onSubmit = async (formData) => {
    if (!onSubmitApi) return;

    const payload = {
      entry_date: formData.entry_date,
      kpis: assignedKpis.map((kpi) => ({
        kpi_id: kpi.id,
        value: Number(formData.values?.[kpi.id]),
      })),
    };

    // console.log("FINAL PAYLOAD", payload);
    await onSubmitApi(payload);
    reset({ entry_date: formatDate(today) });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-center mb-6">{heading}</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow-lg p-6 rounded-lg"
      >
  
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

        {loading ? (
          <p className="text-center">Loading KPIs…</p>
        ) : assignedKpis.length === 0 ? (
          <p className="text-center text-gray-500">
            No KPIs assigned to you
          </p>
        ) : (
          assignedKpis?.map((kpi) => (
            <div key={kpi.id} className="flex justify-between mb-4">
              <p className="font-medium">{kpi?.title}</p>
              <input
                type="number"
                {...register(`values.${kpi?.id}`, {
                  valueAsNumber: true,
                })}
                className="bg-[#F2EDED] p-2 rounded"
              />
            </div>
          ))
        )}

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
