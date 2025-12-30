import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getEmployees, editManagerReview } from "../../Api/Endpoints/endpoints";
import { GetterContext } from "../Context/NewContext";

const QauterlyEditReviewFrom = ({ current, onReviewEditted }) => {
        const { register, handleSubmit, reset, formState: { errors } } = useForm(
            {
                defaultValues: { ...current }
            }
        );
        const [emps, setEmps] = useState([]);
        const [selEmp, setSelEmp] = useState(1);
        const { MRActions, managers } = useContext(GetterContext);
    
        async function onSubmit(data) {
            let review = data;
            review.employee = selEmp;
            const res = await editManagerReview(current.id, review);
            onReviewEditted(res);
            toast.success('Editted manager review');
        }
    
  return (
    <>
        <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col overflow-y-auto max-h-[75vh] scroll-smooth md:scroll-auto ">
                   
                    
                      <label className='font-bold'>
                        Summary of KPIs assesed*
                    </label>
                    <input
                        aria-invalid={errors.summary_kpi ? 'true' : 'false'}
                        placeholder='Summary of KPIs Assessed' type='text' className='p-3 border-2 border-[#E1E1E1] rounded-md m-1' {...register('summary_kpi')} />
                    {errors.summary_kpi && <span className='text-red-500'>Please enter summary of kpis</span>}
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
                   
                  
                    <input
                        type='submit'
                        className='bg-[#312F54] border-0 text-white font-bold py-4 rounded-xl my-2 hover:cursor-pointer'
                    />
                </div>
            </form>
    </>
  )
}

export default QauterlyEditReviewFrom