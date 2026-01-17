import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getEmployees, addNewManagerReview } from '../../Api/Endpoints/endpoints';
import { GetterContext } from '../Context/NewContext';
import { CURRENT_YEAR, YEARS } from './QauterlyForm';
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" }
];

function ReviewForm({ onReviewCreation }) {
    const { formState: { errors }, register, handleSubmit, reset ,setValue} = useForm({
        defaultValues: {
            manager_name: '',
           review_year: CURRENT_YEAR,
            rating: '',
               improvement: '',
    manager_feedback: '',
    key_achievements: ''
        }
    });
    // const { MRActions, managers } = useContext(GetterContext)
    const { me, myrole } = useContext(GetterContext)
    const [emps, setEmps] = useState([]);
    const [selEmp, setSelEmp] = useState(1);
const navigate = useNavigate();
const { onClose } = useOutletContext();

  async function onSubmit(data) {
  try {
    const payload = {
      review_type: "MONTHLY",
      employee: selEmp.id,
      manager_name: me.name,

      review_year: data.review_year,
      review_month: data.review_month,

      improvement: data.improvement,
      rating: Number(data.rating),
      manager_feedback: data.manager_feedback,
      key_achievements: data.key_achievements,
    };



    const res = await addNewManagerReview(payload);

    res.data.employees = selEmp;
    res.data.employees.designations = selEmp.designation;

    onReviewCreation?.(res.data);
    toast.success("Created manager review");

    reset();
    onClose();
  } catch (error) {
    console.error(error);
    toast.error("Failed to create monthly review");
  }
}

    
       useEffect(() => {
  (async () => {
    const res = await getEmployees();
    const filteredEmployees = res.employees.filter(
      emp => emp.id !== me.id && emp.status === "Active"
    );
    setEmps(filteredEmployees);
    if (filteredEmployees.length > 0) {
      setSelEmp(filteredEmployees[0]);
    }
  })();
}, [me.id]);

useEffect(() => {
  const currentMonth = new Date().getMonth() + 1;
  setValue("review_month", currentMonth);
}, [setValue]);

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
       
 <label className="font-bold">Review Year *</label>

<select
  className={`p-3 border-2 rounded-md m-1 ${
    errors.review_year ? "border-red-500" : "border-[#E1E1E1]"
  }`}
  {...register("review_year", {
    required: "Review year is required",
    valueAsNumber: true,
  })}
>
  <option value="">Select Year</option>
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


      <label className="font-bold">Review Month *</label>

<select
  className={`p-3 border-2 rounded-md m-1 ${
    errors.review_month ? "border-red-500" : "border-[#E1E1E1]"
  }`}
  {...register("review_month", {
    required: "Review month is required",
    valueAsNumber: true,
  })}
>
  <option value="">Select Month</option>
  {MONTHS.map((m) => (
    <option key={m.value} value={m.value}>
      {m.label}
    </option>
  ))}
</select>

{errors.review_month && (
  <span className="text-red-500 text-sm">
    {errors.review_month.message}
  </span>
)}

                            <label className="font-bold">Areas of improvement *</label>
<input
  placeholder="Enter Areas of Improvement"
  className={`p-3 border-2 rounded-md m-1 ${
    errors.improvement ? "border-red-500" : "border-[#E1E1E1]"
  }`}
  {...register("improvement", {
    required: "Areas of improvement is required",
  })}
/>
{errors.improvement && (
  <span className="text-red-500 text-sm">
    {errors.improvement.message}
  </span>
)}

                             <label className='font-bold'>
                                 Overall Performance Rating*
                             </label>
                             <select
                                 aria-invalid={errors.rating ? 'true' : 'false'}
                                 {...register("rating", { required: "You must give a rating",valueAsNumber: true, })}
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
                            
                           <label className="font-bold">Manager Feedback *</label>
<input
  placeholder="Enter manager feedback"
  className={`p-3 border-2 rounded-md m-1 ${
    errors.manager_feedback ? "border-red-500" : "border-[#E1E1E1]"
  }`}
  {...register("manager_feedback", {
    required: "Manager feedback is required",
  })}
/>
{errors.manager_feedback && (
  <span className="text-red-500 text-sm">
    {errors.manager_feedback.message}
  </span>
)}

<label className="font-bold">Key Achievements *</label>

<input
  placeholder="Enter key achievements for this month"
  className={`p-3 border-2 rounded-md m-1 ${
    errors.key_achievements ? "border-red-500" : "border-[#E1E1E1]"
  }`}
  {...register("key_achievements", {
    required: "Key achievements are required",
  })}
/>

{errors.key_achievements && (
  <span className="text-red-500 text-sm">
    {errors.key_achievements.message}
  </span>
)}

                             <button
                                 type='submit'
                                 className='bg-[#312F54] border-0 text-white font-bold py-4 rounded-xl my-2 hover:cursor-pointer'
                             >Submit</button>
                         </div>
                     </form>

        </>
    )
}

export default ReviewForm;