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
    const { MRActions, managers }   = useContext(GetterContext);

   async function onSubmit(data) {
  try {
    const payload = {
      review_type: "MONTHLY",
      improvement: data.improvement,
      rating: Number(data.rating),
      manager_feedback: data.manager_feedback,
      key_achievements: data.key_achievements,
    };



    const res = await editManagerReview(current.id, payload);

    onReviewEditted(res);
    toast.success("Edited manager review");
  } catch (error) {
    console.error(error);
    toast.error("Failed to update review");
  }
}


 

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col overflow-y-auto max-h-[75vh] scroll-smooth md:scroll-auto ">
                  
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
                    
                  <label className="font-bold">
  Manager Feedback
</label>
<input
  placeholder="Enter manager feedback"
  className="p-3 border-2 border-[#E1E1E1] rounded-md m-1"
  {...register("manager_feedback")}
/>
<label className="font-bold">
  Key Achievements
</label>
<input
  placeholder="Enter key achievements for this month"
  className="p-3 border-2 border-[#E1E1E1] rounded-md m-1"
  {...register("key_achievements")}
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