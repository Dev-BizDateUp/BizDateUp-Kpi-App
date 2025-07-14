import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getEmployees, editManagerReview } from "../../Api/Endpoints/endpoints";

function EditReviewForm({ current, onReviewEditted }) {

    const { register, handleSubmit, reset } = useForm();
    const [emps, setEmps] = useState([]);
    const [selEmp, setSelEmp] = useState(1);

    async function onSubmit(data) {
        let review = data;
        review.employee = selEmp;
        // console.log("form data",review)
        const res = await editManagerReview(current.id, review);
        console.log('Created manager review:', res)
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
                    <input defaultValue={current.manager_name} placeholder='Enter Manager Name' type='text' className='p-3 border-2 border-[#E1E1E1] rounded-md m-1' {...register('manager_name')} />
                    <label className='font-bold'>
                        Review Dates
                    </label>
                    <input defaultValue={current.review_date} className='p-3 border-2 border-[#E1E1E1] rounded-md m-1' type='datetime-local' {...register('review_date')} />
                    <label className='font-bold'>
                        Summary of KPIs assesed
                    </label>
                    <input defaultValue={current.summary_kpi} placeholder='Summary of KPIs Assessed' type='text' className='p-3 border-2 border-[#E1E1E1] rounded-md m-1' {...register('summary_kpi')} />
                    <label className='font-bold'>
                        Strengths Observed
                    </label>
                    <input defaultValue={current.strengths} placeholder='Enter Strengths Observed' type='text' className='p-3 border-2 border-[#E1E1E1] rounded-md m-1' {...register('strengths')} />
                    <label className='font-bold'>
                        Areas of improvement
                    </label>
                    <input defaultValue={current.improvement} placeholder='Enter Areas of Improvement' type='text' className='p-3 border-2 border-[#E1E1E1] rounded-md m-1' {...register('improvement')} />
                    <label className='font-bold'>
                        Additional comments
                    </label>
                    <input defaultValue={current.comment} placeholder='Enter Additional Comments' type='text' className='p-3 border-2 border-[#E1E1E1] rounded-md m-1' {...register('comment')} />
                    <label className='font-bold'>
                        Overall Performance Rating
                    </label>
                    <select
                        {...register("rating", { required: "You must give a rating" })}
                        defaultValue={current.rating}
                        className='p-3 border-2 border-[#E1E1E1] rounded-md m-1'>
                        {
                            [1, 2, 3, 4, 5].map(r => (
                                <option value={r}>
                                    {r}
                                </option>
                            ))
                        }
                    </select>

                    <label className='font-bold'>
                        Actions to be taken
                    </label>
                    <div className='flex flex-col gap-1'>
                        <label className="flex items-center gap-2 m-2">
                            <input
                                type="checkbox"
                                className='w-4 h-4 border-2 border-[#E1E1E1] bg-[#E1E1E1] rounded-none appearance-none checked:bg-blue-600 checked:border-blue-600'
                                value="no_action"
                                defaultChecked={current.actions.includes('no_action')}
                                {...register('actions')}
                            />
                            No Action Required
                        </label>
                        <label className="flex items-center gap-2 m-2">
                            <input
                                type="checkbox"
                                className='w-4 h-4 border-2 border-[#E1E1E1] bg-[#E1E1E1] rounded-none appearance-none checked:bg-blue-600 checked:border-blue-600'
                                value="coaching"
                                defaultChecked={current.actions.includes('coaching')}
                                {...register('actions')}
                            />
                            Coaching/Mentoring
                        </label>
                        <label className="flex items-center gap-2 m-2">
                            <input
                                type="checkbox"
                                className='w-4 h-4 border-2 border-[#E1E1E1] bg-[#E1E1E1] rounded-none appearance-none checked:bg-blue-600 checked:border-blue-600'
                                value="training"
                                defaultChecked={current.actions.includes('training')}
                                {...register('actions')}
                            />
                            Training required
                        </label>
                        <label className="flex items-center gap-2 m-2">
                            <input
                                type="checkbox"
                                className='w-4 h-4 border-2 border-[#E1E1E1] bg-[#E1E1E1] rounded-none appearance-none checked:bg-blue-600 checked:border-blue-600'
                                value="promotion"
                                defaultChecked={current.actions.includes('promotion')}
                                {...register('actions')}
                            />
                            Promotion Consideration
                        </label>

                        <label className="flex items-center gap-2 m-2">
                            <input
                                type="checkbox"
                                className='w-4 h-4 border-2 border-[#E1E1E1] bg-[#E1E1E1] rounded-none appearance-none checked:bg-blue-600 checked:border-blue-600'
                                value="pip"
                                defaultChecked={current.actions.includes('pip')}
                                {...register('actions')}
                            />
                            Performance Improvement Plan (PIP)
                        </label>

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
    );
}

export default EditReviewForm;