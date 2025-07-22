import { useContext } from "react";
import { GetterContext } from "../Context/NewContext";

function displayDate(date) {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}


export default function AppraisalView({ id }) {
    const { appraisals, employees, departments, designations } = useContext(GetterContext);

    const selAppraisal = appraisals?.find(a => a.id === id);
    const selEmp = employees.find(e => e.id === selAppraisal?.employee_id);

    if (!selAppraisal) return <div className="text-red-500 p-4">Appraisal not found.</div>;

    return (
        <div className="flex flex-col overflow-y-auto max-h-[80vh]">
            {/* Employee Info */}
            <div className="m-1 p-1">
                <label className="bg-[#F7F7F7] p-2 rounded-lg font-bold">Employee Name</label>
                <span className="mx-3">{selEmp?.name || "N/A"}</span>
            </div>
            <div className="m-1 p-1">
                <label className="bg-[#F7F7F7] p-2 rounded-lg font-bold">Employee ID</label>
                <span className="mx-3">{selAppraisal.employee_id}</span>
            </div>
            <div className="m-1 p-1">
                <label className="bg-[#F7F7F7] p-2 rounded-lg font-bold">Department</label>
                <span className="mx-3">
                    {departments.find(d => d.id === selEmp?.department_id)?.name || "N/A"}
                </span>
            </div>
            <div className="m-1 p-1">
                <label className="bg-[#F7F7F7] p-2 rounded-lg font-bold">Designation</label>
                <span className="mx-3">
                    {designations.find(d => d.id === selEmp?.designation_id)?.name || "N/A"}
                </span>
            </div>

            {/* Appraisal Metadata */}
            <div className="m-1 p-1">
                <label className="bg-[#F7F7F7] p-2 rounded-lg font-bold">Appraisal Period</label>
                <span className="mx-3">{displayDate(selAppraisal.start)} to {displayDate(selAppraisal.end)}</span>
            </div>
            <div className="m-1 p-1">
                <label className="bg-[#F7F7F7] p-2 rounded-lg font-bold">Manager Name</label>
                <span className="mx-3">{selAppraisal.manager_name || "N/A"}</span>
            </div>
            <div className="m-1 p-1">
                <label className="bg-[#F7F7F7] p-2 rounded-lg font-bold">Review Date</label>
                <span className="mx-3">{displayDate(selAppraisal.review_date)}</span>
            </div>
            <div className="m-1 p-1">
                <label className="bg-[#F7F7F7] p-2 rounded-lg font-bold">KPI Achieved (%)</label>
                <span className="mx-3">{selAppraisal.kpi_achieved_percentage}%</span>
            </div>

            {/* Competencies */}
            <div className="m-1 p-1">
                <label className="bg-[#F7F7F7] p-2 rounded-lg font-bold">Core Competencies</label>
                <div className="ml-4 mt-2">
                    {selAppraisal.competency_name.map((name, i) => (
                        <div key={i} className="mb-2">
                            <div><span className="font-semibold">{name}</span></div>
                            <div className="ml-2">Rating: {selAppraisal.competency_rating[i]}</div>
                            <div className="ml-2">Remarks: {selAppraisal.competency_remarks[i] || "None"}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Achievements */}
            <div className="m-1 p-1">
                <label className="bg-[#F7F7F7] p-2 rounded-lg font-bold">Achievements & Contributions</label>
                <span className="mx-3">{selAppraisal.achievements || "None"}</span>
            </div>

            {/* Areas of Improvement */}
            <div className="m-1 p-1">
                <label className="bg-[#F7F7F7] p-2 rounded-lg font-bold">Areas of Improvement</label>
                <span className="mx-3">{selAppraisal.a_o_improve || "None"}</span>
            </div>

            {/* Overall Rating */}
            <div className="m-1 p-1">
                <label className="bg-[#F7F7F7] p-2 rounded-lg font-bold">Overall Rating</label>
                <span className="mx-3">{selAppraisal.overall_rating}/5</span>
            </div>

            {/* Revised CTC */}
            {selAppraisal.revised_ctc !== null && (
                <div className="m-1 p-1">
                    <label className="bg-[#F7F7F7] p-2 rounded-lg font-bold">Revised CTC</label>
                    <span className="mx-3">₹{selAppraisal.revised_ctc}</span>
                </div>
            )}

            {/* New Designation */}
            {selAppraisal.new_designation_id !== null && (
                <div className="m-1 p-1">
                    <label className="bg-[#F7F7F7] p-2 rounded-lg font-bold">New Designation</label>
                    <span className="mx-3">
                        {designations.find(d => d.id === selAppraisal.new_designation_id)?.name || "N/A"}
                    </span>
                </div>
            )}

            {/* Bonus */}
            {selAppraisal.bonus !== null && (
                <div className="m-1 p-1">
                    <label className="bg-[#F7F7F7] p-2 rounded-lg font-bold">Bonus</label>
                    <span className="mx-3">₹{selAppraisal.bonus}</span>
                </div>
            )}

            {/* Goals */}
            {selAppraisal.goals !== null && (
                <div className="m-1 p-1">
                    <label className="bg-[#F7F7F7] p-2 rounded-lg font-bold">Goals / Expectations for Next Cycle</label>
                    <span className="mx-3">{selAppraisal.goals}</span>
                </div>
            )}
        </div>
    );
}
