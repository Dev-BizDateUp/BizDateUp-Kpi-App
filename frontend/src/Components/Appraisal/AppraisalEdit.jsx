import { useContext, useEffect, useState } from "react"
import { GetterContext, SetterContext } from "../Context/NewContext"
import { toast, ToastContainer } from "react-toastify";
import { editAppraisal } from "../../Api/Endpoints/appraisalEndpoints";

export default function AppraisalEdit({ onSuccess, app }) {
    const { appraisals, designations } = useContext(GetterContext);
    const { setAppraisals } = useContext(SetterContext)
    const inputStyle = 'border-2 border-gray-300 rounded-lg p-2';
    const [formData, setFormData] = useState(app)
    const [id, setID] = useState(0);
    useEffect(() => {
        setID(app.id)
        setFormData({
            ...app,
            start: app.start.substring(0, 10),
            end: app.end.substring(0, 10),
            review_date: app.review_date.substring(0, 10),
        });
        console.log('To edit ', app)
    }, [app]);

    function submitForm() {
        let form = formData;
        form.start = new Date(formData.start);
        form.end = new Date(formData.end);
        editAppraisal(form, id).then(
            (r) => {
                if (r.result) {
                    toast.success("Editted appraisal succesfully!");
                    console.log("Editted! ", r.result.data);
                    let aps = appraisals;
                    const index = appraisals.findIndex(k => k.id == app.id)
                    aps[index] = r.result.data;
                    setAppraisals(
                        aps
                    )
                    onSuccess();
                }
                else {
                    console.error("Could not make appraisal", r.error)
                    toast.error(`Could not make appraisal! ${r.error?.response?.data?.error}`)
                }
            }
        ).catch(
            (exc) => {
                toast.error("Could not create appraisal!")
                console.error("Failed to create appraisal ", exc);
            }
        )
        // console.log("new appraisal to be made: ",form);
    }

    return (
        <>
            <div className="flex flex-col overflow-y-auto max-h-[80vh]">
                <label className='text-lg font-semibold'>
                    Appraisal Period
                </label>
                <div className="flex flex-row justify-stretch w-full">
                    <input
                        value={formData.start}
                        onChange={e => setFormData({ ...formData, start: e.target.value })}
                        type="date"
                        className={inputStyle + ' w-full'}
                    />
                    <span className="p-2">to</span>
                    <input
                        value={formData.end}
                        onChange={e => setFormData({ ...formData, end: e.target.value })}
                        type="date"
                        className={inputStyle + ' w-full'}
                    />
                </div>

                <label className='text-lg font-semibold'>
                    Manager Name
                </label>
                <input
                    placeholder="Enter Manager name"
                    className={inputStyle}
                    value={formData.manager_name}
                    onChange={e => setFormData({ ...formData, manager_name: e.target.value })}
                />

                <label className='text-lg font-semibold'>
                    Review Date
                </label>
                <input
                    value={formData.review_date}
                    onChange={e => setFormData({ ...formData, review_date: e.target.value })}
                    type="date"
                    className={inputStyle}
                />

                <label className='text-lg font-semibold'>
                    Percentage of KPI achieved
                </label>
                <input
                    value={formData.kpi_achieved_percentage}
                    onChange={e => setFormData({ ...formData, kpi_achieved_percentage: Number(e.target.value) })}
                    type="number"
                    className={inputStyle}
                />

                <label className='text-lg font-bold'>
                    Core Competencies
                </label>
                <div className="p-4 flex flex-col gap-1">
                    {
                        formData.competency_name.map((name, index) => (
                            <div key={index}>
                                <label className='text-lg font-semibold'>{name}</label>
                                <div className="flex flex-row gap-1">
                                    <select
                                        value={formData.competency_rating[index]}
                                        onChange={e => {
                                            const newRatings = [...formData.competency_rating];
                                            newRatings[index] = Number(e.target.value);
                                            setFormData({ ...formData, competency_rating: newRatings });
                                        }}
                                        className={inputStyle + ' w-full'}
                                    >
                                        {[1, 2, 3, 4, 5].map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                    <input
                                        value={formData.competency_remarks[index]}
                                        onChange={e => {
                                            const newRemarks = [...formData.competency_remarks];
                                            newRemarks[index] = e.target.value;
                                            setFormData({ ...formData, competency_remarks: newRemarks });
                                        }}
                                        placeholder="Remarks"
                                        className={inputStyle + ' w-full'}
                                    />
                                </div>
                            </div>
                        ))
                    }
                </div>

                <label className='text-lg font-bold'>Achievements & Contributions</label>
                <textarea
                    className={inputStyle}
                    placeholder="List notable achievements and contributions"
                    value={formData.achievements}
                    onChange={e => setFormData({ ...formData, achievements: e.target.value })}
                />

                <label className='text-lg font-bold'>Areas of Improvement</label>
                <textarea
                    className={inputStyle}
                    placeholder="Mention areas where improvement is needed"
                    value={formData.a_o_improve}
                    onChange={e => setFormData({ ...formData, a_o_improve: e.target.value })}
                />

                <label className='text-lg font-bold'>Overall Rating</label>
                <select
                    className={inputStyle}
                    value={formData.overall_rating}
                    onChange={e => setFormData({ ...formData, overall_rating: Number(e.target.value) })}

                >
                    {
                        [1, 2, 3, 4, 5].map(r => (
                            <option value={r}>
                                {r}
                            </option>
                        ))
                    }
                </select>
                <label className='text-lg font-bold pt-2'>
                    Appraisal Decision
                </label>
                <div className="px-3 flex flex-col">
                    {/* Revised CTC */}
                    <label className='text-lg'>Revised CTC Applicable?</label>
                    <div className="flex gap-4 mb-2">
                        <label>
                            <input
                                type="radio"
                                name="revised_ctc"
                                checked={formData.revised_ctc !== null}
                                onChange={() => setFormData({ ...formData, revised_ctc: 0 })}
                            />
                            Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="revised_ctc"
                                checked={formData.revised_ctc === null}
                                onChange={() => setFormData({ ...formData, revised_ctc: null })}
                            />
                            No
                        </label>
                    </div>
                    {formData.revised_ctc !== null && (
                        <>
                            <label className='text-lg'>Revised CTC (₹)</label>
                            <input
                                type="number"
                                className={inputStyle}
                                value={formData.revised_ctc}
                                onChange={e => setFormData({ ...formData, revised_ctc: Number(e.target.value) })}
                            />
                        </>
                    )}

                    {/* New Designation */}
                    <label className='text-lg '>Change Designation?</label>
                    <div className="flex gap-4 mb-2">
                        <label>
                            <input
                                type="radio"
                                name="new_designation"
                                checked={formData.new_designation_id !== null}
                                onChange={() => setFormData({ ...formData, new_designation_id: designations[0]?.id || 0 })}
                            />
                            Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="new_designation"
                                checked={formData.new_designation_id === null}
                                onChange={() => setFormData({ ...formData, new_designation_id: null })}
                            />
                            No
                        </label>
                    </div>
                    {formData.new_designation_id !== null && (
                        <>
                            <label className='text-lg '>New Designation</label>
                            <select
                                className={inputStyle}
                                value={formData.new_designation_id}
                                onChange={e => setFormData({ ...formData, new_designation_id: Number(e.target.value) })}
                            >
                                {designations.sort((a, b) => a.name.localeCompare(b.name)).map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </>
                    )}

                    {/* Bonus */}
                    <label className='text-lg'>Bonus Applicable?</label>
                    <div className="flex gap-4 mb-2">
                        <label>
                            <input
                                type="radio"
                                name="bonus"
                                checked={formData.bonus !== null}
                                onChange={() => setFormData({ ...formData, bonus: 0 })}
                            />
                            Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="bonus"
                                checked={formData.bonus === null}
                                onChange={() => setFormData({ ...formData, bonus: null })}
                            />
                            No
                        </label>
                    </div>
                    {formData.bonus !== null && (
                        <>
                            <label className='text-lg '>Bonus (₹)</label>
                            <input
                                type="number"
                                className={inputStyle}
                                value={formData.bonus}
                                onChange={e => setFormData({ ...formData, bonus: Number(e.target.value) })}
                            />
                        </>
                    )}


                    <label className='text-lg '>Goals for Next Cycle</label>
                    <textarea
                        className={inputStyle}
                        placeholder="Define clear goals or expectations"
                        value={formData.goals}
                        onChange={e => setFormData({ ...formData, goals: e.target.value })}
                    />
                </div>
                <button
                    onClick={() => submitForm()}
                    className="bg-[#312F54] text-2xl text-white m-2 mt-6 py-3 rounded-xl hover:cursor-pointer">
                    Submit
                </button>
            </div>
        </>
    )
}