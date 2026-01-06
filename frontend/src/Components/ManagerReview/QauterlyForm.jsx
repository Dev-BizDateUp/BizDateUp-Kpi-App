import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getEmployees, addNewManagerReview } from '../../Api/Endpoints/endpoints';
import { GetterContext } from '../Context/NewContext';
import { useOutletContext } from "react-router-dom";
export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR-2 + i);
export const QUARTERS = [
  { value: 1, label: "Q1 (Jan – Mar)" },
  { value: 2, label: "Q2 (Apr – Jun)" },
  { value: 3, label: "Q3 (Jul – Sep)" },
  { value: 4, label: "Q4 (Oct – Dec)" },
];
const QauterlyForm = ({ onReviewCreation }) => {
    const { formState: { errors }, register, handleSubmit, reset } = useForm({
    defaultValues: {
      
    review_year: new Date().getFullYear(),
    review_quarter: "",
    summary_kpi: "",
    strengths: "",
    improvement: "",
    comment: "",
    rating: "",
    goals: "",
    actions: [],
   
            }
        });
        const { MRActions, managers } = useContext(GetterContext)
        const { me, myrole } = useContext(GetterContext)
        const [emps, setEmps] = useState([]);
        const [selEmp, setSelEmp] = useState(1);

const { onClose } = useOutletContext();
       async function onSubmit(data) {
  try {
    const payload = {
      review_type: "QUARTERLY",
      employee: selEmp.id,
      manager_name: me.name,

      review_year: data.review_year,
      review_quarter: data.review_quarter,

      summary_kpi: data.summary_kpi,
      strengths: data.strengths,
      improvement: data.improvement,
      comment: data.comment,

      rating: Number(data.rating),
      actions: data.actions,
      goal: data.goal,
    };

    // console.log("Quarterly CREATE payload →", payload);

    const res = await addNewManagerReview(payload);

    res.data.employees = selEmp;
    res.data.employees.designations = selEmp.designation;

    onReviewCreation?.(res.data);
    toast.success("Created quarterly manager review");

    reset();
    onClose();
  } catch (error) {
    console.error(error);
    toast.error("Failed to create quarterly review");
  }
}

    
        useEffect(() => {
  (async () => {
    const res = await getEmployees();
    const filteredEmployees = res.employees.filter(
      emp => emp.id !== me.id
    );
    setEmps(filteredEmployees);
    if (filteredEmployees.length > 0) {
      setSelEmp(filteredEmployees[0]);
    }
  })();
}, [me.id]);

    
  return (
  <>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col overflow-y-auto max-h-[75vh] scroll-smooth md:scroll-auto ">
                    <label className='font-bold'>
                        Select Employee*
                    </label>
                    <select
                        value={selEmp.id}
                        onChange={e => setSelEmp(emps.find(k => k.id == e.target.value))}
                        className='p-2 border-2 border-[#E1E1E1] rounded-md m-1'
                    >
                        {
                            emps.sort((a, b) => a.name.localeCompare(b.name)).map(e => (
                                <option value={e.id}>
                                    {e.name}
                                </option>
                            ))
                        }
                    </select>
                    <label className='font-bold'>
                        Employee ID*
                    </label>
                    <label className='p-2 border-2 border-[#E1E1E1] rounded-md m-1'>
                        {selEmp.employee_id}
                    </label>
                    <label className='font-bold'>
                        Employee Designation*
                    </label>
                    <label className='p-2 border-2 border-[#E1E1E1] rounded-md m-1'>
                        {selEmp.designation}
                    </label>
                    <label className='font-bold'>
                        Employee Department*
                    </label>
                    <label className='p-2 border-2 border-[#E1E1E1] rounded-md m-1'>
                        {selEmp.department}
                    </label>
{/*                     
<label className='font-bold'>Manager Name*</label>
<input
readOnly
  value={me?.name || ''}
  className='p-3 border-2 border-[#E1E1E1] rounded-md m-1 bg-gray-100 cursor-not-allowed'
/> */}

<label className="font-bold">Review Quarter *</label>

<select
  className={`p-3 border-2 rounded-md m-1 ${
    errors.review_quarter ? "border-red-500" : "border-[#E1E1E1]"
  }`}
  {...register("review_quarter", {
    required: "Review quarter is required",
    valueAsNumber: true,
  })}
>
  <option value="">Select Quarter</option>
  {QUARTERS.map((q) => (
    <option key={q.value} value={q.value}>
      {q.label}
    </option>
  ))}
</select>

{errors.review_quarter && (
  <span className="text-red-500 text-sm">
    {errors.review_quarter.message}
  </span>
)}


<label className="font-bold">Review Year *</label>
<select
  className={`p-3 border-2 rounded-md m-1
    ${errors.review_year ? "border-red-500" : "border-[#E1E1E1]"}
  `}
  {...register("review_year", {
    required: "Please select a review year",
    valueAsNumber: true, 
  })}
>
  <option value="" disabled>
    Select Year
  </option>

  {YEARS.map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>

{errors.review_year && (
  <span className="text-red-500 text-sm">
    {errors.review_year.message}
  </span>
)}

                    <label className="font-bold">
  Summary of KPIs assessed *
</label>

<input
  type="text"
  placeholder="Summary of KPIs Assessed"
  aria-invalid={errors.summary_kpi ? "true" : "false"}
  className={`p-3 border-2 rounded-md m-1 ${
    errors.summary_kpi ? "border-red-500" : "border-[#E1E1E1]"
  }`}
  {...register("summary_kpi", {
    required: "Summary of KPIs is required",
  })}
/>

{errors.summary_kpi && (
  <span className="text-red-500 text-sm">
    {errors.summary_kpi.message}
  </span>
)}

                    <label className='font-bold'>
                        Strengths Observed
                    </label>
                    <input placeholder='Enter Strengths Observed' type='text' className='p-3 border-2 border-[#E1E1E1] rounded-md m-1' {...register('strengths')} />
                    <label className='font-bold'>
                        Areas of improvement
                    </label>
                    <input placeholder='Enter Areas of Improvement' type='text' className='p-3 border-2 border-[#E1E1E1] rounded-md m-1' {...register('improvement')} />
                    <label className='font-bold'>
                        Additional comments
                    </label>
                    <input placeholder='Enter Additional Comments' type='text' className='p-3 border-2 border-[#E1E1E1] rounded-md m-1' {...register('comment')} />
                    <label className='font-bold'>
                        Overall Performance Rating*
                    </label>
                    <select
                        aria-invalid={errors.rating ? 'true' : 'false'}
                        {...register("rating", { required: "You must give a rating" ,valueAsNumber: true,})}
                        className='p-3 border-2 border-[#E1E1E1] rounded-md m-1'>
                        <option value="" disabled>Select Overall Performance Rating</option>
                        {
                            [1, 2, 3, 4, 5].map(r => (
                                <option value={r}>
                                    {r}
                                </option>
                            ))
                        }
                    </select>
                    {errors.rating && <span className='text-red-500'>Please select a rating</span>}
                    <label className='font-bold'>
                        Actions to be taken
                    </label>
                    <div className='flex flex-col gap-1'>
                        {
                            MRActions.map(mr => (
                                <label className="flex items-center gap-2 m-2">
                                    <input
                                        type="checkbox"
                                        className='w-4 h-4 border-2 border-[#E1E1E1] bg-[#E1E1E1] rounded-none appearance-none checked:bg-blue-600 checked:border-blue-600'
                                        value={mr.value}
                                        {...register('actions')}
                                    />
                                    {mr.text}
                                </label>
                            ))
                        }
                    </div>
                    <label className='font-bold'>
                        Goals/Expectations for Next Review Period
                    </label>
                    <input placeholder='Enter  Goals/Expectations for Next Review Period' type='text' className='p-3 border-2 border-[#E1E1E1] rounded-md m-1' {...register('goal')} />
                   
                    <button
                        type='submit'
                        className='bg-[#312F54] border-0 text-white font-bold py-4 rounded-xl my-2 hover:cursor-pointer'
                    >Submit</button>
                </div>
            </form>

        </>
  )
}

export default QauterlyForm