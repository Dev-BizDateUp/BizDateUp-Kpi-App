import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getEmployees, editManagerReview } from "../../Api/Endpoints/endpoints";
import { GetterContext } from "../Context/NewContext";

function EditReviewForm({ current, onReviewEditted }) {

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
                        Manager Name
                    </label>
                    <select
                        // defaultValue={current.manager_name}
                        placeholder='Enter Manager Name'
                        type='text'
                        className='p-3 border-2 border-[#E1E1E1] rounded-md m-1'
                        aria-invalid={errors.manager_name ? "true" : 'false'}
                        {...register('manager_name', { required: "Manager name is required" })}
                    >
                        {
                            managers.map(m => (
                                <option value={m}>
                                    {m}
                                </option>
                            ))
                        }
                    </select>
                    {errors.manager_name && <span className="text-red-500">Please select manager</span>}
                    {/* <input defaultValue={current.manager_name} placeholder='Enter Manager Name' type='text' className='p-3 border-2 border-[#E1E1E1] rounded-md m-1' {...register('manager_name')} /> */}
                    <label className='font-bold'>
                        Review Dates
                    </label>
                    <input
                        // defaultValue={current.review_date}
                        className='p-3 border-2 border-[#E1E1E1] rounded-md m-1'
                        type='datetime-local'
                        aria-invalid={errors.review_date ? 'true' : 'false'}
                        {...register('review_date', { required: "Review date is required" })}
                    />
                    {errors.review_date && <span className="text-red-500">Please select review date</span>}
                    <label className='font-bold'>
                        Summary of KPIs assesed
                    </label>
                    <input
                        // defaultValue={current.summary_kpi}
                        placeholder='Summary of KPIs Assessed'
                        type='text'
                        className='p-3 border-2 border-[#E1E1E1] rounded-md m-1'
                        {...register('summary_kpi')}
                    />
                    <label className='font-bold'>
                        Strengths Observed
                    </label>
                    <input
                        // defaultValue={current.strengths}
                        placeholder='Enter Strengths Observed'
                        type='text'
                        className='p-3 border-2 border-[#E1E1E1] rounded-md m-1'
                        {...register('strengths')}
                    />
                    <label className='font-bold'>
                        Areas of improvement
                    </label>
                    <input
                        // defaultValue={current.improvement}
                        placeholder='Enter Areas of Improvement'
                        type='text'
                        className='p-3 border-2 border-[#E1E1E1] rounded-md m-1'
                        {...register('improvement')}
                    />
                    <label className='font-bold'>
                        Additional comments
                    </label>
                    <input
                        // defaultValue={current.comment}
                        placeholder='Enter Additional Comments'
                        type='text'
                        className='p-3 border-2 border-[#E1E1E1] rounded-md m-1'
                        {...register('comment')}
                    />
                    <label className='font-bold'>
                        Overall Performance Rating
                    </label>
                    <select
                        {...register("rating", { required: "You must give a rating" })}
                        // defaultValue={current.rating}
                        aria-invalid={errors.rating ? 'true' : 'false'}
                        className='p-3 border-2 border-[#E1E1E1] rounded-md m-1'>
                        {
                            [1, 2, 3, 4, 5].map(r => (
                                <option value={r}>
                                    {r}
                                </option>
                            ))
                        }
                    </select>
                    {errors.rating && <span className="text-red-500">Please select rating</span>}
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
                                        defaultChecked={current.actions.includes(mr.value)}
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
                    <input
                        placeholder='Enter  Goals/Expectations for Next Review Period'
                        type='text'
                        className='p-3 border-2 border-[#E1E1E1] rounded-md m-1'
                        {...register('goal')}
                    />
                    <input
                        type='submit'
                        className='bg-[#312F54] border-0 text-white font-bold py-4 rounded-xl my-2 hover:cursor-pointer'
                    />
                </div>
            </form>
        </>
    );
}

export default EditReviewForm;