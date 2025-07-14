import { useContext, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { GetterContext, SetterContext } from "../Context/NewContext";
import { toast } from "react-toastify";
import { createAppraisal } from "../../Api/Endpoints/appraisalEndpoints";

export default function AppraisalForm({ onSuccess }) {
    const { employees, appraisals, designations, departments, managers } = useContext(GetterContext);
    const { setAppraisals } = useContext(SetterContext);

    const defaultCompetencies = [
        { name: 'Communication Skills', rating: '', remarks: null },
        { name: 'Teamwork & Collaboration', rating: '', remarks: null },
        { name: 'Problem-Solving', rating: '', remarks: null },
        { name: 'Leadership & Ownership', rating: '', remarks: null },
        { name: 'Adaptability & Flexibility', rating: '', remarks: null },
        { name: 'Time Management', rating: '', remarks: null },
    ];

    const {
        register,
        formState: { errors },
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
    } = useForm({
        defaultValues: {
            employee_id: '',
            start: "",
            end: "",
            manager_name: '',
            review_date: "",
            kpi_achieved_percentage: null,
            competencies: defaultCompetencies,
            achievements: '',
            a_o_improve: '',
            overall_rating: null,
            revised_ctc: null,
            new_designation_id: null,
            bonus: null,
            goals: ''
        }
    });

    const { fields: competencyFields } = useFieldArray({
        control,
        name: "competencies"
    });

    // Watch employee_id to update related fields
    const employee_id = watch("employee_id");
    const selEmp = employees.find(e => e.id === Number(employee_id));
    const onSubmit = async (data) => {
        // Prepare data for API
        const form = {
            ...data,
            start: new Date(data.start),
            end: new Date(data.end),
            competency_name: data.competencies.map(c => c.name),
            competency_rating: data.competencies.map(c => c.rating),
            competency_remarks: data.competencies.map(c => c.remarks),
        };
        delete form.competencies;

        try {
            const r = await createAppraisal(form);
            if (r.result) {
                toast.success("Created appraisal succesfully!");
                setAppraisals([...appraisals, r.result.data]);
                onSuccess();
            } else {
                toast.error(`Could not make appraisal! ${r.error?.response?.data?.error}`);
            }
        } catch (exc) {
            toast.error("Could not create appraisal!");
        }
    };

    const inputStyle = 'border-2 border-gray-300 rounded-lg p-2';

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col overflow-y-auto max-h-[80vh] gap-2">
                <label className='text-lg font-semibold'>Employee</label>
                <select
                    className={inputStyle}
                    aria-invalid={errors.employee_id ? "true" : "false"}
                    {...register("employee_id", { valueAsNumber: true, required: "Select an employee" })}
                >
                    <option value={''}>
                        Select employee
                    </option>
                    {employees.sort((a, b) => a.name.localeCompare(b.name)).map(
                        e => (
                            <option key={e.id} value={e.id}>
                                {e.name}
                            </option>
                        )
                    )}
                </select>
                {
                    errors.employee_id && <span className="text-red-500">Please select an employee</span>
                }

                <label className='text-lg font-semibold'>Employee ID</label>
                <span className={inputStyle}>{employee_id}</span>

                <label className='text-lg font-semibold'>Employee Department</label>
                <span className={inputStyle}>
                    {departments.find(d => d.id === selEmp?.department_id)?.name}
                </span>

                <label className='text-lg font-semibold'>Employee Designation</label>
                <span className={inputStyle}>
                    {designations.find(d => d.id === selEmp?.designation_id)?.name}
                </span>

                <label className='text-lg font-semibold'>Appraisal Period</label>
                <div className="flex flex-row justify-stretch w-full">
                    <div className="flex flex-col w-full">
                        <input
                            type="date"
                            className={inputStyle + ' w-full'}
                            {...register("start", { required: "Start date is required" })}
                            aria-invalid={errors.start ? "true" : "false"}
                        />
                        {errors.start && <span className="text-red-500">Please select start date</span>}
                    </div>

                    <span className="p-2">to</span>
                    <div className="flex flex-col w-full">
                        <input
                            type="date"
                            className={inputStyle + ' w-full'}
                            aria-invalid={errors.end ? "true" : "false"}
                            {...register("end", { required: "End date is required" })}
                        />
                        {errors.end && <span className="text-red-500">Please select end date</span>}

                    </div>

                </div>

                <label className='text-lg font-semibold'>Manager Name</label>
                <select
                    className={inputStyle}
                    {...register("manager_name", { required: "Manager name is required" })}
                    aria-invalid={errors.manager_name ? "true" : "false"}
                >
                    <option value="" disabled>Select manager</option>
                    {managers.map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
                {
                    errors.manager_name && <span className="text-red-500">Please select a manager</span>
                }

                <label className='text-lg font-semibold'>Review Date</label>
                <input
                    type="date"
                    className={inputStyle}
                    {...register("review_date", { required: "Please select review date" })}
                    aria-invalid={errors.review_date ? "true" : "false"}
                />
                {
                    errors.review_date && <span className="text-red-500">Please select a review date</span>
                }

                <label className='text-lg font-semibold'>Percentage of KPI achieved</label>
                <input
                    type="number"
                    className={inputStyle}
                    aria-invalid={errors.kpi_achieved_percentage ? "true" : "false"}
                    {...register("kpi_achieved_percentage", { valueAsNumber: true, required: "KPI % achieved is required" })}
                />
                {
                    errors.kpi_achieved_percentage && <span className="text-red-500">Please enter kpi % achieved</span>
                }

                <label className='text-lg font-bold'>Core Competencies</label>
                <div className="p-4 flex flex-col gap-1">
                    {competencyFields.map((field, index) => (
                        <div key={field.id}>
                            <label className='text-lg font-semibold'>{field.name}</label>
                            <div className="flex flex-row gap-1">
                                <Controller
                                    control={control}
                                    name={`competencies.${index}.rating`}
                                    rules={{ required: "Please select a rating" }}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className={inputStyle + ' w-full'}
                                            aria-invalid={errors.competencies?.[index]?.rating ? "true" : "false"}
                                        >
                                            <option value="">
                                                Select rating
                                            </option>
                                            {[1, 2, 3, 4, 5].map(r => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`competencies.${index}.remarks`}
                                    rules={{ required: "Please enter remarks" }}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            placeholder="Remarks"
                                            className={inputStyle + ' w-full'}
                                            aria-invalid={errors.competencies?.[index]?.remarks ? "true" : "false"}
                                        />
                                    )}
                                />
                            </div>
                            {(errors.competencies?.[index]?.rating || errors.competencies?.[index]?.remarks) && (
                                <div className="text-red-500 flex flex-row w-full justify-evenly">
                                    {errors.competencies?.[index]?.rating && <span>{errors.competencies[index].rating.message}</span>}
                                    {errors.competencies?.[index]?.remarks && <span>{errors.competencies[index].remarks.message}</span>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <label className='text-lg font-bold'>Achievements & Contributions</label>
                <input
                    type="text"
                    className={inputStyle}
                    placeholder="List notable achievements and contributions"
                    {...register("achievements", { required: "Please enter achievements" })}
                    aria-invalid={errors.achievements ? "true" : "false"}
                />
                {errors.achievements && <span className="text-red-500">{errors.achievements.message}</span>}

                <label className='text-lg font-bold'>Areas of Improvement</label>
                <input
                    type="text"
                    className={inputStyle}
                    placeholder="Mention areas where improvement is needed"
                    {...register("a_o_improve", { required: "Please enter areas of improvement" })}
                    aria-invalid={errors.a_o_improve ? "true" : "false"}
                />
                {errors.a_o_improve && <span className="text-red-500">{errors.a_o_improve.message}</span>}

                <label className='text-lg font-bold'>Overall Rating</label>
                <select
                    className={inputStyle}
                    {...register("overall_rating", { valueAsNumber: true, required: "Please select overall rating" })}
                    aria-invalid={errors.overall_rating ? "true" : "false"}
                >
                    <option value="">Select rating</option>
                    {[1, 2, 3, 4, 5].map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
                {errors.overall_rating && <span className="text-red-500">{errors.overall_rating.message}</span>}

                <label className='text-lg font-bold pt-2'>Appraisal Decision</label>
                <div className="px-3 flex flex-col">
                    {/* Revised CTC */}
                    <label className='text-lg'>Revised CTC Applicable?</label>
                    <div className="flex gap-4 mb-2">
                        <label>
                            <input
                                type="radio"
                                {...register("revised_ctc", { required: "Please select if revised CTC is applicable" })}
                                value={0}
                                checked={watch("revised_ctc") !== null}
                                onChange={() => setValue("revised_ctc", 0)}
                            />
                            Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                {...register("revised_ctc", { required: "Please select if revised CTC is applicable" })}
                                value=""
                                checked={watch("revised_ctc") === null}
                                onChange={() => setValue("revised_ctc", null)}
                            />
                            No
                        </label>
                    </div>
                    {errors.revised_ctc && <span className="text-red-500">{errors.revised_ctc.message}</span>}
                    {watch("revised_ctc") !== null && (
                        <>
                            <label className='text-lg'>Revised CTC (₹)</label>
                            <input
                                type="number"
                                className={inputStyle}
                                {...register("revised_ctc", { valueAsNumber: true, required: "Please enter revised CTC" })}
                                aria-invalid={errors.revised_ctc ? "true" : "false"}
                            />
                            {errors.revised_ctc && <span className="text-red-500">{errors.revised_ctc.message}</span>}
                        </>
                    )}

                    {/* New Designation */}
                    <label className='text-lg '>Change Designation?</label>
                    <div className="flex gap-4 mb-2">
                        <label>
                            <input
                                type="radio"
                                {...register("new_designation_id", { required: "Please select if designation is changing" })}
                                value={designations[0]?.id || 0}
                                checked={watch("new_designation_id") !== null}
                                onChange={() => setValue("new_designation_id", designations[0]?.id || 0)}
                            />
                            Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                {...register("new_designation_id", { required: "Please select if designation is changing" })}
                                value=""
                                checked={watch("new_designation_id") === null}
                                onChange={() => setValue("new_designation_id", null)}
                            />
                            No
                        </label>
                    </div>
                    {errors.new_designation_id && <span className="text-red-500">{errors.new_designation_id.message}</span>}
                    {watch("new_designation_id") !== null && (
                        <>
                            <label className='text-lg '>New Designation</label>
                            <select
                                className={inputStyle}
                                {...register("new_designation_id", { valueAsNumber: true, required: "Please select new designation" })}
                                aria-invalid={errors.new_designation_id ? "true" : "false"}
                            >
                                <option value="">Select designation</option>
                                {designations.sort((a, b) => a.name.localeCompare(b.name)).map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                            {errors.new_designation_id && <span className="text-red-500">{errors.new_designation_id.message}</span>}
                        </>
                    )}

                    {/* Bonus */}
                    <label className='text-lg'>Bonus Applicable?</label>
                    <div className="flex gap-4 mb-2">
                        <label>
                            <input
                                type="radio"
                                {...register("bonus", { required: "Please select if bonus is applicable" })}
                                value={0}
                                checked={watch("bonus") !== null}
                                onChange={() => setValue("bonus", 0)}
                            />
                            Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                {...register("bonus", { required: "Please select if bonus is applicable" })}
                                value=""
                                checked={watch("bonus") === null}
                                onChange={() => setValue("bonus", null)}
                            />
                            No
                        </label>
                    </div>
                    {errors.bonus && <span className="text-red-500">{errors.bonus.message}</span>}
                    {watch("bonus") !== null && (
                        <>
                            <label className='text-lg '>Bonus (₹)</label>
                            <input
                                type="number"
                                className={inputStyle}
                                {...register("bonus", { valueAsNumber: true, required: "Please enter bonus amount" })}
                                aria-invalid={errors.bonus ? "true" : "false"}
                            />
                            {errors.bonus && <span className="text-red-500">{errors.bonus.message}</span>}
                        </>
                    )}

                    <label className='text-lg '>Goals for Next Cycle</label>
                    <textarea
                        className={inputStyle}
                        placeholder="Define clear goals or expectations"
                        {...register("goals", { required: "Please enter goals for next cycle" })}
                        aria-invalid={errors.goals ? "true" : "false"}
                    />
                    {errors.goals && <span className="text-red-500">{errors.goals.message}</span>}
                </div>
                <button
                    type="submit"
                    className="bg-[#312F54] text-2xl text-white m-2 mt-6 py-3 rounded-xl hover:cursor-pointer">
                    Submit
                </button>
            </div>
        </form>
    );
}
