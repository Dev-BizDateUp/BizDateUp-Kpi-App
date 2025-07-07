import { useContext, useEffect, useState } from "react"
import { GetterContext } from "../Context/NewContext"

export default function AppraisalForm() {
    const { employees, designations, departments } = useContext(GetterContext);
    const [selEmp, setSelEmp] = useState(null)
    const inputStyle = 'border-2 border-gray-300 rounded-lg p-2';
    const [formData, setFormData] = useState({
        employee_id: 0,
        start: "2025-07-01",
        end: "2025-07-01",
        manager_name: '',
        review_date: "2025-07-01",
        kpi_achieved_percentage: 0,
        competency_name: ['Communication Skills','Teamwork & Collaboration','Problem-Solving','Leadership & Ownership','Adaptability & Flexibility','Time Management'],
        competency_rating: [],
        competency_remarks: [],
        achievements: '',
        a_o_improve: '',
        overall_rating: 0,
        revised_ctc: 0,
        new_designation_id: null,
        bonus: 0,
        goals: ''
    })
    useEffect(() => {
        setSelEmp(employees[0])
        setFormData({
            ...formData,
            employee_id: employees[0]?.id,
            new_designation_id: designations[0].id
        })
    }, [employees, designations])
    return (
        <>
            <div className="flex flex-col">
                <label className='text-lg font-semibold'>
                    Employee
                </label>
                <select
                    className={inputStyle}
                    value={formData.employee_id}
                    onChange={e => {
                        setFormData({
                            ...formData,
                            employee_id: e.target.value
                        });
                        setSelEmp(employees.find(em => em.id == e.target.value));
                    }}
                >
                    {
                        employees.sort((a, b) => a.name.localeCompare(b.name)).map(
                            e => (
                                <option value={e.id}>
                                    {e.name}
                                </option>
                            )
                        )
                    }
                </select>
                <label className='text-lg font-semibold'>
                    Employee ID
                </label>
                <span className={inputStyle}>{formData.employee_id}</span>
                <label className='text-lg font-semibold'>
                    Employee Department
                </label>
                <span className={inputStyle}>{departments.find(d => d.id == selEmp?.department_id)?.name}</span>
                <label className='text-lg font-semibold'>
                    Employee Designation
                </label>
                <span className={inputStyle}>{designations.find(d => d.id == selEmp?.designation_id)?.name}</span>
                <label className='text-lg font-semibold'>
                    Appraisal Period
                </label>
                <div className="flex flex-row justify-stretch w-full">
                    <input
                        value={formData.start}
                        onChange={e => setFormData({
                            ...formData,
                            start: e.target.value
                        })}
                        placeholder="start" type="date" className={inputStyle + ' w-full'} />
                    <span className="p-2">to</span>
                    <input
                        value={formData.end}
                        onChange={e => setFormData({
                            ...formData,
                            end: e.target.value
                        })}
                        placeholder="end" type="date" className={inputStyle + ' w-full'} />
                </div>
                <label className='text-lg font-semibold'>
                    Manager Name
                </label>
                <input placeholder="Enter Manger name" className={inputStyle} value={formData.manager_name} onChange={e => setFormData({ ...formData, manager_name: e.target.value })} />
                <label className='text-lg font-semibold'>
                    Review Date
                </label>
                <input
                    value={formData.review_date}
                    onChange={e => setFormData({
                        ...formData,
                        review_date: e.target.value
                    })}
                    placeholder="end" type="date" className={inputStyle} />
                <label className='text-lg font-semibold'>
                    Percentage of KPI achieved
                </label>
                <input
                    value={formData.kpi_achieved_percentage}
                    onChange={e => setFormData({
                        ...formData,
                        kpi_achieved_percentage: e.target.value
                    })}
                    placeholder="end" type="number" className={inputStyle} />
            </div>
        </>
    )
}