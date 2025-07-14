import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getEmployees, addNewManagerReview } from '../../Api/Endpoints/endpoints';
import { GetterContext } from '../Context/NewContext';

function ReviewForm({ onReviewCreation }) {
    const { formState: { errors }, register, handleSubmit, reset } = useForm({
        manager_name:'',
        review_date:'',
        
    });
    const { MRActions, managers } = useContext(GetterContext)
    const [emps, setEmps] = useState([]);
    const [selEmp, setSelEmp] = useState(1);

    async function onSubmit(data) {
        let review = data;
        review.employee = selEmp;
        // console.log("form data",review)
        let res = await addNewManagerReview(review);
        console.log('Created manager review:', res.data)
        res.data.employees = selEmp;
        res.data.employees.designations = selEmp.designation;
        onReviewCreation(res.data);
        toast.success('Created manager review');
    }

    useEffect(_ => {
        (async _ => {
            const res = await getEmployees();
            setEmps(res.employees);
            setSelEmp(res.employees[0])
        })();
    }, [])
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
                    <label className='font-bold'>
                        Manager Name*
                    </label>
                    <select
                        {...register('manager_name', { required: "Enter manager name" })}
                        className='p-3 border-2 border-[#E1E1E1] rounded-md m-1'
                    >
                        <option>Select manager</option>
                        {
                            managers.map(m => (
                                <option value={m}>
                                    {m}
                                </option>
                            ))
                        }
                    </select>
                    {/* <input placeholder='Enter Manager Name' type='text' className='p-3 border-2 border-[#E1E1E1] rounded-md m-1' {...register('manager_name', { required: "Enter manager name" })} /> */}
                    <label className='font-bold'>
                        Review Dates*
                    </label>
                    <input className='p-3 border-2 border-[#E1E1E1] rounded-md m-1' type='datetime-local' {...register('review_date', { required: "Enter manager name" })} />
                    <label className='font-bold'>
                        Summary of KPIs assesed*
                    </label>
                    <input placeholder='Summary of KPIs Assessed' type='text' className='p-3 border-2 border-[#E1E1E1] rounded-md m-1' {...register('summary_kpi')} />
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
                        {...register("rating", { required: "You must give a rating" })}
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
                        {
                            MRActions.map(mr => (
                                <label className="flex items-center gap-2 m-2">
                                    <input
                                        type="checkbox"
                                        className='w-4 h-4 border-2 border-[#E1E1E1] bg-[#E1E1E1] rounded-none appearance-none checked:bg-blue-600 checked:border-blue-600'
                                        value={mr.value}
                                        {...register('actions', { required: "Select a rating" })}
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

export default ReviewForm;